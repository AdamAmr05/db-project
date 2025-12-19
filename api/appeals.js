const db = require('../db-connection');

// Get all appeals (with filters)
async function getAppeals(req, res) {
    try {
        const { status } = req.query;
        let query = `
            SELECT 
                ap.Appeal_ID,
                ap.Submission_Date,
                ap.Reason,
                ap.Original_Score,
                ap.Approval_Status,
                ap.appeal_outcome_Score,
                apr.Appraisal_ID,
                e.First_Name,
                e.Last_Name,
                j.Job_Title,
                pc.Cycle_Name
            FROM APPEAL ap
            JOIN APPRAISAL apr ON ap.Appraisal_ID = apr.Appraisal_ID
            JOIN JOB_ASSIGNMENT ja ON apr.Assignment_ID = ja.Assignment_ID
            JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
            JOIN JOB j ON ja.Job_ID = j.Job_ID
            JOIN PERFORMANCE_CYCLE pc ON apr.Cycle_ID = pc.Cycle_ID
        `;

        const params = [];
        if (status) {
            query += ' WHERE ap.Approval_Status = ?';
            params.push(status);
        }

        query += ' ORDER BY ap.Submission_Date DESC';

        const rows = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching appeals:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Submit a new appeal
async function submitAppeal(req, res) {
    try {
        const { appraisalId, reason } = req.body;

        // Check if appeal already exists
        const existing = await db.query('SELECT Appeal_ID FROM APPEAL WHERE Appraisal_ID = ?', [appraisalId]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, error: 'Appeal already exists for this appraisal' });
        }

        // Get Original Score
        const [appraisal] = await db.query('SELECT Overall_Score FROM APPRAISAL WHERE Appraisal_ID = ?', [appraisalId]);
        if (!appraisal) return res.status(404).json({ success: false, error: 'Appraisal not found' });

        // Use stored procedure for core insert
        await db.callProcedure('SubmitAppeal', [appraisalId, reason]);

        // Update Original_Score (procedure doesn't set it)
        const [appealRow] = await db.query(
            'SELECT Appeal_ID FROM APPEAL WHERE Appraisal_ID = ? ORDER BY Appeal_ID DESC LIMIT 1',
            [appraisalId]
        );
        if (appealRow?.Appeal_ID) {
            await db.query(
                'UPDATE APPEAL SET Original_Score = ? WHERE Appeal_ID = ?',
                [appraisal.Overall_Score, appealRow.Appeal_ID]
            );
        }

        res.json({ success: true, message: 'Appeal submitted successfully' });
    } catch (error) {
        console.error('Error submitting appeal:', error);
        if (error.code === '45000') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

// Review Appeal (Approve/Reject)
async function reviewAppeal(req, res) {
    try {
        const { id } = req.params;
        const { status, outcomeScore } = req.body; // status: 'Approved' | 'Rejected'

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        if (status === 'Approved' && !outcomeScore) {
            return res.status(400).json({ success: false, error: 'Outcome score is required for approval' });
        }

        // Update Appeal
        await db.query(
            `UPDATE APPEAL 
             SET Approval_Status = ?, appeal_outcome_Score = ?
             WHERE Appeal_ID = ?`,
            [status, status === 'Approved' ? outcomeScore : null, id]
        );

        // If Approved, should we update the actual Appraisal Score?
        // The requirements typically imply the Appeal Outcome overrides the Appraisal.
        // But the schema keeps them separate (Appraisal.Overall_Score vs Appeal.appeal_outcome_Score).
        // I will Update APPRAISAL.Overall_Score if approved, to reflect the new reality in main reports.

        if (status === 'Approved') {
            // Get Appraisal ID
            const [appeal] = await db.query('SELECT Appraisal_ID FROM APPEAL WHERE Appeal_ID = ?', [id]);
            if (appeal) {
                await db.query(
                    'UPDATE APPRAISAL SET Overall_Score = ? WHERE Appraisal_ID = ?',
                    [outcomeScore, appeal.Appraisal_ID]
                );
            }
        }

        res.json({ success: true, message: `Appeal ${status}` });
    } catch (error) {
        console.error('Error reviewing appeal:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    getAppeals,
    submitAppeal,
    reviewAppeal
};
