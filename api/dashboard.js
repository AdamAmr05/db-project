/**
 * Dashboard API Endpoints
 * 
 * Uses your database functions and views for dashboard metrics
 */

const db = require('../db-connection');

/**
 * GET /api/dashboard/stats
 * Get all dashboard statistics using your database functions
 */
async function getDashboardStats(req, res) {
  try {
    // Use your database functions
    const [
      totalEmployees,
      activeEmployees,
      totalJobs,
      activeJobs,
      totalTrainingPrograms,
      totalCertificates,
      kpiCompletionRate,
      avgAppraisalScore,
      totalDepartments,
      pendingAppraisals,
      upcomingDeadline
    ] = await Promise.all([
      db.query('SELECT getTotalEmployees() AS total'),
      db.query('SELECT getActiveEmployees() AS total'),
      db.query('SELECT getTotalJobs() AS total'),
      db.query('SELECT getActiveJobs() AS total'),
      db.query('SELECT getTotalTrainingPrograms() AS total'),
      db.query('SELECT getTotalCertificates() AS total'),
      db.query('SELECT getKPICompletionRate() AS rate'),
      db.query('SELECT getAvgAppraisalScore() AS score'),
      db.query('SELECT COUNT(*) AS total FROM DEPARTMENT'),
      db.query(`
        SELECT COUNT(*) AS total FROM JOB_ASSIGNMENT ja
        WHERE ja.Status = 'Active' AND ja.End_Date IS NULL
        AND NOT EXISTS (
          SELECT 1 FROM APPRAISAL a 
          JOIN PERFORMANCE_CYCLE pc ON a.Cycle_ID = pc.Cycle_ID
          WHERE a.Assignment_ID = ja.Assignment_ID 
          AND a.Overall_Score IS NOT NULL
          AND CURDATE() BETWEEN pc.Start_Date AND pc.End_Date
        )
      `),
      db.query('SELECT Cycle_Name, Submission_Deadline FROM PERFORMANCE_CYCLE WHERE Submission_Deadline >= CURDATE() ORDER BY Submission_Deadline ASC LIMIT 1')
    ]);

    res.json({
      success: true,
      data: {
        totalEmployees: totalEmployees[0].total,
        activeEmployees: activeEmployees[0].total,
        totalJobs: totalJobs[0].total,
        activeJobs: activeJobs[0].total,
        totalTrainingPrograms: totalTrainingPrograms[0].total,
        totalCertificates: totalCertificates[0].total,
        kpiCompletionRate: parseFloat(kpiCompletionRate[0].rate),
        avgAppraisalScore: parseFloat(avgAppraisalScore[0].score) / 20, // Convert 100-scale to 5-scale
        totalDepartments: totalDepartments[0].total,
        pendingAppraisals: pendingAppraisals[0].total,
        upcomingDeadline: upcomingDeadline[0] || null
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/dashboard/employee-count-by-dept
 * Get employee count by department (uses your view)
 */
async function getEmployeeCountByDept(req, res) {
  try {
    const data = await db.query('SELECT * FROM View_Employee_Count_By_Dept');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching employee count by dept:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/dashboard/gender-distribution
 * Get gender distribution (uses your view)
 */
async function getGenderDistribution(req, res) {
  try {
    const data = await db.query('SELECT * FROM View_Gender_Distribution');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching gender distribution:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/dashboard/status-distribution
 * Get employment status distribution (uses your view)
 */
async function getStatusDistribution(req, res) {
  try {
    const data = await db.query('SELECT * FROM View_Status_Distribution');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching status distribution:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/dashboard/jobs-by-level
 * Get jobs by level (uses your view)
 */
async function getJobsByLevel(req, res) {
  try {
    const data = await db.query('SELECT * FROM View_Jobs_By_Level');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching jobs by level:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/dashboard/salary-stats
 * Get salary statistics by category (uses your view)
 */
async function getSalaryStats(req, res) {
  try {
    const data = await db.query('SELECT * FROM View_Salary_Stats_By_Category');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching salary stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/dashboard/training-completion
 * Get training completion statistics (uses your view)
 */
async function getTrainingCompletionStats(req, res) {
  try {
    const data = await db.query('SELECT * FROM View_Training_Completion_Stats');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching training completion stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/dashboard/appraisals-per-cycle
 * Get appraisals per cycle (uses your view)
 */
async function getAppraisalsPerCycle(req, res) {
  try {
    const data = await db.query('SELECT * FROM View_Appraisals_Per_Cycle');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching appraisals per cycle:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/dashboard/active-cycle
 * Get the currently active performance cycle
 */
async function getActiveCycle(req, res) {
  try {
    // Get ALL cycles, ordered: active first, then upcoming, then past
    const rows = await db.query(`
      SELECT *, 
        CASE 
          WHEN CURDATE() BETWEEN Start_Date AND End_Date THEN 1  -- Active
          WHEN Start_Date > CURDATE() THEN 2                      -- Upcoming
          ELSE 3                                                  -- Past
        END AS priority
      FROM PERFORMANCE_CYCLE 
      ORDER BY priority ASC, Start_Date DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching active cycle:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getDashboardStats,
  getEmployeeCountByDept,
  getGenderDistribution,
  getStatusDistribution,
  getJobsByLevel,
  getSalaryStats,
  getTrainingCompletionStats,
  getAppraisalsPerCycle,
  getActiveCycle
};

