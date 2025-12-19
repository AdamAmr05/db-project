USE hr_management_system;

-- Reset delimiter to semicolon
DELIMITER ;

-- use this view in Dashboard 1 — Employees by Department (Bar Chart)
CREATE OR REPLACE VIEW View_Employee_Count_By_Dept AS
SELECT 
    d.Department_Name,
    COUNT(ja.Employee_ID) AS EmployeeCount
FROM DEPARTMENT d
LEFT JOIN JOB j ON d.Department_ID = j.Department_ID
LEFT JOIN JOB_ASSIGNMENT ja ON j.Job_ID = ja.Job_ID
WHERE ja.Status = 'Active'
GROUP BY d.Department_Name;

-- use this view in Dashboard 1 — Gender Breakdown (Pie/Donut)
CREATE OR REPLACE VIEW View_Gender_Distribution AS
SELECT 
    Gender,
    COUNT(Employee_ID) AS CountPerGender
FROM EMPLOYEE
GROUP BY Gender;

-- use this view in Dashboard 1 — Employment Status Distribution (Pie/Donut)
CREATE OR REPLACE VIEW View_Status_Distribution AS
SELECT 
    Employment_Status,
    COUNT(Employee_ID) AS CountPerStatus
FROM EMPLOYEE
GROUP BY Employment_Status;

-- use this view in Dashboard 2 — Jobs by Level (Column Chart)
CREATE OR REPLACE VIEW View_Jobs_By_Level AS
SELECT 
    Job_Level,
    COUNT(Job_ID) AS Job_Count
FROM JOB
GROUP BY Job_Level;

-- use this view in Dashboard 2 — Salary Statistics by Job Category (Multi-bar Chart)
CREATE OR REPLACE VIEW View_Salary_Stats_By_Category AS
SELECT 
    Job_Category,
    MIN(Min_Salary) AS MinSalary,
    MAX(Max_Salary) AS MaxSalary,
    AVG((Min_Salary + Max_Salary)/2) AS AvgSalary
FROM JOB
GROUP BY Job_Category;

-- use this view in Dashboard 2 — Active Job Assignments (Table)
CREATE OR REPLACE VIEW View_Active_Assignments AS
SELECT 
    ja.Assignment_ID,
    ja.Employee_ID,
    CONCAT(e.First_Name, ' ', e.Last_Name) AS EmployeeName,
    ja.Job_ID,
    j.Job_Title,
    ja.Start_Date,
    ja.End_Date
FROM JOB_ASSIGNMENT ja
LEFT JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
LEFT JOIN JOB j ON ja.Job_ID = j.Job_ID
WHERE ja.Status = 'Active';

-- use this view in Dashboard 3 — KPI Score Summary (Bar/Heatmap)
CREATE OR REPLACE VIEW View_KPI_ScoresSummary AS
SELECT 
    ja.Employee_ID,
    CONCAT(e.First_Name, ' ', e.Last_Name) AS EmployeeName,
    eks.Performance_Cycle_ID,
    pc.Cycle_Name,
    SUM(eks.Weighted_Score) AS TotalWeightedScore
FROM EMPLOYEE_KPI_SCORE eks
JOIN JOB_ASSIGNMENT ja ON eks.Assignment_ID = ja.Assignment_ID
LEFT JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
LEFT JOIN PERFORMANCE_CYCLE pc ON eks.Performance_Cycle_ID = pc.Cycle_ID
GROUP BY ja.Employee_ID, EmployeeName, eks.Performance_Cycle_ID, pc.Cycle_Name;

-- use this view in Dashboard 3 — Appraisal Score by Cycle (Line or Bar Chart)
CREATE OR REPLACE VIEW View_Appraisals_Per_Cycle AS
SELECT 
    Cycle_ID,
    AVG(Overall_Score) AS AvgScore
FROM APPRAISAL
GROUP BY Cycle_ID;

-- use this view in Dashboard 3 — Detailed Appraisal Summary Table
CREATE OR REPLACE VIEW View_Full_Appraisal_Summary AS
SELECT 
    e.Employee_ID,
    CONCAT(e.First_Name, ' ', e.Last_Name) AS EmployeeName,
    j.Job_ID,
    j.Job_Title,
    pc.Cycle_Name,
    a.Overall_Score
FROM APPRAISAL a
JOIN JOB_ASSIGNMENT ja ON a.Assignment_ID = ja.Assignment_ID
JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
JOIN JOB j ON ja.Job_ID = j.Job_ID
JOIN PERFORMANCE_CYCLE pc ON a.Cycle_ID = pc.Cycle_ID;

