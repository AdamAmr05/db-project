const db = require('../db-connection');

// Get all jobs (with Department names)
async function getAllJobs(req, res) {
    try {
        const query = `
            SELECT j.*, d.Department_Name, 
                   (SELECT COUNT(*) FROM JOB_ASSIGNMENT ja WHERE ja.Job_ID = j.Job_ID AND ja.Status = 'Active') as Active_Holders
            FROM JOB j
            LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
            ORDER BY j.Job_Title
        `;
        const rows = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get job by ID
async function getJobById(req, res) {
    try {
        const { id } = req.params;
        const rows = await db.query('SELECT * FROM JOB WHERE Job_ID = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Create job
async function createJob(req, res) {
    try {
        const {
            Job_Code, Job_Title, Job_Level, Job_Category,
            Job_Grade, Min_Salary, Max_Salary, Job_Description,
            Department_ID, Reports_To
        } = req.body;

        // Basic validation
        if (!Job_Code || !Job_Title || !Department_ID) {
            return res.status(400).json({ success: false, error: 'Code, Title, and Department are required' });
        }

        const query = `
            INSERT INTO JOB (
                Job_Code, Job_Title, Job_Level, Job_Category, 
                Job_Grade, Min_Salary, Max_Salary, Job_Description, 
                Department_ID, Reports_To, Status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
        `;

        const result = await db.query(query, [
            Job_Code, Job_Title, Job_Level || null, Job_Category || null,
            Job_Grade || null, Min_Salary || 0, Max_Salary || 0, Job_Description || null,
            Department_ID, Reports_To || null
        ]);

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            id: result.insertId
        });

    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Update job
async function updateJob(req, res) {
    try {
        const { id } = req.params;
        const {
            Job_Code, Job_Title, Job_Level, Job_Category,
            Job_Grade, Min_Salary, Max_Salary, Job_Description,
            Department_ID, Reports_To, Status
        } = req.body;

        const query = `
            UPDATE JOB SET 
                Job_Code = ?, Job_Title = ?, Job_Level = ?, Job_Category = ?, 
                Job_Grade = ?, Min_Salary = ?, Max_Salary = ?, Job_Description = ?, 
                Department_ID = ?, Reports_To = ?, Status = ?
            WHERE Job_ID = ?
        `;

        await db.query(query, [
            Job_Code, Job_Title, Job_Level || null, Job_Category || null,
            Job_Grade || null, Min_Salary || 0, Max_Salary || 0, Job_Description || null,
            Department_ID, Reports_To || null, Status || 'Active',
            id
        ]);

        res.json({ success: true, message: 'Job updated successfully' });

    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Delete job
async function deleteJob(req, res) {
    try {
        const { id } = req.params;

        // Check for active assignments
        const assignments = await db.query(
            'SELECT COUNT(*) as count FROM JOB_ASSIGNMENT WHERE Job_ID = ?',
            [id]
        );

        if (assignments[0].count > 0) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete job with associated assignments. Deactivate it instead.'
            });
        }

        await db.query('DELETE FROM JOB WHERE Job_ID = ?', [id]);
        res.json({ success: true, message: 'Job deleted successfully' });

    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// --- Job Objectives & KPIs ---

async function getJobObjectives(req, res) {
    try {
        const { id } = req.params;
        // Fetch objectives
        const objectives = await db.query(
            'SELECT * FROM JOB_OBJECTIVE WHERE Job_ID = ? ORDER BY Objective_Title',
            [id]
        );

        // Fetch KPIs for each objective
        for (let obj of objectives) {
            obj.KPIs = await db.query(
                'SELECT * FROM OBJECTIVE_KPI WHERE Objective_ID = ?',
                [obj.Objective_ID]
            );
        }

        res.json({ success: true, data: objectives });
    } catch (error) {
        console.error('Error fetching objectives:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function createObjective(req, res) {
    try {
        const { id } = req.params; // Job_ID
        const { Objective_Title, Description, Weight } = req.body;

        // Use stored procedure for validation (weight <= 100)
        await db.callProcedure('AddJobObjective', [
            id,
            Objective_Title,
            Weight || 0
        ]);

        // If a description was provided, update the newly created objective
        if (Description) {
            const [inserted] = await db.query(
                'SELECT Objective_ID FROM JOB_OBJECTIVE WHERE Job_ID = ? ORDER BY Objective_ID DESC LIMIT 1',
                [id]
            );
            if (inserted?.Objective_ID) {
                await db.query(
                    'UPDATE JOB_OBJECTIVE SET Description = ? WHERE Objective_ID = ?',
                    [Description, inserted.Objective_ID]
                );
            }
        }

        res.json({ success: true, message: 'Objective added successfully' });
    } catch (error) {
        console.error('Error creating objective:', error);
        if (error.code === '45000') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

async function createKPI(req, res) {
    try {
        const { id } = req.params; // Objective_ID
        const { KPI_Name, Description, Measurement_Unit, Target_Value, Weight } = req.body;

        // Use stored procedure for core insert/validation
        await db.callProcedure('AddKPIToObjective', [
            id,
            KPI_Name,
            Weight || 0,
            Target_Value || 0
        ]);

        // Enrich with optional fields (description, unit)
        if (Description || Measurement_Unit) {
            const [inserted] = await db.query(
                'SELECT KPI_ID FROM OBJECTIVE_KPI WHERE Objective_ID = ? ORDER BY KPI_ID DESC LIMIT 1',
                [id]
            );
            if (inserted?.KPI_ID) {
                await db.query(
                    'UPDATE OBJECTIVE_KPI SET Description = ?, Measurement_Unit = ? WHERE KPI_ID = ?',
                    [Description || null, Measurement_Unit || null, inserted.KPI_ID]
                );
            }
        }

        res.json({ success: true, message: 'KPI added successfully' });
    } catch (error) {
        console.error('Error creating KPI:', error);
        if (error.code === '45000') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

async function deleteObjective(req, res) {
    try {
        const { id } = req.params; // Objective_ID
        await db.query('DELETE FROM JOB_OBJECTIVE WHERE Objective_ID = ?', [id]);
        res.json({ success: true, message: 'Objective deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function deleteKPI(req, res) {
    try {
        const { id } = req.params; // KPI_ID
        await db.query('DELETE FROM OBJECTIVE_KPI WHERE KPI_ID = ?', [id]);
        res.json({ success: true, message: 'KPI deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getJobObjectives,
    createObjective,
    createKPI,
    deleteObjective,
    deleteKPI
};
