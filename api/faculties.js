/**
 * Faculty API Endpoints
 * 
 * CRUD operations for faculties
 */

const db = require('../db-connection');

/**
 * GET /api/faculties
 * Get all faculties with their universities
 */
async function getAllFaculties(req, res) {
  try {
    const { university_id, search } = req.query;

    let sql = `
      SELECT 
        f.Faculty_ID,
        f.Faculty_Name,
        f.Location,
        f.Contact_Email,
        f.University_ID,
        u.University_Name,
        u.Acronym
      FROM FACULTY f
      LEFT JOIN UNIVERSITY u ON f.University_ID = u.University_ID
      WHERE 1=1
    `;

    const params = [];

    if (university_id) {
      sql += ' AND f.University_ID = ?';
      params.push(university_id);
    }

    if (search) {
      sql += ' AND (f.Faculty_Name LIKE ? OR f.Location LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY f.Faculty_Name';

    const faculties = await db.query(sql, params);
    res.json({ success: true, data: faculties });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/faculties/:id
 * Get a single faculty by ID
 */
async function getFacultyById(req, res) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        f.*,
        u.University_Name,
        u.Acronym,
        u.Address AS University_Address
      FROM FACULTY f
      LEFT JOIN UNIVERSITY u ON f.University_ID = u.University_ID
      WHERE f.Faculty_ID = ?
    `;

    const [faculty] = await db.query(sql, [id]);

    if (!faculty) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    // Get departments for this faculty
    const departments = await db.query(`
      SELECT d.*
      FROM DEPARTMENT d
      INNER JOIN ACADEMIC_DEPARTMENT ad ON d.Department_ID = ad.Department_ID
      WHERE ad.Faculty_ID = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        ...faculty,
        departments
      }
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/faculties
 * Create a new faculty
 */
async function createFaculty(req, res) {
  try {
    const { Faculty_Name, Location, Contact_Email, University_ID } = req.body;

    if (!Faculty_Name) {
      return res.status(400).json({
        success: false,
        error: 'Faculty_Name is required'
      });
    }

    const sql = `
      INSERT INTO FACULTY (Faculty_Name, Location, Contact_Email, University_ID)
      VALUES (?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      Faculty_Name,
      Location || null,
      Contact_Email || null,
      University_ID || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: { Faculty_ID: result.insertId }
    });
  } catch (error) {
    console.error('Error creating faculty:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * PUT /api/faculties/:id
 * Update a faculty
 */
async function updateFaculty(req, res) {
  try {
    const { id } = req.params;
    const { Faculty_Name, Location, Contact_Email, University_ID } = req.body;

    const updateFields = [];
    const values = [];

    if (Faculty_Name !== undefined) {
      updateFields.push('Faculty_Name = ?');
      values.push(Faculty_Name);
    }
    if (Location !== undefined) {
      updateFields.push('Location = ?');
      values.push(Location);
    }
    if (Contact_Email !== undefined) {
      updateFields.push('Contact_Email = ?');
      values.push(Contact_Email);
    }
    if (University_ID !== undefined) {
      updateFields.push('University_ID = ?');
      values.push(University_ID);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    values.push(id);

    const sql = `UPDATE FACULTY SET ${updateFields.join(', ')} WHERE Faculty_ID = ?`;
    await db.query(sql, values);

    res.json({
      success: true,
      message: 'Faculty updated successfully'
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * DELETE /api/faculties/:id
 * Delete a faculty
 */
async function deleteFaculty(req, res) {
  try {
    const { id } = req.params;

    // Check if faculty has departments
    const [departments] = await db.query(
      'SELECT COUNT(*) AS count FROM ACADEMIC_DEPARTMENT WHERE Faculty_ID = ?',
      [id]
    );

    if (departments.count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete faculty with associated departments'
      });
    }

    await db.query('DELETE FROM FACULTY WHERE Faculty_ID = ?', [id]);

    res.json({
      success: true,
      message: 'Faculty deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/universities
 * Get all universities
 */
async function getAllUniversities(req, res) {
  try {
    const rows = await db.query('SELECT * FROM UNIVERSITY ORDER BY University_Name');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getAllFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAllUniversities
};