-- use this view in Dashboard 4 — Training Participation (Horizontal Bar Chart)
CREATE OR REPLACE VIEW View_Training_Participation AS
SELECT 
    tp.Program_ID,
    tp.Title AS ProgramTitle,
    COUNT(Employee_ID) AS ParticipantCount
FROM EMPLOYEE_TRAINING et
LEFT JOIN TRAINING_PROGRAM tp ON et.Program_ID = tp.Program_ID
GROUP BY tp.Program_ID, tp.Title;

-- use this view in Dashboard 4 — Training Completion per Program (Clustered Bar Chart)
CREATE OR REPLACE VIEW View_Training_Completion_Stats AS
SELECT 
    tp.Program_ID,
    tp.Title,
    COUNT(et.Employee_ID) AS TotalAssigned,
    SUM(CASE WHEN et.Completion_Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedCount
FROM TRAINING_PROGRAM tp
LEFT JOIN EMPLOYEE_TRAINING et ON tp.Program_ID = et.Program_ID
GROUP BY tp.Program_ID, tp.Title;


-- all deleting and dropping/replacing is just for testing and trying to make sure the triggers are working as expected

-- post MS3 views for powerBI use

-- use this view in Dashboard 1 — Total Employees (Card)
CREATE OR REPLACE VIEW View_Total_Employees AS
SELECT COUNT(*) AS TotalEmployees
FROM EMPLOYEE;

-- use this view in Dashboard 1 — Active Employees (Card)
CREATE OR REPLACE VIEW View_Active_Employees AS
SELECT COUNT(*) AS ActiveEmployees
FROM EMPLOYEE
WHERE Employment_Status = 'Active';

-- use this view in Dashboard 1 — Average Employee Age (Card)
CREATE OR REPLACE VIEW View_Average_Employee_Age AS
SELECT AVG(TIMESTAMPDIFF(YEAR, DOB, CURDATE())) AS AvgEmployeeAgeYears
FROM EMPLOYEE
WHERE DOB IS NOT NULL;

-- use this view in Dashboard 1 — Average Service Years (Card)
-- for each employee, we want to know the average service years they have had, so we measure the time from their first assignment start date to their latest assignment end date, if they have no end date then we use the current date.
CREATE OR REPLACE VIEW View_Average_Service_Years AS
SELECT AVG(TIMESTAMPDIFF(
    YEAR,
    tenure_bounds.EarliestStart,
    COALESCE(tenure_bounds.LatestEnd, CURDATE()) -- this is the only place coalesce is used, the alternative is to use a case statement to check if the LatestEnd is null and if it is then use the CURDATE(), which is more verbose and less efficient...
)) AS AvgServiceYears
FROM (
    SELECT 
        Employee_ID,
        MIN(Start_Date) AS EarliestStart,
        MAX(End_Date) AS LatestEnd
    FROM JOB_ASSIGNMENT
    WHERE Start_Date IS NOT NULL
    GROUP BY Employee_ID
) AS tenure_bounds;

-- use this view in Dashboard 2 — Total Jobs (Card)
CREATE OR REPLACE VIEW View_Total_Jobs AS
SELECT COUNT(*) AS TotalJobs
FROM JOB;

-- use this view in Dashboard 2 — Active Jobs (Card)
CREATE OR REPLACE VIEW View_Active_Jobs AS
SELECT COUNT(*) AS ActiveJobs
FROM JOB
WHERE Status = 'Active';

-- use this view in Dashboard 3 — Active Performance Cycles (Card)
CREATE OR REPLACE VIEW View_Active_Performance_Cycles AS
SELECT COUNT(*) AS ActivePerformanceCycles
FROM PERFORMANCE_CYCLE
WHERE CURDATE() BETWEEN Start_Date AND End_Date;

-- use this view in Dashboard 3 — Average Appraisal Score (Card)
CREATE OR REPLACE VIEW View_Average_Appraisal_Score AS
SELECT AVG(Overall_Score) AS AvgAppraisalScore
FROM APPRAISAL
WHERE Overall_Score IS NOT NULL;

-- use this view in Dashboard 3 — KPI Completion Rate (Card)
CREATE OR REPLACE VIEW View_KPI_Completion_Rate AS
SELECT 
    COUNT(*) AS TotalKPIEntries,
    SUM(CASE WHEN Employee_Score IS NOT NULL THEN 1 ELSE 0 END) AS SubmittedKPIEntries,
    CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(SUM(CASE WHEN Employee_Score IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*) * 100, 2)
    END AS CompletionRatePct
FROM EMPLOYEE_KPI_SCORE;

-- use this view in Dashboard 4 — Total Training Programs (Card)
CREATE OR REPLACE VIEW View_Training_Programs_Total AS
SELECT COUNT(*) AS TotalTrainingPrograms
FROM TRAINING_PROGRAM;

-- use this view in Dashboard 4 — Total Certificates Issued (Card)
CREATE OR REPLACE VIEW View_Certificates_Issued_Total AS
SELECT COUNT(*) AS TotalCertificatesIssued
FROM TRAINING_CERTIFICATE;

-- use this view in Dashboard 4 — Training Completion Rate (Card)
CREATE OR REPLACE VIEW View_Training_Completion_Rate AS
SELECT 
    COUNT(*) AS TotalAssignments,
    SUM(CASE WHEN Completion_Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedAssignments,
    CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(SUM(CASE WHEN Completion_Status = 'Completed' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2)
    END AS CompletionRatePct
FROM EMPLOYEE_TRAINING;

-- use this view in Dashboard 4 — Certificates Issued (Column Chart)
CREATE OR REPLACE VIEW View_Certificates_By_Program AS
SELECT 
    tp.Program_ID,
    tp.Title,
    COUNT(tc.Certificate_ID) AS CertificatesIssued
FROM TRAINING_PROGRAM tp
LEFT JOIN EMPLOYEE_TRAINING et ON tp.Program_ID = et.Program_ID
LEFT JOIN TRAINING_CERTIFICATE tc ON et.ET_ID = tc.ET_ID
GROUP BY tp.Program_ID, tp.Title;

-- use this view in Dashboard 5 — Department Structure (Tree or Sunburst Chart)
CREATE OR REPLACE VIEW View_Department_Hierarchy AS
SELECT 
    u.University_Name,
    f.Faculty_Name,
    d.Department_Name,
    d.Department_Type
FROM ACADEMIC_DEPARTMENT ad
JOIN DEPARTMENT d ON ad.Department_ID = d.Department_ID
LEFT JOIN FACULTY f ON ad.Faculty_ID = f.Faculty_ID
LEFT JOIN UNIVERSITY u ON f.University_ID = u.University_ID
UNION ALL
SELECT 
    u.University_Name,
    NULL AS Faculty_Name,
    d.Department_Name,
    d.Department_Type
FROM ADMINISTRATIVE_DEPARTMENT amd
JOIN DEPARTMENT d ON amd.Department_ID = d.Department_ID
LEFT JOIN UNIVERSITY u ON amd.University_ID = u.University_ID;

-- use this view in Dashboard 5 — Job Structure Overview (Hierarchical Table)
CREATE OR REPLACE VIEW View_Job_Hierarchy AS
SELECT 
    j.Job_ID,
    j.Job_Title,
    j.Job_Level,
    j.Job_Category,
    j.Status,
    d.Department_Name,
    j.Reports_To,
    mgr.Job_Title AS Reports_To_Title
FROM JOB j
LEFT JOIN JOB mgr ON j.Reports_To = mgr.Job_ID
LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID;

SHOW FULL TABLES WHERE Table_type = 'VIEW';

-- quick verification queries grouped by dashboard (run as needed)

-- Dashboard 1 — Workforce Overview
SELECT * FROM View_Total_Employees;
SELECT * FROM View_Active_Employees;
SELECT * FROM View_Average_Employee_Age;
SELECT * FROM View_Average_Service_Years;
SELECT * FROM View_Employee_Count_By_Dept;
SELECT * FROM View_Status_Distribution;
SELECT * FROM View_Gender_Distribution;

-- Dashboard 2 — Job Structure & Salary Insights
SELECT * FROM View_Total_Jobs;
SELECT * FROM View_Active_Jobs;
SELECT * FROM View_Jobs_By_Level;
SELECT * FROM View_Salary_Stats_By_Category;
SELECT * FROM View_Active_Assignments;

-- Dashboard 3 — Performance Management
SELECT * FROM View_Active_Performance_Cycles;
SELECT * FROM View_Average_Appraisal_Score;
SELECT * FROM View_KPI_Completion_Rate;
SELECT * FROM View_KPI_ScoresSummary;
SELECT * FROM View_Appraisals_Per_Cycle;
SELECT * FROM View_Full_Appraisal_Summary;

-- Dashboard 4 — Training & Development
SELECT * FROM View_Training_Programs_Total;
SELECT * FROM View_Certificates_Issued_Total;
SELECT * FROM View_Training_Completion_Rate;
SELECT * FROM View_Training_Participation;
SELECT * FROM View_Training_Completion_Stats;
SELECT * FROM View_Certificates_By_Program;

-- Dashboard 5 — Organizational Structure
SELECT * FROM View_Department_Hierarchy;
SELECT * FROM View_Job_Hierarchy;


--CREATE OR REPLACE VIEW view_name AS
--SELECT
--  <columns or aggregates>
--FROM <table(s) with joins>
--WHERE <filters optional>
--GROUP BY <grouping columns if you aggregate>;
