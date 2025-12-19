CREATE DATABASE IF NOT EXISTS hr_management_system;
USE hr_management_system;

-- Drop tables if they exist so i can rerun without commenting ourt everytime i change somethijng
DROP TABLE IF EXISTS TRAINING_CERTIFICATE;
DROP TABLE IF EXISTS EMPLOYEE_TRAINING;
DROP TABLE IF EXISTS TRAINING_PROGRAM;
DROP TABLE IF EXISTS APPEAL;
DROP TABLE IF EXISTS APPRAISAL;
DROP TABLE IF EXISTS EMPLOYEE_KPI_SCORE;
DROP TABLE IF EXISTS PERFORMANCE_CYCLE;
DROP TABLE IF EXISTS JOB_ASSIGNMENT;
DROP TABLE IF EXISTS OBJECTIVE_KPI;
DROP TABLE IF EXISTS JOB_OBJECTIVE;
DROP TABLE IF EXISTS JOB;
DROP TABLE IF EXISTS CONTRACT;
DROP TABLE IF EXISTS PROFESSIONAL_CERTIFICATE;
DROP TABLE IF EXISTS EDUCATIONAL_QUALIFICATION;
DROP TABLE IF EXISTS EMPLOYEE_DISABILITY;
DROP TABLE IF EXISTS SOCIAL_INSURANCE;
DROP TABLE IF EXISTS EMPLOYEE;
DROP TABLE IF EXISTS ADMINISTRATIVE_DEPARTMENT;
DROP TABLE IF EXISTS ACADEMIC_DEPARTMENT;
DROP TABLE IF EXISTS DEPARTMENT;
DROP TABLE IF EXISTS FACULTY;
DROP TABLE IF EXISTS UNIVERSITY;

-- uni table 
CREATE TABLE UNIVERSITY (
    University_ID INT PRIMARY KEY AUTO_INCREMENT,
    University_Name VARCHAR(100) NOT NULL,
    Acronym VARCHAR(10),
    Established_Year INT,
    Accreditation_Body VARCHAR(100),
    Address VARCHAR(200),
    Contact_Email VARCHAR(100),
    Website_URL VARCHAR(500) 
);

-- faculty table 
CREATE TABLE FACULTY (
    Faculty_ID INT PRIMARY KEY AUTO_INCREMENT,
    Faculty_Name VARCHAR(100) NOT NULL,
    Location VARCHAR(100),
    Contact_Email VARCHAR(100),
    University_ID INT,
    
    FOREIGN KEY (University_ID) REFERENCES UNIVERSITY(University_ID)
        ON DELETE SET NULL
);

-- dept table
CREATE TABLE DEPARTMENT (
    Department_ID INT PRIMARY KEY AUTO_INCREMENT,
    Department_Name VARCHAR(100) NOT NULL,
    Department_Type VARCHAR(20) NOT NULL,
    Location VARCHAR(100),
    Contact_Email VARCHAR(100),
    
    -- we check if the department belongs to one of these types before letting it be inserted, instead of enforcing enums initially
    CHECK (Department_Type IN ('Academic', 'Administrative'))
);

-- acadepic dept table (subtype 1)
CREATE TABLE ACADEMIC_DEPARTMENT (
    Department_ID INT PRIMARY KEY AUTO_INCREMENT,
    Faculty_ID INT,
    -- dept id is a primary key, thats also a foreign key because we get it from the faculty table, this enforces the suptype ad supertype things
    FOREIGN KEY (Department_ID) REFERENCES DEPARTMENT(Department_ID)
        ON DELETE CASCADE, -- same reason as explained in the admin dept table ON DELETE CASCADE
    FOREIGN KEY (Faculty_ID) REFERENCES FACULTY(Faculty_ID)
        ON DELETE SET NULL
);

