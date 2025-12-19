const db = require('../db-connection');

// Get all departments
async function getAllDepartments(req, res) {
    try {
        const rows = await db.query('SELECT * FROM DEPARTMENT');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get department by ID with subtype details
async function getDepartmentById(req, res) {
    try {
        const { id } = req.params;
        const rows = await db.query(`
            SELECT d.*, 
                   ad.Faculty_ID, 
                   admin.University_ID 
            FROM DEPARTMENT d
            LEFT JOIN ACADEMIC_DEPARTMENT ad ON d.Department_ID = ad.Department_ID
            LEFT JOIN ADMINISTRATIVE_DEPARTMENT admin ON d.Department_ID = admin.Department_ID
            WHERE d.Department_ID = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Department not found' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching department:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Create new department
async function createDepartment(req, res) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { Department_Name, Department_Type, Location, Contact_Email, Faculty_ID, University_ID } = req.body;

        // 1. Insert into DEPARTMENT
        const [result] = await conn.query(
            'INSERT INTO DEPARTMENT (Department_Name, Department_Type, Location, Contact_Email) VALUES (?, ?, ?, ?)',
            [Department_Name, Department_Type, Location, Contact_Email]
        );

        const newDeptId = result.insertId;

        // 2. Insert into Subtype
        if (Department_Type === 'Academic') {
            if (!Faculty_ID) throw new Error('Faculty_ID is required for Academic Departments');
            await conn.query(
                'INSERT INTO ACADEMIC_DEPARTMENT (Department_ID, Faculty_ID) VALUES (?, ?)',
                [newDeptId, Faculty_ID]
            );
        } else if (Department_Type === 'Administrative') {
            if (!University_ID) throw new Error('University_ID is required for Administrative Departments');
            await conn.query(
                'INSERT INTO ADMINISTRATIVE_DEPARTMENT (Department_ID, University_ID) VALUES (?, ?)',
                [newDeptId, University_ID]
            );
        }

        await conn.commit();
        res.json({ success: true, message: 'Department created successfully', id: newDeptId });

    } catch (error) {
        await conn.rollback();
        console.error('Error creating department:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        conn.release();
    }
}

// Update department
async function updateDepartment(req, res) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { id } = req.params;
        const { Department_Name, Department_Type, Location, Contact_Email, Faculty_ID, University_ID } = req.body;

        // 1. Update DEPARTMENT
        await conn.query(
            'UPDATE DEPARTMENT SET Department_Name = ?, Department_Type = ?, Location = ?, Contact_Email = ? WHERE Department_ID = ?',
            [Department_Name, Department_Type, Location, Contact_Email, id]
        );

        // 2. Update Subtype (Assuming type doesn't change for simplicity, or handling it if it does)
        // First delete existing subtype entries to be safe/clean if type changed
        await conn.query('DELETE FROM ACADEMIC_DEPARTMENT WHERE Department_ID = ?', [id]);
        await conn.query('DELETE FROM ADMINISTRATIVE_DEPARTMENT WHERE Department_ID = ?', [id]);

        // Re-insert into correct subtype
        if (Department_Type === 'Academic') {
            if (!Faculty_ID) throw new Error('Faculty_ID is required for Academic Departments');
            await conn.query(
                'INSERT INTO ACADEMIC_DEPARTMENT (Department_ID, Faculty_ID) VALUES (?, ?)',
                [id, Faculty_ID]
            );
        } else if (Department_Type === 'Administrative') {
            if (!University_ID) throw new Error('University_ID is required for Administrative Departments');
            await conn.query(
                'INSERT INTO ADMINISTRATIVE_DEPARTMENT (Department_ID, University_ID) VALUES (?, ?)',
                [id, University_ID]
            );
        }

        await conn.commit();
        res.json({ success: true, message: 'Department updated successfully' });

    } catch (error) {
        await conn.rollback();
        console.error('Error updating department:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        conn.release();
    }
}

// Delete department
async function deleteDepartment(req, res) {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM DEPARTMENT WHERE Department_ID = ?', [id]);
        res.json({ success: true, message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
