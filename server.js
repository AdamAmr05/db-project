const express = require('express');
require('dotenv').config();

const db = require('./db-connection');

// Import API routes
const employees = require('./api/employees');
const faculties = require('./api/faculties');
const dashboard = require('./api/dashboard');

const cors = require('cors');

// ... existing imports

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test database connection on startup
db.testConnection();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const isConnected = await db.testConnection();
  res.json({
    status: isConnected ? 'healthy' : 'unhealthy',
    database: isConnected ? 'connected' : 'disconnected'
  });
});

// Employee routes
app.get('/api/employees', employees.getAllEmployees);
app.get('/api/employees/:id', employees.getEmployeeById);
app.get('/api/employees/:id/stats', employees.getEmployeeStats);
app.post('/api/employees', employees.createEmployee);
app.put('/api/employees/:id', employees.updateEmployee);
app.put('/api/employees/:id/contact', employees.updateEmployeeContact);
app.delete('/api/employees/:id', employees.deleteEmployee);
app.get('/api/contracts', employees.getAllContracts);
app.post('/api/employees/:id/assign-job', employees.assignJob);

// Faculty routes
app.get('/api/faculties', faculties.getAllFaculties);
app.get('/api/faculties/:id', faculties.getFacultyById);
app.post('/api/faculties', faculties.createFaculty);
app.put('/api/faculties/:id', faculties.updateFaculty);
app.delete('/api/faculties/:id', faculties.deleteFaculty);
app.get('/api/universities', faculties.getAllUniversities);

// Department routes
const departments = require('./api/departments');
app.get('/api/departments', departments.getAllDepartments);
app.get('/api/departments/:id', departments.getDepartmentById);
app.post('/api/departments', departments.createDepartment);
app.put('/api/departments/:id', departments.updateDepartment);
app.delete('/api/departments/:id', departments.deleteDepartment);

// Job routes
const jobs = require('./api/jobs');
app.get('/api/jobs', jobs.getAllJobs);
app.get('/api/jobs/:id', jobs.getJobById);
app.post('/api/jobs', jobs.createJob);
app.put('/api/jobs/:id', jobs.updateJob);
app.delete('/api/jobs/:id', jobs.deleteJob);
app.get('/api/jobs/:id/objectives', jobs.getJobObjectives);
app.post('/api/jobs/:id/objectives', jobs.createObjective);
app.delete('/api/objectives/:id', jobs.deleteObjective);
app.post('/api/objectives/:id/kpis', jobs.createKPI);
app.delete('/api/kpis/:id', jobs.deleteKPI);

// Training routes
const training = require('./api/training');
app.get('/api/training', training.getAllPrograms);
app.get('/api/training/:id', training.getProgramById);
app.post('/api/training', training.createProgram);
app.put('/api/training/:id', training.updateProgram);
app.delete('/api/training/:id', training.deleteProgram);
app.post('/api/training/:id/enroll', training.enrollEmployee);
app.put('/api/training/:id/enroll/:employeeId', training.updateEnrollmentStatus);
app.delete('/api/training/:id/enroll/:employeeId', training.deleteEnrollment);

// Performance Cycles routes
const cycles = require('./api/cycles');
app.get('/api/cycles', cycles.getAllCycles);
app.get('/api/cycles/:id', cycles.getCycleById);
app.post('/api/cycles', cycles.createCycle);
app.put('/api/cycles/:id', cycles.updateCycle);
app.delete('/api/cycles/:id', cycles.deleteCycle);

// Appraisal Routes
const appraisals = require('./api/appraisals');
app.get('/api/appraisals/candidates/:cycleId', appraisals.getAppraisalCandidates);
app.get('/api/appraisals/:cycleId/:assignmentId', appraisals.getAppraisalDetails);
app.post('/api/appraisals/score', appraisals.saveKPIScore);
app.post('/api/appraisals/finalize', appraisals.finalizeAppraisal);

// Appeal Routes
const appeals = require('./api/appeals');
app.get('/api/appeals', appeals.getAppeals);
app.post('/api/appeals', appeals.submitAppeal);
app.put('/api/appeals/:id', appeals.reviewAppeal);


// Dashboard routes
app.get('/api/dashboard/stats', dashboard.getDashboardStats);
app.get('/api/dashboard/employee-count-by-dept', dashboard.getEmployeeCountByDept);
app.get('/api/dashboard/gender-distribution', dashboard.getGenderDistribution);
app.get('/api/dashboard/status-distribution', dashboard.getStatusDistribution);
app.get('/api/dashboard/jobs-by-level', dashboard.getJobsByLevel);
app.get('/api/dashboard/salary-stats', dashboard.getSalaryStats);
app.get('/api/dashboard/training-completion', dashboard.getTrainingCompletionStats);
app.get('/api/dashboard/appraisals-per-cycle', dashboard.getAppraisalsPerCycle);
app.get('/api/dashboard/active-cycle', dashboard.getActiveCycle);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;