-- administrative dept (subtype 2)
CREATE TABLE ADMINISTRATIVE_DEPARTMENT (
    Department_ID INT PRIMARY KEY AUTO_INCREMENT,
    University_ID INT,
    -- pk fk logic same as academic dpt table
    FOREIGN KEY (Department_ID) REFERENCES DEPARTMENT(Department_ID)
        ON DELETE CASCADE, -- on delete cascade here because itss a subtype if you delete the department you cant have it, cant have a subtype withoput supertype
    FOREIGN KEY (University_ID) REFERENCES UNIVERSITY(University_ID)
        ON DELETE SET NULL
);

-- employee table!
CREATE TABLE EMPLOYEE (
    Employee_ID INT PRIMARY KEY AUTO_INCREMENT,
    First_Name VARCHAR(20) NOT NULL,
    Middle_Name VARCHAR(20),
    Last_Name VARCHAR(20) NOT NULL,
    Arabic_Name VARCHAR(20),
    Gender VARCHAR(10) NOT NULL,
    Nationality VARCHAR(50),
    DOB DATE NOT NULL,
    Place_of_Birth VARCHAR(100),
    Marital_Status VARCHAR(20),
    Religion VARCHAR(50),
    Employment_Status VARCHAR(20) NOT NULL,
    Mobile_Phone VARCHAR(20),
    Work_Phone VARCHAR(20),
    Work_Email VARCHAR(100),
    Personal_Email VARCHAR(100),
    Emergency_Contact_Name VARCHAR(20),
    Emergency_Contact_Phone VARCHAR(20),
    Emergency_Contact_Relationship VARCHAR(50),
    Residential_City VARCHAR(50),
    Residential_Area VARCHAR(50),
    Residential_Street VARCHAR(100),
    Residential_Country VARCHAR(50),
    Permanent_City VARCHAR(50),
    Permanent_Area VARCHAR(50),
    Permanent_Street VARCHAR(100),
    Permanent_Country VARCHAR(50),
    Medical_Clearance_Status VARCHAR(20),
    Criminal_Status VARCHAR(20),
    
    -- second check constraint, checking before inserting if it belongs
    CHECK (Employment_Status IN ('Active', 'Probation', 'Leave', 'Retired'))
);


-- employee disability table, non weak entity design
CREATE TABLE EMPLOYEE_DISABILITY (
    Disability_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Disability_Type VARCHAR(500) NOT NULL,
    Severity_Level VARCHAR(20),
    Required_Support TEXT, -- this could be a long or descriptive describing what the employee needs for the given support, thats why its text, could also be VARCHAR(500) maybe
    
    FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID)
        ON DELETE SET NULL
);
-- social insurace table
CREATE TABLE SOCIAL_INSURANCE (
    Insurance_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Insurance_Number VARCHAR(50) NOT NULL,
    Coverage_Details TEXT, -- again could be long and descriptive so text, unless we want to enforce limits for efficiency
    Start_Date DATE NOT NULL,
    End_Date DATE,
    Status VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID)
        ON DELETE SET NULL,
    
    -- this ensures End_Date is bigger than or equal Start_Date if specified, or allows NULL for open-ended periods, blocking invalid date insertions...
    CHECK (Start_Date <= End_Date OR End_Date IS NULL)
);

-- educational qualification table
CREATE TABLE EDUCATIONAL_QUALIFICATION (
    Qualification_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Institution_Name VARCHAR(100) NOT NULL,
    Major VARCHAR(100) NOT NULL,
    Degree_Type VARCHAR(50) NOT NULL,
    
    FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID)
        ON DELETE SET NULL
);

-- pro cert table
CREATE TABLE PROFESSIONAL_CERTIFICATE (
    Certificate_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Certification_Name VARCHAR(100) NOT NULL,
    Issuing_Organization VARCHAR(100) NOT NULL,
    Issue_Date DATE NOT NULL,
    Expiry_Date DATE,
    Credential_ID VARCHAR(50),
    
    FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID)
        ON DELETE SET NULL,
    
    -- same as the previous check, check count: 4
    CHECK (Issue_Date <= Expiry_Date OR Expiry_Date IS NULL)
);

