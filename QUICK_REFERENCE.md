# Quick Reference Guide

## 🗄️ Database Connection

```javascript
const db = require('./db-connection');

// Test connection
await db.testConnection();

// Execute query
const results = await db.query('SELECT * FROM EMPLOYEE WHERE Employee_ID = ?', [1]);

// Call stored procedure
const result = await db.callProcedure('GetEmployeeFullProfile', [1]);
```

## 📡 API Endpoints Quick Reference

### Employees
```
GET    /api/employees              # List all
GET    /api/employees/:id          # Get one (uses stored procedure)
GET    /api/employees/:id/stats    # Get stats (uses functions)
POST   /api/employees              # Create (uses stored procedure)
PUT    /api/employees/:id          # Update
PUT    /api/employees/:id/contact # Update contact (uses stored procedure)
DELETE /api/employees/:id          # Delete
```

### Faculties
```
GET    /api/faculties              # List all
GET    /api/faculties/:id          # Get one
POST   /api/faculties              # Create
PUT    /api/faculties/:id          # Update
DELETE /api/faculties/:id          # Delete
```

### Dashboard
```
GET /api/dashboard/stats                    # All stats (uses functions)
GET /api/dashboard/employee-count-by-dept   # Uses View_Employee_Count_By_Dept
GET /api/dashboard/gender-distribution      # Uses View_Gender_Distribution
GET /api/dashboard/status-distribution      # Uses View_Status_Distribution
GET /api/dashboard/jobs-by-level            # Uses View_Jobs_By_Level
GET /api/dashboard/salary-stats            # Uses View_Salary_Stats_By_Category
GET /api/dashboard/training-completion      # Uses View_Training_Completion_Stats
GET /api/dashboard/appraisals-per-cycle    # Uses View_Appraisals_Per_Cycle
```

## 🔧 Using Stored Procedures

Your database has these stored procedures you can call:

```javascript
// Employee Management
await db.callProcedure('AddNewEmployee', [firstName, middleName, lastName, gender, dob, ...]);
await db.callProcedure('UpdateEmployeeContactInfo', [employeeId, mobile, workPhone, email]);
await db.callProcedure('GetEmployeeFullProfile', [employeeId]);
await db.callProcedure('AddEmployeeDisability', [employeeId, type, severity, support]);

// Job Management
await db.callProcedure('AddNewJob', [code, title, level, category, minSal, maxSal, deptId]);
await db.callProcedure('AssignJobToEmployee', [empId, jobId, contractId, startDate, salary]);
await db.callProcedure('CloseJobAssignment', [assignmentId, endDate]);

// Performance
await db.callProcedure('CreatePerformanceCycle', [name, type, start, end, deadline]);
await db.callProcedure('AddEmployeeKPIScore', [assignId, kpiId, cycleId, actual, score, reviewerId]);
await db.callProcedure('CalculateEmployeeWeightedScore', [assignId, cycleId]);
await db.callProcedure('CreateAppraisal', [assignId, cycleId, reviewerId, comment]);
await db.callProcedure('SubmitAppeal', [appraisalId, reason]);

// Training
await db.callProcedure('AddTrainingProgram', [code, title, type, method]);
await db.callProcedure('AssignTrainingToEmployee', [empId, progId]);
await db.callProcedure('RecordTrainingCompletion', [etId]);
await db.callProcedure('IssueTrainingCertificate', [etId, filePath]);
```

## 📊 Using Database Views

Your views can be queried like regular tables:

```javascript
// Employee statistics
await db.query('SELECT * FROM View_Employee_Count_By_Dept');
await db.query('SELECT * FROM View_Gender_Distribution');
await db.query('SELECT * FROM View_Status_Distribution');

// Job statistics
await db.query('SELECT * FROM View_Jobs_By_Level');
await db.query('SELECT * FROM View_Salary_Stats_By_Category');
await db.query('SELECT * FROM View_Active_Assignments');

// Performance statistics
await db.query('SELECT * FROM View_KPI_ScoresSummary');
await db.query('SELECT * FROM View_Appraisals_Per_Cycle');
await db.query('SELECT * FROM View_Full_Appraisal_Summary');

// Training statistics
await db.query('SELECT * FROM View_Training_Participation');
await db.query('SELECT * FROM View_Training_Completion_Stats');
```

## 🧮 Using Database Functions

Your functions can be called in SELECT statements:

```javascript
// Employee functions
await db.query('SELECT getEmployeeFullName(?) AS name', [employeeId]);
await db.query('SELECT getEmployeeAge(?) AS age', [dob]);
await db.query('SELECT getServiceYears(?) AS years', [employeeId]);

// Performance functions
await db.query('SELECT getKPIScore(?) AS score', [scoreId]);
await db.query('SELECT getWeightedKPIScore(?) AS weighted', [scoreId]);
await db.query('SELECT getTotalJobWeight(?) AS weight', [jobId]);
await db.query('SELECT getCycleDuration(?) AS days', [cycleId]);

// Dashboard functions
await db.query('SELECT getTotalEmployees() AS total');
await db.query('SELECT getActiveEmployees() AS total');
await db.query('SELECT getTotalJobs() AS total');
await db.query('SELECT getActiveJobs() AS total');
await db.query('SELECT getTotalTrainingPrograms() AS total');
await db.query('SELECT getTotalCertificates() AS total');
await db.query('SELECT getKPICompletionRate() AS rate');
await db.query('SELECT getAvgAppraisalScore() AS score');
```

## 🎨 Frontend Integration

```javascript
// Fetch employees
const response = await fetch('/api/employees');
const { data } = await response.json();

// Create employee
const response = await fetch('/api/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    First_Name: 'John',
    Last_Name: 'Doe',
    Gender: 'Male',
    DOB: '1990-01-01',
    Work_Email: 'john@example.com',
    Mobile_Phone: '1234567890',
    Employment_Status: 'Active'
  })
});

// Get dashboard stats
const response = await fetch('/api/dashboard/stats');
const { data } = await response.json();
console.log(data.totalEmployees, data.activeEmployees);
```

## 🔒 Security Best Practices

1. ✅ Always use parameterized queries (prevents SQL injection)
2. ✅ Never expose database credentials in frontend
3. ✅ Validate all user inputs
4. ✅ Use environment variables for sensitive data
5. ✅ Enable CORS only for trusted domains in production
6. ✅ Implement authentication/authorization

## 🐛 Common Issues

**Connection refused**
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` credentials

**CORS errors**
- Ensure `cors()` middleware is enabled in `server.js`

**Stored procedure errors**
- Check parameter count matches procedure definition
- Verify procedure exists: `SHOW PROCEDURE STATUS WHERE Db = 'hr_management_system'`

**View not found**
- Verify view exists: `SHOW FULL TABLES WHERE Table_type = 'VIEW'`

