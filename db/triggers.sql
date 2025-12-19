USE hr_management_system;

DROP TRIGGER IF EXISTS Validate_Weight;
DROP TRIGGER IF EXISTS Prevent_deletion_if_KPI;
DROP TRIGGER IF EXISTS Prevent_emp_with_assignment_deletion;
DROP TRIGGER IF EXISTS Calculate_Weighted_Score;
DROP TRIGGER IF EXISTS Prevent_Training_Deletion;
DROP TRIGGER IF EXISTS Validate_Cert_Attendance;

-- checks the weight of the job objective when adding a new objective
DELIMITER $$
CREATE TRIGGER Validate_Weight 
BEFORE INSERT ON JOB_OBJECTIVE
FOR EACH ROW
BEGIN
    DECLARE current_total DECIMAL(5,2);
    
    -- Calculate sum of existing weights for this job
    SELECT SUM(Weight) INTO current_total 
    FROM JOB_OBJECTIVE 
    WHERE Job_ID = NEW.Job_ID;
    
    -- Handle case where this is the very first objective (SUM returns NULL)
    IF current_total IS NULL THEN
        SET current_total = 0;
    END IF;

    -- Check if Old Total + New Weight > 100
    IF (current_total + NEW.Weight) > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Validation Error: Total weight for this job cannot exceed 100%.';
    END IF;
END $$
DELIMITER ;


-- Stop deletion when KPIs are linked to the objective
DELIMITER $$
CREATE TRIGGER Prevent_deletion_if_KPI 
BEFORE DELETE ON JOB_OBJECTIVE
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM OBJECTIVE_KPI WHERE Objective_ID = OLD.Objective_ID) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Can't delete objective as it is linked to KPI";
    END IF;
END $$
DELIMITER ;


-- prevent_emp_with_assignment_deletion runs before deleting an employee to check if they have any active job assignments
DELIMITER $$
CREATE TRIGGER Prevent_emp_with_assignment_deletion 
BEFORE DELETE ON EMPLOYEE
FOR EACH ROW
BEGIN
    -- Check if they have any assignment marked 'Active'
    IF EXISTS (SELECT 1 FROM JOB_ASSIGNMENT WHERE Employee_ID = OLD.Employee_ID AND Status = 'Active') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Can't delete employee with active job assignments";
    END IF;
END $$
DELIMITER ;

-- note that the midlestone requires us to to after insert but, ok no so what the project wants us to do is insert then calculate and then update the score, but i cant start the process of updating the score until the insert is complete, so i need to do it before the insert is complete.. so we are calculating the weighted score before and then insert with the calculated weighted score...
DELIMITER $$
CREATE TRIGGER Calculate_Weighted_Score 
BEFORE INSERT ON EMPLOYEE_KPI_SCORE 
FOR EACH ROW
BEGIN
    SET NEW.Weighted_Score = NEW.Employee_Score * (SELECT Weight FROM OBJECTIVE_KPI WHERE KPI_ID = NEW.KPI_ID) / 100;
END $$
DELIMITER ;


-- prevent_training_deletion runs before deleting a training program to check if it is linked to any employee trainings
DELIMITER $$
CREATE TRIGGER Prevent_Training_Deletion 
BEFORE DELETE ON TRAINING_PROGRAM
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM EMPLOYEE_TRAINING WHERE Program_ID = OLD.Program_ID) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Can't Delete assigned programs";
    END IF;
END $$
DELIMITER ;


-- Validate the attendance certificate when adding a new certificate
DELIMITER $$
CREATE TRIGGER Validate_Cert_Attendance 
BEFORE INSERT ON TRAINING_CERTIFICATE
FOR EACH ROW
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM EMPLOYEE_TRAINING WHERE ET_ID = NEW.ET_ID) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Can't Validate attendance: Training Record not found";
    END IF;
END $$
DELIMITER ;


INSERT INTO EMPLOYEE_KPI_SCORE (Assignment_ID, KPI_ID, Performance_Cycle_ID, Actual_Value, Employee_Score)
VALUES (1, 1, 1, 80, 4.5);
SELECT Weighted_Score FROM EMPLOYEE_KPI_SCORE WHERE Score_ID = LAST_INSERT_ID();