-- contract table
CREATE TABLE CONTRACT (
    Contract_ID INT PRIMARY KEY AUTO_INCREMENT,
    Contract_Name VARCHAR(100) NOT NULL,
    Type VARCHAR(20) NOT NULL,
    Description TEXT,
    Default_Duration INT,
    Work_Modality VARCHAR(20),
    Eligibility_Criteria TEXT
);

-- job table
CREATE TABLE JOB (
    Job_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_Code VARCHAR(20) NOT NULL UNIQUE, -- job id for things like internal joins but this enforces the job being actually unique, might not be fully needed, its a nice to have
    Job_Title VARCHAR(100) NOT NULL,
    Job_Level VARCHAR(20),
    Job_Category VARCHAR(50),
    Job_Grade VARCHAR(20),
    Min_Salary DECIMAL(10,2),
    Max_Salary DECIMAL(10,2),
    Job_Description TEXT,
    Status VARCHAR(20) NOT NULL,
    Department_ID INT,
    Reports_To INT,
    
    FOREIGN KEY (Department_ID) REFERENCES DEPARTMENT(Department_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (Reports_To) REFERENCES JOB(Job_ID)
        ON DELETE SET NULL,
    
    -- validate before inserting that it seems correct
    CHECK (Min_Salary <= Max_Salary OR Max_Salary IS NULL)
);

-- job objective
CREATE TABLE JOB_OBJECTIVE (
    Objective_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_ID INT,
    Objective_Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Weight DECIMAL(5,2) NOT NULL,
    Salary DECIMAL(10,2),
    
    FOREIGN KEY (Job_ID) REFERENCES JOB(Job_ID)
        ON DELETE SET NULL,
    
    -- weight is the weight of importance of the job, has tio be logically between 0 and 100
    CHECK (Weight BETWEEN 0 AND 100)
);

-- objective kpi table 
CREATE TABLE OBJECTIVE_KPI (
    KPI_ID INT PRIMARY KEY AUTO_INCREMENT,
    Objective_ID INT,
    KPI_Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Measurement_Unit VARCHAR(50),
    Target_Value DECIMAL(10,2),
    Weight DECIMAL(5,2) NOT NULL,
    
    FOREIGN KEY (Objective_ID) REFERENCES JOB_OBJECTIVE(Objective_ID)
        ON DELETE SET NULL,
    
    -- 7th check constrain, same as the above
    CHECK (Weight BETWEEN 0 AND 100)
);

-- job assignment table
CREATE TABLE JOB_ASSIGNMENT (
    Assignment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Job_ID INT,
    Contract_ID INT,
    Start_Date DATE NOT NULL,
    End_Date DATE,
    Status VARCHAR(20) NOT NULL,
    Assigned_Salary DECIMAL(10,2),
    
    FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (Job_ID) REFERENCES JOB(Job_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (Contract_ID) REFERENCES CONTRACT(Contract_ID)
        ON DELETE SET NULL,
    
    -- validate date, this is the 8th check constraint
    CHECK (Start_Date <= End_Date OR End_Date IS NULL)
);

-- performance cyle table
CREATE TABLE PERFORMANCE_CYCLE (
    Cycle_ID INT PRIMARY KEY AUTO_INCREMENT,
    Cycle_Name VARCHAR(100) NOT NULL,
    Cycle_Type VARCHAR(20) NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Submission_Deadline DATE NOT NULL,
    
    -- validate date
    CHECK (Start_Date <= End_Date)
);

-- employee kpi score table 
CREATE TABLE EMPLOYEE_KPI_SCORE (
    Score_ID INT PRIMARY KEY AUTO_INCREMENT,
    Assignment_ID INT,
    KPI_ID INT,
    Performance_Cycle_ID INT,
    Actual_Value DECIMAL(10,2),
    Employee_Score DECIMAL(5,2),
    Weighted_Score DECIMAL(5,2),
    Reviewer_ID INT,
    Comments TEXT,
    Review_Date DATE,
    
    FOREIGN KEY (Assignment_ID) REFERENCES JOB_ASSIGNMENT(Assignment_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (KPI_ID) REFERENCES OBJECTIVE_KPI(KPI_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (Performance_Cycle_ID) REFERENCES PERFORMANCE_CYCLE(Cycle_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (Reviewer_ID) REFERENCES EMPLOYEE(Employee_ID)
        ON DELETE SET NULL,
    
    -- check that the score is between 1 and 5 for consistency and enforce a common rating scale
    CHECK (Employee_Score BETWEEN 1 AND 5 OR Employee_Score IS NULL)
);

-- appraisal table
CREATE TABLE APPRAISAL (
    Appraisal_ID INT PRIMARY KEY AUTO_INCREMENT,
    Assignment_ID INT,
    Cycle_ID INT,
    Appraisal_Date DATE NOT NULL,
    Overall_Score DECIMAL(5,2),
    Manager_Comments TEXT,
    HR_Comments TEXT,
    Employee_Comments TEXT,
    Reviewer_ID INT,
    
    FOREIGN KEY (Assignment_ID) REFERENCES JOB_ASSIGNMENT(Assignment_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (Cycle_ID) REFERENCES PERFORMANCE_CYCLE(Cycle_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (Reviewer_ID) REFERENCES EMPLOYEE(Employee_ID)
        ON DELETE SET NULL,
    
    -- enforce another scale, validate
    CHECK (Overall_Score BETWEEN 0 AND 100 OR Overall_Score IS NULL)
);

-- appeal table
CREATE TABLE APPEAL (
    Appeal_ID INT PRIMARY KEY AUTO_INCREMENT,
    Appraisal_ID INT,
    Submission_Date DATE NOT NULL,
    Reason TEXT NOT NULL,
    Original_Score DECIMAL(5,2),
    Approval_Status VARCHAR(20) NOT NULL,
    appeal_outcome_Score DECIMAL(5,2),
    
    FOREIGN KEY (Appraisal_ID) REFERENCES APPRAISAL(Appraisal_ID)
        ON DELETE SET NULL,
    
    -- this compensates for no enum
    CHECK (Approval_Status IN ('Pending', 'Approved', 'Rejected'))
);

-- training program table
CREATE TABLE TRAINING_PROGRAM (
    Program_ID INT PRIMARY KEY AUTO_INCREMENT,
    Program_Code VARCHAR(20) NOT NULL UNIQUE, -- same nice to have, unique because it's the role's ID.. theres only one definition for "Software Engineer" org wide (title, salary range, objectives, etc.). No duplicates, so two software engineers cant have different codes doing the same thing, UNIQUE on Job_Code forces every SWE to point to one single job record. Then Job_Assignment lets 100 SWEs all link to that exact same Job_Code
    Title VARCHAR(100) NOT NULL,
    Objectives TEXT,
    Type VARCHAR(50),
    Subtype VARCHAR(50),
    Delivery_Method VARCHAR(20),
    Approval_Status VARCHAR(20) NOT NULL
);

-- employee training table
CREATE TABLE EMPLOYEE_TRAINING (
    ET_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Program_ID INT,
    Completion_Status VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID)
        ON DELETE SET NULL,
    FOREIGN KEY (Program_ID) REFERENCES TRAINING_PROGRAM(Program_ID)
        ON DELETE SET NULL
);

-- training certificate table
CREATE TABLE TRAINING_CERTIFICATE (
    Certificate_ID INT PRIMARY KEY AUTO_INCREMENT,
    ET_ID INT,
    Issue_Date DATE NOT NULL,
    certificate_file_path VARCHAR(255),
    
    FOREIGN KEY (ET_ID) REFERENCES EMPLOYEE_TRAINING(ET_ID)
        ON DELETE CASCADE
);



-- Show all tables created
SHOW TABLES;

-- look at some tables' structure
DESCRIBE EMPLOYEE;
DESCRIBE JOB_ASSIGNMENT;
DESCRIBE EMPLOYEE_KPI_SCORE;
