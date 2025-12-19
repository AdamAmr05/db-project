USE hr_management_system;



DELIMITER $$
-- employee management procedures
-- 1. add new employee
CREATE PROCEDURE AddNewEmployee(
    IN p_FirstName VARCHAR(20), IN p_MiddleName VARCHAR(20), IN p_LastName VARCHAR(20),
    IN p_Gender VARCHAR(10), IN p_DOB DATE, IN p_Nationality VARCHAR(50),
    IN p_Email VARCHAR(100), IN p_Mobile VARCHAR(20), IN p_Status VARCHAR(20),
    IN p_InsuranceNumber VARCHAR(50), IN p_InsuranceStart DATE
)
BEGIN
    DECLARE new_emp_id INT; -- to store their id after insertion

    -- this ensures that if one insertion fails so if one o f the inserting fails nothing is commited or inserted at all and we will do this to prevent the employee insurance is always inserted with the emyployee and not inserted without the employee being inserted first
    START TRANSACTION;
    
    INSERT INTO EMPLOYEE (First_Name, Middle_Name, Last_Name, Gender, DOB, Nationality, Work_Email, Mobile_Phone, Employment_Status)
    VALUES (p_FirstName, p_MiddleName, p_LastName, p_Gender, p_DOB, p_Nationality, p_Email, p_Mobile, p_Status);
    
    SET new_emp_id = LAST_INSERT_ID(); -- captures the id of the new employee after insertion

    INSERT INTO SOCIAL_INSURANCE (Employee_ID, Insurance_Number, Coverage_Details, Start_Date, Status)
    VALUES (new_emp_id, p_InsuranceNumber, 'Basic Coverage', p_InsuranceStart, 'Active');
    
    COMMIT; -- commits the transaction if all things we just did  are successful
END $$

-- 2. update employee contact info
CREATE PROCEDURE UpdateEmployeeContactInfo(
    IN p_EmployeeID INT,
    IN p_Mobile VARCHAR(20),
    IN p_WorkPhone VARCHAR(20),
    IN p_WorkEmail VARCHAR(100)
)
BEGIN
    UPDATE EMPLOYEE
    SET Mobile_Phone = p_Mobile,
        Work_Phone = p_WorkPhone,
        Work_Email = p_WorkEmail
    WHERE Employee_ID = p_EmployeeID;
END $$

-- 3. add employee disability
CREATE PROCEDURE AddEmployeeDisability(
    IN p_EmployeeID INT,
    IN p_Type VARCHAR(500),
    IN p_Severity VARCHAR(20),
    IN p_Support TEXT
)
BEGIN
    INSERT INTO EMPLOYEE_DISABILITY (Employee_ID, Disability_Type, Severity_Level, Required_Support)
    VALUES (p_EmployeeID, p_Type, p_Severity, p_Support);
END $$

-- 4. GetEmployeeFullProfile, this shows all the information about the employee and their job history and their disability and their educational qualification and their professional certificate
CREATE PROCEDURE GetEmployeeFullProfile(IN p_EmployeeID INT) -- because this is what we need to get the full profile of the employee
BEGIN
    SELECT 
        e.*, -- everything in the employee tablee (includes all address columns)
        d.Disability_Type, -- disability type from the employee disability table, underr thsu we also get the severity level and the required support ffor the disability
        d.Severity_Level,
        d.Required_Support,
        eq.Institution_Name AS Degree_Institution, -- degree institution
        eq.Major, -- major from the educational qualification table
        eq.Degree_Type,
        pc.Certification_Name, -- certification name from the professional certificate table
        pc.Issuing_Organization, -- issuing organization from the professional certificate table and the issue date and the expiry date under this here
        pc.Issue_Date, 
        pc.Expiry_Date,
        ja.Assignment_ID, -- assignment id from the job assignment table
        ja.Start_Date AS Assignment_Start_Date,
        ja.End_Date AS Assignment_End_Date, -- the as here and over and under this is just to rename them for claruty thats all
        ja.Status AS Assignment_Status,
        ja.Assigned_Salary,
        job.Job_Title,
        job.Job_Code,
        job.Job_Level,
        job.Job_Category,
        job.Department_ID
    FROM EMPLOYEE e
    LEFT JOIN EMPLOYEE_DISABILITY d ON e.Employee_ID = d.Employee_ID -- left join to get the disability type
    LEFT JOIN EDUCATIONAL_QUALIFICATION eq ON e.Employee_ID = eq.Employee_ID -- left join to get the degree institution
    LEFT JOIN PROFESSIONAL_CERTIFICATE pc ON e.Employee_ID = pc.Employee_ID -- left join to get the certification name
    LEFT JOIN JOB_ASSIGNMENT ja ON e.Employee_ID = ja.Employee_ID -- left join to retrieve job history
    LEFT JOIN JOB job ON ja.Job_ID = job.Job_ID -- include job metadata for history
    WHERE e.Employee_ID = p_EmployeeID; -- where the employee id is the same as the employee id we passed in
