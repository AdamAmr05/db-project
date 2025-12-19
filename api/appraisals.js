const db = require('../db-connection');

// Get employees available for appraisal in the active cycle
async function getAppraisalCandidates(req, res) {
    try {
        const { cycleId } = req.params;

        // Fetch employees with active job assignments
        const employees = await db.query(`
            SELECT 
                ja.Assignment_ID,
                e.Employee_ID,
                e.First_Name,
                e.Last_Name,
                j.Job_Title,
                d.Department_Name,
                a.Overall_Score,
                a.Appraisal_ID
            FROM JOB_ASSIGNMENT ja
            JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
            JOIN JOB j ON ja.Job_ID = j.Job_ID
            LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
            LEFT JOIN APPRAISAL a ON ja.Assignment_ID = a.Assignment_ID AND a.Cycle_ID = ?
            WHERE ja.Status = 'Active'
            AND ja.End_Date IS NULL
        `, [cycleId]);

        res.json({ success: true, data: employees });
    } catch (error) {
        console.error('Error fetching appraisal candidates:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get full appraisal data for an employee (Objectives, KPIs, Scores)
async function getAppraisalDetails(req, res) {
    try {
        const { cycleId, assignmentId } = req.params;

        // 1. Get Job ID from Assignment
        const [assignment] = await db.query('SELECT Job_ID, Employee_ID FROM JOB_ASSIGNMENT WHERE Assignment_ID = ?', [assignmentId]);
        if (!assignment) return res.status(404).json({ success: false, error: 'Assignment not found' });

        const jobId = assignment.Job_ID;

        // 2. Fetch Objectives and KPIs
        // We can do this with a JOIN
        const rows = await db.query(`
            SELECT 
                jo.Objective_ID,
                jo.Objective_Title,
                jo.Description as Obj_Desc,
                jo.Weight as Obj_Weight,
                ok.KPI_ID,
                ok.KPI_Name,
                ok.Description as KPI_Desc,
                ok.Measurement_Unit,
                ok.Target_Value,
                ok.Weight as KPI_Weight,
                eks.Employee_Score,
                eks.Actual_Value,
                eks.Comments as KPI_Comments
            FROM JOB_OBJECTIVE jo
            JOIN OBJECTIVE_KPI ok ON jo.Objective_ID = ok.Objective_ID
            LEFT JOIN EMPLOYEE_KPI_SCORE eks ON ok.KPI_ID = eks.KPI_ID 
                AND eks.Assignment_ID = ? 
                AND eks.Performance_Cycle_ID = ?
            WHERE jo.Job_ID = ?
            ORDER BY jo.Objective_ID, ok.KPI_ID
        `, [assignmentId, cycleId, jobId]);

        // 3. Structure the data
        const objectivesMap = {};
        rows.forEach(row => {
            if (!objectivesMap[row.Objective_ID]) {
                objectivesMap[row.Objective_ID] = {
                    Objective_ID: row.Objective_ID,
                    Title: row.Objective_Title,
                    Description: row.Obj_Desc,
                    Weight: row.Obj_Weight,
                    KPIs: []
                };
            }
            objectivesMap[row.Objective_ID].KPIs.push({
                KPI_ID: row.KPI_ID,
                KPI_Name: row.KPI_Name,
                Description: row.KPI_Desc,
                Unit: row.Measurement_Unit,
                Target: row.Target_Value,
                Weight: row.KPI_Weight,
                Score: row.Employee_Score,
                Actual_Value: row.Actual_Value,
                Comments: row.KPI_Comments
            });
        });

        const objectives = Object.values(objectivesMap);

        // 4. Fetch Appraisal Status/Comments if exists
        const [appraisal] = await db.query(
            'SELECT * FROM APPRAISAL WHERE Assignment_ID = ? AND Cycle_ID = ?',
            [assignmentId, cycleId]
        );

        res.json({
            success: true,
            data: {
                objectives,
                appraisal: appraisal || null
            }
        });

    } catch (error) {
        console.error('Error fetching appraisal details:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Upsert KPI Score
async function saveKPIScore(req, res) {
    try {
        const { assignmentId, kpiId, cycleId, score, actualValue, comments, reviewerId } = req.body;

        // Check if score exists
        const existing = await db.query(
            'SELECT Score_ID FROM EMPLOYEE_KPI_SCORE WHERE Assignment_ID = ? AND KPI_ID = ? AND Performance_Cycle_ID = ?',
            [assignmentId, kpiId, cycleId]
        );

        if (existing.length > 0) {
            // Update
            // Note: We need to calculate Weighted Score manually or rely on a trigger.
            // The existing trigger Calculate_Weighted_Score is BEFORE INSERT. 
            // So for UPDATE, we must calculate it manually in JS.

            // Get KPI Weight
            const [kpi] = await db.query('SELECT Weight FROM OBJECTIVE_KPI WHERE KPI_ID = ?', [kpiId]);
            const weight = kpi ? kpi.Weight : 0;
            const weightedScore = (score * weight / 100);

            await db.query(
                `UPDATE EMPLOYEE_KPI_SCORE 
                 SET Employee_Score = ?, Actual_Value = ?, Comments = ?, Weighted_Score = ?, Review_Date = CURDATE()
                 WHERE Score_ID = ?`,
                [score, actualValue, comments, weightedScore, existing[0].Score_ID]
            );
        } else {
            // Insert (Trigger handles weighted score)
            // Use Procedure or Direct Insert? Procedure AddEmployeeKPIScore exists.
            // Procedure AddEmployeeKPIScore(p_AssignID, p_KPIID, p_CycleID, p_Actual, p_Score, p_ReviewerID)
            // It uses curdate().

            // We'll use direct insert to include Comments if Procedure lacks it?
            // Procedure has ReviewerID but NO Comments. 
            // Table has Comments.
            // So I should use Direct Insert to support Comments.

            await db.query(
                `INSERT INTO EMPLOYEE_KPI_SCORE 
                (Assignment_ID, KPI_ID, Performance_Cycle_ID, Actual_Value, Employee_Score, Reviewer_ID, Comments, Review_Date)
                VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
                [assignmentId, kpiId, cycleId, actualValue, score, reviewerId || 1, comments]
            );
        }

        res.json({ success: true, message: 'Score saved' });
    } catch (error) {
        console.error('Error saving KPI score:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Finalize Appraisal
async function finalizeAppraisal(req, res) {
    try {
        const { assignmentId, cycleId, managerComments, reviewerId } = req.body;

        // 1. Calculate weighted score (Updates APPRAISAL table)
        // Wait, the procedure CalculateEmployeeWeightedScore UPDATES the appraisal.
        // So the Appraisal row MUST exist first.

        // Check if Appraisal exists
        const [existing] = await db.query(
            'SELECT Appraisal_ID FROM APPRAISAL WHERE Assignment_ID = ? AND Cycle_ID = ?',
            [assignmentId, cycleId]
        );

        if (!existing) {
            // Create Appraisal Row first
            // Procedure CreateAppraisal(p_AssignID, p_CycleID, p_ReviewerID, p_MgrComment)
            await db.callProcedure('CreateAppraisal', [assignmentId, cycleId, reviewerId || 1, managerComments]);
        } else {
            // Update comments if needed
            await db.query(
                'UPDATE APPRAISAL SET Manager_Comments = ?, Appraisal_Date = CURDATE() WHERE Appraisal_ID = ?',
                [managerComments, existing.Appraisal_ID]
            );
        }

        // 2. Calculate Score
        await db.callProcedure('CalculateEmployeeWeightedScore', [assignmentId, cycleId]);

        res.json({ success: true, message: 'Appraisal finalized' });
    } catch (error) {
        console.error('Error finalizing appraisal:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    getAppraisalCandidates,
    getAppraisalDetails,
    saveKPIScore,
    finalizeAppraisal
};
