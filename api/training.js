const db = require('../db-connection');

// Get all training programs
async function getAllPrograms(req, res) {
    try {
        const query = `
            SELECT t.*, 
                   (SELECT COUNT(*) FROM EMPLOYEE_TRAINING et WHERE et.Program_ID = t.Program_ID) as Enrolled_Count
            FROM TRAINING_PROGRAM t
            ORDER BY t.Title
        `;
        const rows = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching training programs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get program by ID (includes enrolled employees)
async function getProgramById(req, res) {
    try {
        const { id } = req.params;
        const program = await db.query('SELECT * FROM TRAINING_PROGRAM WHERE Program_ID = ?', [id]);

        if (program.length === 0) {
            return res.status(404).json({ success: false, error: 'Program not found' });
        }

        // Get enrolled employees
        const enrollments = await db.query(`
            SELECT et.*, e.First_Name, e.Last_Name, e.Work_Email as Email
            FROM EMPLOYEE_TRAINING et
            JOIN EMPLOYEE e ON et.Employee_ID = e.Employee_ID
            WHERE et.Program_ID = ?
        `, [id]);

        // Get certificates per enrollment
        const certificates = await db.query(`
            SELECT tc.Certificate_ID, tc.ET_ID, tc.Issue_Date, tc.certificate_file_path
            FROM TRAINING_CERTIFICATE tc
            JOIN EMPLOYEE_TRAINING et ON tc.ET_ID = et.ET_ID
            WHERE et.Program_ID = ?
        `, [id]);

        const certMap = certificates.reduce((acc, cert) => {
            acc[cert.ET_ID] = acc[cert.ET_ID] || [];
            acc[cert.ET_ID].push(cert);
            return acc;
        }, {});

        const enrollmentsWithCerts = enrollments.map(enr => ({
            ...enr,
            certificates: certMap[enr.ET_ID] || []
        }));

        res.json({ success: true, data: { ...program[0], enrollments: enrollmentsWithCerts } });
    } catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Create program
async function createProgram(req, res) {
    try {
        const {
            Program_Code, Title, Objectives, Type,
            Subtype, Delivery_Method, Approval_Status
        } = req.body;

        if (!Program_Code || !Title) {
            return res.status(400).json({ success: false, error: 'Code and Title are required' });
        }

        // Use stored procedure for core insert/validation
        await db.callProcedure('AddTrainingProgram', [
            Program_Code,
            Title,
            Type || null,
            Delivery_Method || null
        ]);

        // Fetch the inserted Program_ID via unique Program_Code
        const [program] = await db.query(
            'SELECT Program_ID FROM TRAINING_PROGRAM WHERE Program_Code = ? ORDER BY Program_ID DESC LIMIT 1',
            [Program_Code]
        );

        // Update optional fields not covered by the procedure
        if (program?.Program_ID) {
            await db.query(
                `UPDATE TRAINING_PROGRAM 
                 SET Objectives = ?, Subtype = ?, Approval_Status = ?
                 WHERE Program_ID = ?`,
                [
                    Objectives || null,
                    Subtype || null,
                    Approval_Status || 'Pending',
                    program.Program_ID
                ]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Training program created successfully',
            id: program?.Program_ID
        });

    } catch (error) {
        console.error('Error creating program:', error);
        if (error.code === '45000') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

// Update program
async function updateProgram(req, res) {
    try {
        const { id } = req.params;
        const {
            Program_Code, Title, Objectives, Type,
            Subtype, Delivery_Method, Approval_Status
        } = req.body;

        const query = `
            UPDATE TRAINING_PROGRAM SET 
                Program_Code = ?, Title = ?, Objectives = ?, Type = ?, 
                Subtype = ?, Delivery_Method = ?, Approval_Status = ?
            WHERE Program_ID = ?
        `;

        await db.query(query, [
            Program_Code, Title, Objectives || null, Type || null,
            Subtype || null, Delivery_Method || null, Approval_Status || 'Pending',
            id
        ]);

        res.json({ success: true, message: 'Training program updated successfully' });

    } catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Delete program
async function deleteProgram(req, res) {
    try {
        const { id } = req.params;

        // Check for enrollments
        const enrollments = await db.query(
            'SELECT COUNT(*) as count FROM EMPLOYEE_TRAINING WHERE Program_ID = ?',
            [id]
        );

        if (enrollments[0].count > 0) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete program with enrolled employees.'
            });
        }

        await db.query('DELETE FROM TRAINING_PROGRAM WHERE Program_ID = ?', [id]);
        res.json({ success: true, message: 'Training program deleted successfully' });

    } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// Enroll employee
async function enrollEmployee(req, res) {
    try {
        const { id } = req.params; // Program ID
        const { Employee_ID } = req.body;

        if (!Employee_ID) {
            return res.status(400).json({ success: false, error: 'Employee ID is required' });
        }

        // Check if already enrolled
        const existing = await db.query(
            'SELECT * FROM EMPLOYEE_TRAINING WHERE Program_ID = ? AND Employee_ID = ?',
            [id, Employee_ID]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, error: 'Employee already enrolled in this program' });
        }

        // Use procedure for enrollment
        await db.callProcedure('AssignTrainingToEmployee', [
            Employee_ID,
            id
        ]);

        res.json({ success: true, message: 'Employee enrolled successfully' });

    } catch (error) {
        console.error('Error enrolling employee:', error);
        if (error.code === '45000') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

// Update enrollment status
async function updateEnrollmentStatus(req, res) {
    try {
        const { id, employeeId } = req.params;
        const { status } = req.body;

        // If marking as Completed, use procedure (RecordTrainingCompletion)
        if (status === 'Completed') {
            const [enr] = await db.query(
                'SELECT ET_ID FROM EMPLOYEE_TRAINING WHERE Program_ID = ? AND Employee_ID = ?',
                [id, employeeId]
            );
            if (!enr) {
                return res.status(404).json({ success: false, error: 'Enrollment not found' });
            }
            await db.callProcedure('RecordTrainingCompletion', [enr.ET_ID]);

            // Optionally issue a certificate if a file path is provided
            if (req.body.certificate_file_path) {
                await db.callProcedure('IssueTrainingCertificate', [
                    enr.ET_ID,
                    req.body.certificate_file_path
                ]);
            }
        } else {
            // Fallback to direct update for other statuses (e.g., Enrolled, Failed)
            await db.query(
                'UPDATE EMPLOYEE_TRAINING SET Completion_Status = ? WHERE Program_ID = ? AND Employee_ID = ?',
                [status, id, employeeId]
            );
        }

        res.json({ success: true, message: 'Enrollment status updated' });

    } catch (error) {
        console.error('Error updating enrollment:', error);
        if (error.code === '45000') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

// Delete enrollment (Unenroll)
async function deleteEnrollment(req, res) {
    try {
        const { id, employeeId } = req.params;

        await db.query(
            'DELETE FROM EMPLOYEE_TRAINING WHERE Program_ID = ? AND Employee_ID = ?',
            [id, employeeId]
        );

        res.json({ success: true, message: 'Employee unenrolled successfully' });

    } catch (error) {
        console.error('Error unenrolling employee:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    enrollEmployee,
    updateEnrollmentStatus,
    deleteEnrollment
};
