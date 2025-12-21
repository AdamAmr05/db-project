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
BEFORE INSERT ON JOB_OBJECTIVE --before someone tries to insert a new objective
FOR EACH ROW -- this means it will run for each row that is inserted
BEGIN
    DECLARE current_total DECIMAL(5,2); --declare a variable to store the current total weight of the job objectives
    
    -- Calculate sum of existing weights for this job
    SELECT SUM(Weight) INTO current_total 
    FROM JOB_OBJECTIVE 
    WHERE Job_ID = NEW.Job_ID; -- sums the weight of the job objectives for that given job id
    
    -- Handle case where this is the very first objective (SUM returns NULL)
    IF current_total IS NULL THEN
        SET current_total = 0; --if the current total is null, set it to 0
    END IF;

    -- Check if Old Total + New Weight > 100
    IF (current_total + NEW.Weight) > 100 THEN --if the current total plus the new weight is greater than 100, raise an error
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Validation Error: Total weight for this job cannot exceed 100%.';
    END IF;
END $$
DELIMITER ;


-- Stop deletion when KPIs are linked to the objective
DELIMITER $$
CREATE TRIGGER Prevent_deletion_if_KPI 
BEFORE DELETE ON JOB_OBJECTIVE
FOR EACH ROW -- this means it will run for each row that is attempting to be deleted
BEGIN
    IF EXISTS (SELECT 1 FROM OBJECTIVE_KPI WHERE Objective_ID = OLD.Objective_ID) THEN --checks if any objective kpi is linked to the objective id
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Can't delete objective as it is linked to KPI";
    END IF; -- if it is, raise an error
END $$
DELIMITER ;


-- prevent_emp_with_assignment_deletion runs before deleting an employee to check if they have any active job assignments
DELIMITER $$
CREATE TRIGGER Prevent_emp_with_assignment_deletion 
BEFORE DELETE ON EMPLOYEE
FOR EACH ROW -- this means it will run for each row that is attempting to be deleted
BEGIN
    -- Check if they have any assignment marked 'Active'
    IF EXISTS (SELECT 1 FROM JOB_ASSIGNMENT WHERE Employee_ID = OLD.Employee_ID AND Status = 'Active') THEN --checks if any job assignment is linked to the employee id and is active
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Can't delete employee with active job assignments";
    END IF;
END $$
DELIMITER ;

-- note that the midlestone requires us to to after insert but, ok no so what the project wants us to do is insert then calculate and then update the score, but i cant start the process of updating the score until the insert is complete, so i need to do it before the insert is complete.. so we are calculating the weighted score before and then insert with the calculated weighted score...
DELIMITER $$
CREATE TRIGGER Calculate_Weighted_Score 
BEFORE INSERT ON EMPLOYEE_KPI_SCORE --before someone tries to insert a new kpi score
FOR EACH ROW
BEGIN
    SET NEW.Weighted_Score = NEW.Employee_Score * (SELECT Weight FROM OBJECTIVE_KPI WHERE KPI_ID = NEW.KPI_ID) / 100; --calculates the weighted score by multiplying the employee score by the weight of the kpi and dividing by 100
END $$     -- note that in the line above, we are multiplying by a second select statement to get the weight of the kpi
DELIMITER ;


-- prevent_training_deletion runs before deleting a training program to check if it is linked to any employee trainings
DELIMITER $$
CREATE TRIGGER Prevent_Training_Deletion 
BEFORE DELETE ON TRAINING_PROGRAM --before someone tries to delete a training program
FOR EACH ROW 
BEGIN
    IF EXISTS (SELECT 1 FROM EMPLOYEE_TRAINING WHERE Program_ID = OLD.Program_ID) THEN --checks if any employee training is linked to the program id
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Can't Delete assigned programs";
    END IF;
END $$
DELIMITER ;


-- Validate the attendance certificate when adding a new certificate
DELIMITER $$
CREATE TRIGGER Validate_Cert_Attendance 
BEFORE INSERT ON TRAINING_CERTIFICATE
FOR EACH ROW -- this means it will run for each row that is attempting to be inserted
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM EMPLOYEE_TRAINING WHERE ET_ID = NEW.ET_ID) THEN --checks if any employee training is linked to the employee training id
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Can't Validate attendance: Training Record not found";
    END IF;
END $$
DELIMITER ;


INSERT INTO EMPLOYEE_KPI_SCORE (Assignment_ID, KPI_ID, Performance_Cycle_ID, Actual_Value, Employee_Score) 
VALUES (1, 1, 1, 80, 4.5); 
SELECT Weighted_Score FROM EMPLOYEE_KPI_SCORE WHERE Score_ID = LAST_INSERT_ID(); -- this is used to get the weighted score of the last inserted kpi score