END $$

-- job  and assignment procedures
-- 5. add new job
CREATE PROCEDURE AddNewJob(
    IN p_Code VARCHAR(20), IN p_Title VARCHAR(100), IN p_Level VARCHAR(20),
    IN p_Category VARCHAR(50), IN p_MinSal DECIMAL(10,2), IN p_MaxSal DECIMAL(10,2),
    IN p_DeptID INT
)
BEGIN
    INSERT INTO JOB (Job_Code, Job_Title, Job_Level, Job_Category, Min_Salary, Max_Salary, Department_ID, Status)
    VALUES (p_Code, p_Title, p_Level, p_Category, p_MinSal, p_MaxSal, p_DeptID, 'Active');
END $$

-- 6. add job objectivee 
CREATE PROCEDURE AddJobObjective(
    IN p_JobID INT, IN p_Title VARCHAR(100), IN p_Weight DECIMAL(5,2)
)
BEGIN
    DECLARE current_weight DECIMAL(5,2); -- to store the current weight of the job objectives so its a new variable that we didnt have before
    
    -- Calculate current total weight
    SELECT SUM(Weight) INTO current_weight  -- here we are summing the weight of the job objectives for the given job id and storing it in the current_weight variable
    FROM JOB_OBJECTIVE WHERE Job_ID = p_JobID;
    
    
    IF current_weight IS NULL THEN -- we set the current weight to 0 if current weight is null because if we do somethinsnsgh like null + 100 we get null and that's not what we want
        SET current_weight = 0;
    END IF;
    
    -- if the new weight plus the current weight exceeds 100, we give an error
    IF (current_weight + p_Weight) > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Total weight cannot exceed 100%';
    ELSE
        INSERT INTO JOB_OBJECTIVE (Job_ID, Objective_Title, Weight)
        VALUES (p_JobID, p_Title, p_Weight);
    END IF;
END $$

-- 7. add kpi to objective
CREATE PROCEDURE AddKPIToObjective(
    IN p_ObjID INT, IN p_Name VARCHAR(100), IN p_Weight DECIMAL(5,2), IN p_Target DECIMAL(10,2)
)
BEGIN
    INSERT INTO OBJECTIVE_KPI (Objective_ID, KPI_Name, Weight, Target_Value)
    VALUES (p_ObjID, p_Name, p_Weight, p_Target);
END $$

-- 8. assign job to employee
CREATE PROCEDURE AssignJobToEmployee(
    IN p_EmpID INT, IN p_JobID INT, IN p_ContractID INT, 
    IN p_StartDate DATE, IN p_Salary DECIMAL(10,2)
)
BEGIN
    DECLARE active_jobs INT;
    DECLARE contract_exists INT;
    
    -- check if the contract exists... 
    SELECT COUNT(*) INTO contract_exists FROM CONTRACT WHERE Contract_ID = p_ContractID;
    
    -- Check overlapping active jobs
    SELECT COUNT(*) INTO active_jobs 
    FROM JOB_ASSIGNMENT 
    WHERE Employee_ID = p_EmpID 
      AND Status = 'Active' 
      AND (End_Date IS NULL OR End_Date >= p_StartDate);
      
    IF contract_exists = 0 THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Contract ID does not exist.'; -- we give an error if the contract does not exist
    ELSEIF active_jobs > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Employee has overlapping active jobs.'; -- we give an error if the employee has overlapping active jobs
    ELSE
        INSERT INTO JOB_ASSIGNMENT (Employee_ID, Job_ID, Contract_ID, Start_Date, Status, Assigned_Salary) -- we insert the job assignment if the contract exists and the employee does not have overlapping active jobs
        VALUES (p_EmpID, p_JobID, p_ContractID, p_StartDate, 'Active', p_Salary);
    END IF;
END $$

-- 9. close job assignment
CREATE PROCEDURE CloseJobAssignment(
    IN p_AssignmentID INT, IN p_EndDate DATE
)
BEGIN
    UPDATE JOB_ASSIGNMENT -- we update the job assignment to set the end date and status to inactive
    SET End_Date = p_EndDate, Status = 'Inactive'
    WHERE Assignment_ID = p_AssignmentID;
END $$

-- performance management procedures

-- 10. create performance cycle
CREATE PROCEDURE CreatePerformanceCycle(
    IN p_Name VARCHAR(100), IN p_Type VARCHAR(20), 
    IN p_Start DATE, IN p_End DATE, IN p_Deadline DATE
)
BEGIN
    INSERT INTO PERFORMANCE_CYCLE (Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline)
    VALUES (p_Name, p_Type, p_Start, p_End, p_Deadline);
END $$

