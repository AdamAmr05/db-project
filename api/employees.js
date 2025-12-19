/**
 * Employee API Endpoints
 * 
 * CRUD operations for employees
 * Uses stored procedures where available
 */

const db = require('../db-connection');

/**
 * GET /api/employees
 * Get all employees with optional filtering
 */
async function getAllEmployees(req, res) {
  try {
    const { status, department, search } = req.query;

    let sql = `
      SELECT 
        e.*,
        d.Department_Name,
        j.Job_Title,
        ja.Status AS Assignment_Status
      FROM EMPLOYEE e
      LEFT JOIN JOB_ASSIGNMENT ja ON e.Employee_ID = ja.Employee_ID AND ja.Status = 'Active'
      LEFT JOIN JOB j ON ja.Job_ID = j.Job_ID
      LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      sql += ' AND e.Employment_Status = ?';
      params.push(status);
    }

    if (department) {
      sql += ' AND d.Department_Name = ?';
      params.push(department);
    }

    if (search) {
      sql += ' AND (e.First_Name LIKE ? OR e.Last_Name LIKE ? OR e.Work_Email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY e.Last_Name, e.First_Name';

    const employees = await db.query(sql, params);
    res.json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/employees/:id
 * Get a single employee by ID (uses stored procedure)
 */
async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;

    // Use your stored procedure
    const result = await db.callProcedure('GetEmployeeFullProfile', [id]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/employees
 * Create a new employee (uses stored procedure)
 */
async function createEmployee(req, res) {
  try {
    const {
      First_Name, Middle_Name, Last_Name, Gender, DOB, Nationality,
      Work_Email, Mobile_Phone, Employment_Status,
      Insurance_Number, Insurance_Start
    } = req.body;

    // Validate required fields
    if (!First_Name || !Last_Name || !Gender || !DOB || !Work_Email || !Mobile_Phone || !Employment_Status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Use your stored procedure
    await db.callProcedure('AddNewEmployee', [
      First_Name, Middle_Name || null, Last_Name,
      Gender, DOB, Nationality || null,
      Work_Email, Mobile_Phone, Employment_Status,
      Insurance_Number || null, Insurance_Start || new Date()
    ]);

    // Get the new employee ID
    const rows = await db.query('SELECT Employee_ID FROM EMPLOYEE WHERE Work_Email = ?', [Work_Email]);
    const newId = rows[0]?.Employee_ID;

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      id: newId
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * PUT /api/employees/:id
 * Update an employee
 */
async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const allowedFields = [
      'First_Name', 'Middle_Name', 'Last_Name', 'Gender', 'DOB', 'Nationality',
      'Mobile_Phone', 'Work_Phone', 'Work_Email', 'Personal_Email',
      'Employment_Status', 'Marital_Status', 'Religion'
    ];

    const updateFields = [];
    const values = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    values.push(id);

    const sql = `UPDATE EMPLOYEE SET ${updateFields.join(', ')} WHERE Employee_ID = ?`;
    await db.query(sql, values);

    res.json({
      success: true,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * PUT /api/employees/:id/contact
 * Update employee contact info (uses stored procedure)
 */
async function updateEmployeeContact(req, res) {
  try {
    const { id } = req.params;
    const { Mobile_Phone, Work_Phone, Work_Email } = req.body;

    await db.callProcedure('UpdateEmployeeContactInfo', [
      id, Mobile_Phone, Work_Phone, Work_Email
    ]);

    res.json({
      success: true,
      message: 'Contact information updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * DELETE /api/employees/:id
 * Delete an employee (only if no active assignments)
 */
async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;

    // Your trigger will prevent deletion if employee has active assignments
    const sql = 'DELETE FROM EMPLOYEE WHERE Employee_ID = ?';
    await db.query(sql, [id]);

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    // Trigger will throw error if employee has active assignments
    if (error.code === '45000') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/employees/:id/stats
 * Get employee statistics using database functions
 */
async function getEmployeeStats(req, res) {
  try {
    const { id } = req.params;

    // Get employee info
    const [employee] = await db.query('SELECT * FROM EMPLOYEE WHERE Employee_ID = ?', [id]);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Use your database functions
    const [fullNameResult] = await db.query('SELECT getEmployeeFullName(?) AS full_name', [id]);
    const [ageResult] = await db.query('SELECT getEmployeeAge(?) AS age', [employee.DOB]);
    const [serviceYearsResult] = await db.query('SELECT getServiceYears(?) AS service_years', [id]);

    res.json({
      success: true,
      data: {
        employee_id: id,
        full_name: fullNameResult.full_name,
        age: ageResult.age,
        service_years: serviceYearsResult.service_years,
        employment_status: employee.Employment_Status
      }
    });
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/jobs
 * Get all jobs for dropdown
 */
async function getAllJobs(req, res) {
  try {
    const jobs = await db.query('SELECT Job_ID, Job_Title, Department_ID FROM JOB ORDER BY Job_Title');
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/departments
 * Get all departments for dropdown
 */
async function getAllDepartments(req, res) {
  try {
    const depts = await db.query('SELECT Department_ID, Department_Name FROM DEPARTMENT ORDER BY Department_Name');
    res.json({ success: true, data: depts });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/contracts
 * Get all contracts for dropdown
 */
async function getAllContracts(req, res) {
  try {
    const contracts = await db.query('SELECT Contract_ID, Contract_Name FROM CONTRACT ORDER BY Contract_Name');
    res.json({ success: true, data: contracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/employees/:id/assign-job
 * Assign a job to an employee (closes previous active assignment if any)
 */
async function assignJob(req, res) {
  try {
    const { id } = req.params;
    const { Job_ID, Contract_ID, Salary, Start_Date } = req.body;

    if (!Job_ID || !Contract_ID || !Salary) {
      return res.status(400).json({ success: false, error: 'Missing job assignment details' });
    }

    // 1. Check for active assignment and close it
    const activeAssignments = await db.query(
      `SELECT Assignment_ID FROM JOB_ASSIGNMENT 
       WHERE Employee_ID = ? AND Status = 'Active' AND (End_Date IS NULL OR End_Date >= CURDATE())`,
      [id]
    );

    if (activeAssignments.length > 0) {
      // Close current assignment
      await db.callProcedure('CloseJobAssignment', [activeAssignments[0].Assignment_ID, new Date()]);
    }

    // 2. Assign new job
    // Ensure Start_Date is valid, default to today if not provided
    const startDate = Start_Date || new Date();

    await db.callProcedure('AssignJobToEmployee', [
      id, Job_ID, Contract_ID, startDate, Salary
    ]);

    res.json({ success: true, message: 'Job assigned successfully' });
  } catch (error) {
    console.error('Error assigning job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateEmployeeContact,
  deleteEmployee,
  getEmployeeStats,
  getAllJobs,
  getAllDepartments,
  getAllContracts,
  assignJob
};

