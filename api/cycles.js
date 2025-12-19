const db = require('../db-connection');

// Get all cycles
async function getAllCycles(req, res) {
    try {
        const cycles = await db.query('SELECT * FROM PERFORMANCE_CYCLE ORDER BY Start_Date DESC');
        res.json({ success: true, data: cycles });
    } catch (error) {
        console.error('Error fetching cycles:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get cycle by ID
async function getCycleById(req, res) {
    try {
        const { id } = req.params;
        const [cycle] = await db.query('SELECT * FROM PERFORMANCE_CYCLE WHERE Cycle_ID = ?', [id]);
        if (!cycle) return res.status(404).json({ success: false, error: 'Cycle not found' });
        res.json({ success: true, data: cycle });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Create cycle
async function createCycle(req, res) {
    try {
        const { Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline } = req.body;

        // Basic validation
        if (new Date(Start_Date) > new Date(End_Date)) {
            return res.status(400).json({ success: false, error: 'Start Date must be before End Date' });
        }

        const result = await db.query(
            'INSERT INTO PERFORMANCE_CYCLE (Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline) VALUES (?, ?, ?, ?, ?)',
            [Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline]
        );
        res.json({ success: true, message: 'Cycle created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating cycle:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Update cycle
async function updateCycle(req, res) {
    try {
        const { id } = req.params;
        const { Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline } = req.body;

        if (new Date(Start_Date) > new Date(End_Date)) {
            return res.status(400).json({ success: false, error: 'Start Date must be before End Date' });
        }

        await db.query(
            'UPDATE PERFORMANCE_CYCLE SET Cycle_Name=?, Cycle_Type=?, Start_Date=?, End_Date=?, Submission_Deadline=? WHERE Cycle_ID=?',
            [Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline, id]
        );
        res.json({ success: true, message: 'Cycle updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Delete cycle
async function deleteCycle(req, res) {
    try {
        const { id } = req.params;
        // Check for dependencies (Appraisals)
        const rows = await db.query('SELECT COUNT(*) as count FROM APPRAISAL WHERE Cycle_ID = ?', [id]);
        if (rows[0].count > 0) {
            return res.status(400).json({ success: false, error: 'Cannot delete cycle with existing appraisals.' });
        }

        await db.query('DELETE FROM PERFORMANCE_CYCLE WHERE Cycle_ID = ?', [id]);
        res.json({ success: true, message: 'Cycle deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    getAllCycles,
    getCycleById,
    createCycle,
    updateCycle,
    deleteCycle
};