-- 11. AddEmployeeKPIScore
CREATE PROCEDURE AddEmployeeKPIScore(
    IN p_AssignID INT, IN p_KPIID INT, IN p_CycleID INT, 
    IN p_Actual DECIMAL(10,2), IN p_Score DECIMAL(5,2), IN p_ReviewerID INT
)
BEGIN
    INSERT INTO EMPLOYEE_KPI_SCORE (Assignment_ID, KPI_ID, Performance_Cycle_ID, Actual_Value, Employee_Score, Reviewer_ID, Review_Date)
    VALUES (p_AssignID, p_KPIID, p_CycleID, p_Actual, p_Score, p_ReviewerID, CURDATE());
END $$

-- 12. CalculateEmployeeWeightedScore
CREATE PROCEDURE CalculateEmployeeWeightedScore(
    IN p_AssignID INT, IN p_CycleID INT
)
BEGIN
    DECLARE total_score DECIMAL(5,2);
    
    -- Sum the weighted scores
    SELECT SUM(Weighted_Score) INTO total_score
    FROM EMPLOYEE_KPI_SCORE
    WHERE Assignment_ID = p_AssignID AND Performance_Cycle_ID = p_CycleID;
    
    -- Safety check if sum is null
    IF total_score IS NULL THEN
        SET total_score = 0;
    END IF;
    
    -- Update the Appraisal table
    UPDATE APPRAISAL
    SET Overall_Score = total_score
    WHERE Assignment_ID = p_AssignID AND Cycle_ID = p_CycleID;
END $$

-- 13. CreateAppraisal
CREATE PROCEDURE CreateAppraisal(
    IN p_AssignID INT, IN p_CycleID INT, IN p_ReviewerID INT, IN p_MgrComment TEXT
)
BEGIN
    INSERT INTO APPRAISAL (Assignment_ID, Cycle_ID, Appraisal_Date, Reviewer_ID, Manager_Comments)
    VALUES (p_AssignID, p_CycleID, CURDATE(), p_ReviewerID, p_MgrComment);
END $$

-- 14. SubmitAppeal
CREATE PROCEDURE SubmitAppeal(
    IN p_AppraisalID INT, IN p_Reason TEXT
)
BEGIN
    INSERT INTO APPEAL (Appraisal_ID, Submission_Date, Reason, Approval_Status)
    VALUES (p_AppraisalID, CURDATE(), p_Reason, 'Pending');
END $$

-- training procedures

-- 15. add training program
CREATE PROCEDURE AddTrainingProgram(
    IN p_Code VARCHAR(20), IN p_Title VARCHAR(100), IN p_Type VARCHAR(50), IN p_Method VARCHAR(20)
)
BEGIN
    INSERT INTO TRAINING_PROGRAM (Program_Code, Title, Type, Delivery_Method, Approval_Status)
    VALUES (p_Code, p_Title, p_Type, p_Method, 'Pending');
END $$

-- 16. assign training to employee
CREATE PROCEDURE AssignTrainingToEmployee(
    IN p_EmpID INT, IN p_ProgID INT
)
BEGIN
    INSERT INTO EMPLOYEE_TRAINING (Employee_ID, Program_ID, Completion_Status)
    VALUES (p_EmpID, p_ProgID, 'Enrolled');
END $$

-- 17. record training completion
CREATE PROCEDURE RecordTrainingCompletion(
    IN p_ET_ID INT
)
BEGIN
    UPDATE EMPLOYEE_TRAINING
    SET Completion_Status = 'Completed'
    WHERE ET_ID = p_ET_ID;
END $$

-- 18. issue training certificate
CREATE PROCEDURE IssueTrainingCertificate(
    IN p_ET_ID INT, IN p_FilePath VARCHAR(255)
)
BEGIN
    DECLARE status_check VARCHAR(20);
    
    SELECT Completion_Status INTO status_check 
    FROM EMPLOYEE_TRAINING 
    WHERE ET_ID = p_ET_ID;
    
    IF status_check = 'Completed' THEN
        INSERT INTO TRAINING_CERTIFICATE (ET_ID, Issue_Date, certificate_file_path)
        VALUES (p_ET_ID, CURDATE(), p_FilePath);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Training not completed.';
    END IF;
END $$

DELIMITER ;

SHOW PROCEDURE STATUS WHERE Db = 'hr_management_system' AND Name = 'AddNewEmployee';
SHOW PROCEDURE STATUS WHERE Db = 'hr_management_system' AND Name = 'AssignJobToEmployee';
SHOW PROCEDURE STATUS WHERE Db = 'hr_management_system' AND Name = 'CalculateEmployeeWeightedScore';
SHOW PROCEDURE STATUS WHERE Db = 'hr_management_system' AND Name = 'GetEmployeeFullProfile';
SHOW PROCEDURE STATUS WHERE Db = 'hr_management_system' AND Name = 'IssueTrainingCertificate';
SHOW PROCEDURE STATUS WHERE Db = 'hr_management_system' AND Name = 'CreatePerformanceCycle';

DESCRIBE EMPLOYEE;
DESCRIBE JOB;
DESCRIBE JOB_ASSIGNMENT;
DESCRIBE PERFORMANCE_CYCLE;
DESCRIBE APPRAISAL;
DESCRIBE TRAINING_PROGRAM;