USE hr_management_system;

DELIMITER $$

-- employee and workforce calculations

-- 1. return employee full name
CREATE FUNCTION getEmployeeFullName(p_EmpID INT)
RETURNS VARCHAR(70)
DETERMINISTIC
BEGIN
    DECLARE fullName VARCHAR(70);
    DECLARE fname VARCHAR(20);
    DECLARE mname VARCHAR(20);
    DECLARE lname VARCHAR(20);

    SELECT First_Name, Middle_Name, Last_Name 
    INTO fname, mname, lname
    FROM EMPLOYEE WHERE Employee_ID = p_EmpID;
    
    -- this automatically skips NULLs because we use the CONCAT_WS function and it will skip the NULLs
    RETURN TRIM(CONCAT_WS(' ', fname, mname, lname));
END $$

-- 2. get employee age
CREATE FUNCTION getEmployeeAge(p_DOB DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN YEAR(CURDATE()) - YEAR(p_DOB);
END $$

-- 3. get service years
CREATE FUNCTION getServiceYears(p_EmpID INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE startD DATE;
    SELECT MIN(Start_Date) INTO startD FROM JOB_ASSIGNMENT WHERE Employee_ID = p_EmpID;
    
    IF startD IS NULL THEN 
        RETURN 0;
    ELSE
        RETURN YEAR(CURDATE()) - YEAR(startD);
    END IF;
END $$

-- performance calculations

-- 4. calculate kpi score
CREATE FUNCTION getKPIScore(p_ScoreID INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE score DECIMAL(5,2);
    SELECT Employee_Score INTO score FROM EMPLOYEE_KPI_SCORE WHERE Score_ID = p_ScoreID;
    RETURN score;
END $$

-- 5. calculate weighted kpi score
CREATE FUNCTION getWeightedKPIScore(p_ScoreID INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE w_score DECIMAL(5,2);
    SELECT Weighted_Score INTO w_score FROM EMPLOYEE_KPI_SCORE WHERE Score_ID = p_ScoreID;
    RETURN w_score;
END $$

-- 6. calculate total objective weight for a job
CREATE FUNCTION getTotalJobWeight(p_JobID INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(5,2);
    SELECT SUM(Weight) INTO total FROM JOB_OBJECTIVE WHERE Job_ID = p_JobID;
    
   -- thsiu is just standard if logic to set the total to 0 if it is null
    IF total IS NULL THEN
        SET total = 0;
    END IF;
    
    RETURN total;
END $$

-- 7. calculate performance cycle duration (in days)
CREATE FUNCTION getCycleDuration(p_CycleID INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE days INT;
    SELECT DATEDIFF(End_Date, Start_Date) INTO days FROM PERFORMANCE_CYCLE WHERE Cycle_ID = p_CycleID;
    RETURN days;
END $$

-- dashboard summary calculations

-- 8. get total number of employees
CREATE FUNCTION getTotalEmployees() RETURNS INT DETERMINISTIC
BEGIN
    DECLARE countVal INT;
    SELECT COUNT(*) INTO countVal FROM EMPLOYEE;
    RETURN countVal;
END $$

-- 9. get number of active employees
CREATE FUNCTION getActiveEmployees() RETURNS INT DETERMINISTIC
BEGIN
    DECLARE countVal INT;
    SELECT COUNT(*) INTO countVal FROM EMPLOYEE WHERE Employment_Status = 'Active';
    RETURN countVal;
END $$

-- 10. get total number of jobs
CREATE FUNCTION getTotalJobs() RETURNS INT DETERMINISTIC
BEGIN
    DECLARE countVal INT;
    SELECT COUNT(*) INTO countVal FROM JOB;
    RETURN countVal;
END $$

-- 11. get number of active jobs
CREATE FUNCTION getActiveJobs() RETURNS INT DETERMINISTIC
BEGIN
    DECLARE countVal INT;
    SELECT COUNT(DISTINCT Job_ID) INTO countVal FROM JOB_ASSIGNMENT WHERE Status = 'Active';
    RETURN countVal;
END $$

-- 12. get total number of training programs
CREATE FUNCTION getTotalTrainingPrograms() RETURNS INT DETERMINISTIC
BEGIN
    DECLARE countVal INT;
    SELECT COUNT(*) INTO countVal FROM TRAINING_PROGRAM;
    RETURN countVal;
END $$

-- 13. get total number of issued certificates
CREATE FUNCTION getTotalCertificates() RETURNS INT DETERMINISTIC
BEGIN
    DECLARE countVal INT;
    SELECT COUNT(*) INTO countVal FROM TRAINING_CERTIFICATE;
    RETURN countVal;
END $$

-- 14. get kpi completion rate
CREATE FUNCTION getKPICompletionRate() RETURNS DECIMAL(5,2) DETERMINISTIC
BEGIN
    DECLARE totalAssign INT;
    DECLARE scoredAssign INT;
    
    SELECT COUNT(*) INTO totalAssign FROM JOB_ASSIGNMENT;
    SELECT COUNT(DISTINCT Assignment_ID) INTO scoredAssign FROM EMPLOYEE_KPI_SCORE;
    
    IF totalAssign = 0 THEN 
        RETURN 0; 
    END IF;
    
    RETURN (scoredAssign / totalAssign) * 100;
END $$

-- 15. get average appraisal score
CREATE FUNCTION getAvgAppraisalScore() RETURNS DECIMAL(5,2) DETERMINISTIC
BEGIN
    DECLARE avgScore DECIMAL(5,2);
    SELECT AVG(Overall_Score) INTO avgScore FROM APPRAISAL;
    
    IF avgScore IS NULL THEN
        SET avgScore = 0;
    END IF;
    
    RETURN avgScore;
END $$

DELIMITER ;


-- employee and workforce calculations
SELECT getEmployeeFullName(1) AS 'Employee Full Name';
SELECT getEmployeeAge('1990-01-15') AS 'Employee Age';
SELECT getServiceYears(1) AS 'Service Years';

-- performance calculations
SELECT getKPIScore(1) AS 'KPI Score';
SELECT getWeightedKPIScore(1) AS 'Weighted KPI Score';
SELECT getTotalJobWeight(1) AS 'Total Job Weight';
SELECT getCycleDuration(1) AS 'Cycle Duration (Days)';

-- dashboard summary calculations
SELECT getTotalEmployees() AS 'Total Employees';
SELECT getActiveEmployees() AS 'Active Employees';
SELECT getTotalJobs() AS 'Total Jobs';
SELECT getActiveJobs() AS 'Active Jobs';
SELECT getTotalTrainingPrograms() AS 'Total Training Programs';
SELECT getTotalCertificates() AS 'Total Certificates';
SELECT getKPICompletionRate() AS 'KPI Completion rate  i ns percentafe';
SELECT getAvgAppraisalScore() AS 'Average appraisal score';
