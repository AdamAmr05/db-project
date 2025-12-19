
-- DATA INSERTION
INSERT INTO UNIVERSITY (University_Name, Acronym, Established_Year, Accreditation_Body, Address, Contact_Email, Website_URL)
VALUES 
('German International University', 'GIU', 2003, 'DAAD', 'New Cairo, Egypt', 'info@giu.edu.eg', 'www.giu-uni.de'),
('American University in Cairo', 'AUC', 1919, 'NEASC', 'New Cairo, Egypt', 'info@aucegypt.edu', 'www.aucegypt.edu'),
('Cairo University', 'CU', 1908, 'NAQAAE', 'Giza, Egypt', 'info@cu.edu.eg', 'www.cu.edu.eg'),
('Ain Shams University', 'ASU', 1950, 'NAQAAE', 'Cairo, Egypt', 'info@asu.edu.eg', 'www.asu.edu.eg'),
('Helwan University', 'HU', 1975, 'NAQAAE', 'Helwan, Egypt', 'info@helwan.edu.eg', 'www.helwan.edu.eg');

-- FACULTY
INSERT INTO FACULTY (Faculty_Name, Location, Contact_Email, University_ID)
VALUES 
('Faculty of Informatics', 'New Cairo', 'informatics@giu.edu.eg', 1),
('Faculty of Business', 'New Cairo', 'business@giu.edu.eg', 1),
('Faculty of Engineering', 'Giza', 'engineering@cu.edu.eg', 3),
('Faculty of Science', 'Cairo', 'science@asu.edu.eg', 4),
('Faculty of Medicine', 'Helwan', 'medicine@helwan.edu.eg', 5);

-- DEPARTMENT
INSERT INTO DEPARTMENT (Department_Name, Department_Type, Location, Contact_Email)
VALUES 
('Computer Science', 'Academic', 'New Cairo', 'cs@giu.edu.eg'),
('HR Department', 'Administrative', 'New Cairo', 'hr@giu.edu.eg'),
('Finance', 'Administrative', 'Giza', 'finance@cu.edu.eg'),
('Biology', 'Academic', 'Cairo', 'biology@asu.edu.eg'),
('Surgery', 'Academic', 'Helwan', 'surgery@helwan.edu.eg');

-- ACADEMIC_DEPARTMENT 
INSERT INTO ACADEMIC_DEPARTMENT (Department_ID, Faculty_ID)
VALUES 
(1, 1),
(4, 4),
(5, 5);

-- ADMINISTRATIVE_DEPARTMENT 
INSERT INTO ADMINISTRATIVE_DEPARTMENT (Department_ID, University_ID)
VALUES 
(2, 1),
(3, 3);

-- EMPLOYEE 
INSERT INTO EMPLOYEE (First_Name, Middle_Name, Last_Name, Arabic_Name, Gender, Nationality, DOB, Place_of_Birth, Marital_Status, Religion, Employment_Status, Mobile_Phone, Work_Phone, Work_Email, Personal_Email, Emergency_Contact_Name, Emergency_Contact_Phone, Emergency_Contact_Relationship, Residential_City, Residential_Area, Residential_Street, Residential_Country, Permanent_City, Permanent_Area, Permanent_Street, Permanent_Country, Medical_Clearance_Status, Criminal_Status)
VALUES 
('Adam', 'Amr', 'Hassaan', 'آدم عمرو حسان ', 'Male', 'Egyptian', '2005-10-24', 'Cairo', 'Married', 'Muslim', 'Active', '01012345678', '0226123456', 'adam.hassaan@student.giu-uni.de', 'adam@gmail.com', 'adam', '01098765432', 'same person', 'Cairo', 'Nasr City', 'Street 10', 'Egypt', 'Cairo', 'Nasr City', 'Street 10', 'Egypt', 'Cleared', 'Clear'),
('Sara', NULL, 'Hassan', 'سارة حسن', 'Female', 'Egyptian', '1990-07-20', 'Alexandria', 'Single', 'Muslim', 'Probation', '01123456789', '0226123457', 'sara.hassan@giu.edu.eg', 'sara@yahoo.com', 'Hoda Hassan', '01087654321', 'Mother', 'Cairo', 'Heliopolis', 'Street 5', 'Egypt', 'Alexandria', 'Smouha', 'Street 3', 'Egypt', 'Cleared', 'Clear'),
('Mohamed', 'Khaled', 'Ibrahim', 'محمد خالد إبراهيم', 'Male', 'Egyptian', '1988-11-10', 'Giza', 'Married', 'Muslim', 'Active', '01234567890', '0226123458', 'mohamed.ibrahim@cu.edu.eg', 'mohamed@gmail.com', 'Nour Ibrahim', '01076543210', 'Wife', 'Giza', 'Dokki', 'Street 12', 'Egypt', 'Giza', 'Dokki', 'Street 12', 'Egypt', 'Cleared', 'Clear'),
('Layla', 'Ahmed', 'Mostafa', 'ليلى أحمد مصطفى', 'Female', 'Egyptian', '1992-05-25', 'Cairo', 'Single', 'Muslim', 'Active', '01098765432', '0226123459', 'layla.mostafa@asu.edu.eg', 'layla@hotmail.com', 'Ahmed Mostafa', '01065432109', 'Father', 'Cairo', 'Maadi', 'Street 8', 'Egypt', 'Cairo', 'Maadi', 'Street 8', 'Egypt', 'Pending', 'Clear'),
('Omar', 'Hassan', 'Salem', 'عمر حسن سالم', 'Male', 'Egyptian', '1983-01-30', 'Helwan', 'Married', 'Muslim', 'Active', '01187654321', '0226123460', 'omar.salem@helwan.edu.eg', 'omar@gmail.com', 'Amira Salem', '01054321098', 'Wife', 'Helwan', 'Central', 'Street 15', 'Egypt', 'Helwan', 'Central', 'Street 15', 'Egypt', 'Cleared', 'Clear'),
('Heba', 'Yasser', 'Farid', 'هبة ياسر فريد', 'Female', 'Egyptian', '1995-09-12', 'Cairo', 'Single', 'Muslim', 'Active', '01276543210', '0226123461', 'heba.farid@giu.edu.eg', 'heba@yahoo.com', 'Yasser Farid', '01043210987', 'Father', 'Cairo', 'New Cairo', 'Street 20', 'Egypt', 'Cairo', 'New Cairo', 'Street 20', 'Egypt', 'Cleared', 'Clear'),
('Khaled', 'Tarek', 'Zaki', 'خالد طارق زكي', 'Male', 'Egyptian', '1987-12-05', 'Giza', 'Married', 'Muslim', 'Leave', '01365432109', '0226123462', 'khaled.zaki@cu.edu.eg', 'khaled@gmail.com', 'Dina Zaki', '01032109876', 'Wife', 'Giza', '6th October', 'Street 25', 'Egypt', 'Giza', '6th October', 'Street 25', 'Egypt', 'Cleared', 'Clear'),
('Nour', 'Hossam', 'Abdel', 'نور حسام عبد', 'Female', 'Egyptian', '1991-04-18', 'Cairo', 'Single', 'Muslim', 'Active', '01454321098', '0226123463', 'nour.abdel@asu.edu.eg', 'nour@hotmail.com', 'Hossam Abdel', '01021098765', 'Father', 'Cairo', 'Zamalek', 'Street 7', 'Egypt', 'Cairo', 'Zamalek', 'Street 7', 'Egypt', 'Cleared', 'Clear'),
('Youssef', 'Sherif', 'Nabil', 'يوسف شريف نبيل', 'Male', 'Egyptian', '1989-08-22', 'Alexandria', 'Married', 'Muslim', 'Active', '01543210987', '0226123464', 'youssef.nabil@giu.edu.eg', 'youssef@gmail.com', 'Rana Nabil', '01010987654', 'Wife', 'Cairo', 'Mohandessein', 'Street 30', 'Egypt', 'Alexandria', 'Miami', 'Street 5', 'Egypt', 'Cleared', 'Clear'),
('Dina', 'Walid', 'Kamal', 'دينا وليد كمال', 'Female', 'Egyptian', '1993-06-08', 'Cairo', 'Single', 'Muslim', 'Retired', '01632109876', '0226123465', 'dina.kamal@helwan.edu.eg', 'dina@yahoo.com', 'Walid Kamal', '01009876543', 'Father', 'Cairo', 'Helwan', 'Street 18', 'Egypt', 'Cairo', 'Helwan', 'Street 18', 'Egypt', 'Cleared', 'Record');

-- EMPLOYEE_DISABILITY 
INSERT INTO EMPLOYEE_DISABILITY (Employee_ID, Disability_Type, Severity_Level, Required_Support)
VALUES 
(1, 'Visual Impairment', 'Mild', 'Screen reader software'),
(3, 'Hearing Loss', 'Medium', 'Hearing aid and sign language support'),
(5, 'Mobility Issue', 'Severe', 'Wheelchair accessible workspace'),
(7, 'Learning Disability', 'Mild', 'Extended time for tasks'),
(9, 'Chronic Condition', 'Medium', 'Flexible work schedule');

-- SOCIAL_INSURANCE
INSERT INTO SOCIAL_INSURANCE (Employee_ID, Insurance_Number, Coverage_Details, Start_Date, End_Date, Status)
VALUES 
(1, 'SI-2020-001', 'Full medical and social coverage', '2020-01-15', NULL, 'Active'),
(2, 'SI-2024-002', 'Basic coverage', '2024-02-01', '2025-02-01', 'Active'),
(3, 'SI-2019-003', 'Premium coverage', '2019-06-01', NULL, 'Active'),
(4, 'SI-2023-004', 'Standard coverage', '2023-09-01', NULL, 'Active'),
(5, 'SI-2018-005', 'Family coverage', '2018-03-15', NULL, 'Active'),
(6, 'SI-2022-006', 'Basic coverage', '2022-07-01', NULL, 'Active'),
(7, 'SI-2020-007', 'Standard coverage', '2020-11-10', '2024-11-10', 'Expired'),
(8, 'SI-2023-008', 'Full coverage', '2023-01-05', NULL, 'Active'),
(9, 'SI-2021-009', 'Premium coverage', '2021-04-20', NULL, 'Active'),
(10, 'SI-2019-010', 'Retiree coverage', '2019-08-01', NULL, 'Inactive');

-- EDUCATIONAL_QUALIFICATION
INSERT INTO EDUCATIONAL_QUALIFICATION (Employee_ID, Institution_Name, Major, Degree_Type)
VALUES 
(1, 'Cairo University', 'Computer Science', 'BSc'),
(2, 'American University in Cairo', 'Business Administration', 'MBA'),
(3, 'German International University', 'Software Engineering', 'MSc'),
(4, 'Ain Shams University', 'Biology', 'BSc'),
(5, 'Helwan University', 'Medicine', 'MD'),
(6, 'German International University', 'Information Systems', 'BSc'),
(7, 'Cairo University', 'Engineering', 'PhD'),
(8, 'Ain Shams University', 'Data Science', 'MSc'),
(9, 'American University in Cairo', 'Computer Engineering', 'BSc'),
(10, 'Helwan University', 'Medical Research', 'PhD');

INSERT INTO PROFESSIONAL_CERTIFICATE (Employee_ID, Certification_Name, Issuing_Organization, Issue_Date, Expiry_Date, Credential_ID)
VALUES 
(1, 'PMP', 'PMI', '2022-03-15', '2025-03-15', 'PMP-2022-001'),
(2, 'Certified HR Professional', 'SHRM', '2023-06-20', NULL, 'SHRM-2023-002'),
(3, 'AWS Solutions Architect', 'Amazon', '2023-01-10', '2026-01-10', 'AWS-2023-003'),
(6, 'ITIL Foundation', 'AXELOS', '2021-09-05', NULL, 'ITIL-2021-006'),
(8, 'Data Science Professional', 'IBM', '2023-11-15', NULL, 'IBM-2023-008'),
(9, 'Cisco CCNA', 'Cisco', '2022-05-20', '2025-05-20', 'CCNA-2022-009'),
(1, 'Scrum Master', 'Scrum Alliance', '2021-08-10', '2024-08-10', 'CSM-2021-001'),
(3, 'Google Cloud Professional', 'Google', '2023-07-25', '2025-07-25', 'GCP-2023-003');

-- Contract
INSERT INTO CONTRACT (Contract_Name, Type, Description, Default_Duration, Work_Modality, Eligibility_Criteria)
VALUES 
('Full-Time Permanent', 'Permanent', 'Standard full-time employment', NULL, 'Full-Time', 'Bachelor degree required'),
('Probationary Contract', 'Probationary', 'Three month trial period', 3, 'Full-Time', 'New hires'),
('Part-Time Contract', 'Temporary', 'Part-time position', 12, 'Part-Time', 'Flexible requirements'),
('Remote Work', 'Permanent', 'Remote work arrangement', NULL, 'Remote', 'Experienced professionals'),
('Flexible Hours', 'Temporary', 'Flexible scheduling', 6, 'Flexible', 'Special cases');

-- Job
INSERT INTO JOB (Job_Code, Job_Title, Job_Level, Job_Category, Job_Grade, Min_Salary, Max_Salary, Job_Description, Status, Department_ID, Reports_To)
VALUES 
('HR-MGR-001', 'HR Manager', 'Senior', 'Management', 'Grade A', 15000.00, 25000.00, 'Manage HR operations', 'Active', 2, NULL),
('DEV-001', 'Software Developer', 'Mid', 'IT', 'Grade B', 10000.00, 18000.00, 'Develop software applications', 'Active', 1, NULL),
('FIN-001', 'Financial Analyst', 'Entry', 'Finance', 'Grade C', 8000.00, 14000.00, 'Analyze financial data', 'Active', 3, NULL),
('BIO-001', 'Biologist', 'Mid', 'Science', 'Grade B', 12000.00, 20000.00, 'Conduct biological research', 'Active', 4, NULL),
('MED-001', 'Surgeon', 'Senior', 'Medical', 'Grade A', 25000.00, 40000.00, 'Perform surgical procedures', 'Active', 5, NULL),
('DEV-LEAD-001', 'Development Lead', 'Senior', 'IT', 'Grade A', 18000.00, 28000.00, 'Lead development team', 'Active', 1, 2),
('HR-REC-001', 'HR Recruiter', 'Entry', 'HR', 'Grade C', 7000.00, 12000.00, 'Handle recruitment', 'Active', 2, 1),
('DEV-JR-001', 'Junior Developer', 'Entry', 'IT', 'Grade C', 6000.00, 10000.00, 'Support development', 'Active', 1, 2),
('FIN-MGR-001', 'Finance Manager', 'Senior', 'Finance', 'Grade A', 16000.00, 26000.00, 'Manage finance department', 'Active', 3, NULL),
('BIO-RES-001', 'Research Assistant', 'Entry', 'Science', 'Grade C', 7000.00, 11000.00, 'Assist in research', 'Active', 4, 4);

-- Job Objective
INSERT INTO JOB_OBJECTIVE (Job_ID, Objective_Title, Description, Weight, Salary)
VALUES 
(1, 'Employee Retention', 'Maintain high retention rate', 40.00, 10000.00),
(1, 'Recruitment Efficiency', 'Improve hiring process', 35.00, 8750.00),
(1, 'Training Programs', 'Develop training initiatives', 25.00, 6250.00),
(2, 'Code Quality', 'Maintain code standards', 35.00, 6300.00),
(2, 'Project Delivery', 'Deliver on time', 40.00, 7200.00),
(2, 'Innovation', 'Implement new solutions', 25.00, 4500.00),
(4, 'Research Output', 'Publish research findings', 60.00, 12000.00),
(4, 'Lab Management', 'Maintain lab standards', 40.00, 8000.00);

-- Objective KPI (14)
INSERT INTO OBJECTIVE_KPI (Objective_ID, KPI_Name, Description, Measurement_Unit, Target_Value, Weight)
VALUES 
(1, 'Turnover Rate', 'Employee turnover percentage', 'Percentage', 5.00, 50.00),
(1, 'Satisfaction Score', 'Employee satisfaction rating', 'Score', 4.50, 50.00),
(2, 'Time to Hire', 'Days to fill position', 'Days', 30.00, 60.00),
(2, 'Quality of Hire', 'New hire performance', 'Score', 4.00, 40.00),
(4, 'Code Review Pass', 'Pass rate on first review', 'Percentage', 85.00, 50.00),
(4, 'Bug Rate', 'Bugs per 1000 lines', 'Count', 2.00, 50.00),
(5, 'On-Time Delivery', 'Projects on schedule', 'Percentage', 90.00, 60.00),
(5, 'Budget Adherence', 'Within budget', 'Percentage', 95.00, 40.00),
(7, 'Publications', 'Papers published', 'Count', 5.00, 70.00),
(7, 'Citation Index', 'Research impact', 'Score', 3.50, 30.00);

-- Job Assignment 
INSERT INTO JOB_ASSIGNMENT (Employee_ID, Job_ID, Contract_ID, Start_Date, End_Date, Status, Assigned_Salary)
VALUES 
(1, 1, 1, '2020-01-15', NULL, 'Active', 22000.00),
(2, 7, 2, '2024-02-01', '2024-05-01', 'Inactive', 9000.00),
(3, 2, 1, '2019-06-01', NULL, 'Active', 15000.00),
(4, 10, 1, '2023-09-01', NULL, 'Active', 9000.00),
(5, 5, 1, '2018-03-15', NULL, 'Active', 32000.00),
(6, 8, 1, '2022-07-01', NULL, 'Active', 8000.00),
(7, 6, 1, '2020-11-10', NULL, 'Active', 23000.00),
(8, 4, 1, '2023-01-05', NULL, 'Active', 16000.00),
(9, 2, 1, '2021-04-20', NULL, 'Active', 14000.00),
(10, 3, 4, '2019-08-01', '2024-08-01', 'Inactive', 11000.00);


INSERT INTO PERFORMANCE_CYCLE (Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline)
VALUES 
('Q1 2024', 'Quarterly', '2024-01-01', '2024-03-31', '2024-04-15'),
('Annual 2023', 'Annual', '2023-01-01', '2023-12-31', '2024-01-15'),
('H1 2024', 'Bi-Annual', '2024-01-01', '2024-06-30', '2024-07-15'),
('Probation Review', 'Probation', '2024-07-01', '2024-09-30', '2024-10-15'),
('Q2 2024', 'Quarterly', '2024-04-01', '2024-06-30', '2024-07-15');


INSERT INTO EMPLOYEE_KPI_SCORE (Assignment_ID, KPI_ID, Performance_Cycle_ID, Actual_Value, Employee_Score, Weighted_Score, Reviewer_ID, Comments, Review_Date)
VALUES 
(1, 1, 1, 3.50, 4.50, 2.25, 7, 'Excellent performance', '2024-04-10'),
(1, 2, 1, 4.60, 5.00, 2.50, 7, 'Outstanding results', '2024-04-10'),
(3, 5, 1, 88.00, 4.20, 2.10, 7, 'Good code quality', '2024-04-12'),
(3, 6, 1, 1.80, 4.50, 2.25, 7, 'Low bug rate', '2024-04-12'),
(7, 7, 2, 92.00, 4.60, 2.76, 1, 'Excellent delivery', '2024-01-10'),
(7, 8, 2, 96.00, 4.80, 1.92, 1, 'Budget management', '2024-01-10'),
(8, 9, 3, 6.00, 5.00, 3.50, 5, 'Exceeded targets', '2024-07-10'),
(8, 10, 3, 3.80, 4.50, 1.35, 5, 'Strong impact', '2024-07-10'),
(9, 5, 1, 86.00, 4.10, 2.05, 7, 'Solid performance', '2024-04-15'),
(4, 9, 3, 4.00, 3.80, 2.66, 5, 'Good progress', '2024-07-12');


INSERT INTO APPRAISAL (Assignment_ID, Cycle_ID, Appraisal_Date, Overall_Score, Manager_Comments, HR_Comments, Employee_Comments, Reviewer_ID)
VALUES 
(1, 1, '2024-04-20', 95.00, 'Exceptional leadership', 'Promote', 'Thank you', 7),
(3, 1, '2024-04-22', 87.00, 'Solid technical skills', 'Good work', 'Will improve', 7),
(7, 2, '2024-01-20', 92.00, 'Outstanding delivery', 'Bonus approved', 'Appreciated', 1),
(8, 3, '2024-07-18', 88.00, 'Strong research output', 'Excellent', 'Thank you', 5),
(9, 1, '2024-04-25', 85.00, 'Good performance', 'Meets expectations', 'Working on it', 7),
(4, 3, '2024-07-20', 82.00, 'Good progress', 'Keep it up', 'Thanks', 5),
(6, 1, '2024-04-28', 79.00, 'Needs improvement', 'Training needed', 'Understood', 7),
(5, 2, '2024-01-25', 98.00, 'Exceptional surgeon', 'Outstanding', 'Grateful', 1);

INSERT INTO APPEAL (Appraisal_ID, Submission_Date, Reason, Original_Score, Approval_Status, appeal_outcome_Score)
VALUES 
(2, '2024-04-25', 'Critical project not considered', 87.00, 'Approved', 90.00),
(5, '2024-04-28', 'Additional responsibilities overlooked', 85.00, 'Pending', NULL),
(6, '2024-07-23', 'Performance metrics unclear', 82.00, 'Rejected', NULL),
(7, '2024-05-01', 'Request reconsideration', 79.00, 'Approved', 83.00),
(4, '2024-07-22', 'Research impact undervalued', 88.00, 'Pending', NULL);



INSERT INTO TRAINING_PROGRAM (Program_Code, Title, Objectives, Type, Subtype, Delivery_Method, Approval_Status)
VALUES 
('TRN-LEAD-001', 'Leadership Development', 'Develop leadership skills', 'Internal', 'Management', 'In-Person', 'Approved'),
('TRN-TECH-001', 'Advanced Python', 'Master Python programming', 'External', 'Technical', 'Virtual', 'Approved'),
('TRN-TECH-002', 'Cloud Architecture', 'Learn cloud platforms', 'Classroom', 'Technical', 'Blended', 'Approved'),
('TRN-SOFT-001', 'Communication Skills', 'Improve communication', 'Online', 'Soft Skills', 'Virtual', 'Approved'),
('TRN-BUS-001', 'Business Analysis', 'Business process modeling', 'External', 'Business', 'In-Person', 'Approved'),
('TRN-SEC-001', 'Cybersecurity', 'Security fundamentals', 'Online', 'Technical', 'Virtual', 'Approved'),
('TRN-DATA-001', 'Data Analytics', 'Data analysis with tools', 'Classroom', 'Technical', 'Blended', 'Pending'),
('TRN-MGMT-001', 'Project Management', 'PMP preparation', 'On-The-Job', 'Management', 'In-Person', 'Approved');

INSERT INTO EMPLOYEE_TRAINING (Employee_ID, Program_ID, Completion_Status)
VALUES 
(1, 1, 'Completed'),
(1, 8, 'Completed'),
(2, 4, 'In Progress'),
(3, 2, 'Completed'),
(3, 3, 'In Progress'),
(6, 2, 'In Progress'),
(7, 1, 'Completed'),
(7, 3, 'Completed'),
(8, 5, 'Completed'),
(9, 6, 'Completed');

INSERT INTO TRAINING_CERTIFICATE (ET_ID, Issue_Date, certificate_file_path)
VALUES 
(1, '2024-03-15', '/certificates/2024/cert_001.pdf'),
(2, '2024-05-20', '/certificates/2024/cert_002.pdf'),
(4, '2024-06-10', '/certificates/2024/cert_004.pdf'),
(7, '2024-02-28', '/certificates/2024/cert_007.pdf'),
(8, '2024-08-15', '/certificates/2024/cert_008.pdf'),
(9, '2024-07-05', '/certificates/2024/cert_009.pdf');

-- Count rows in each table
SELECT 'UNIVERSITY' as Table_Name, COUNT(*) as Row_Count FROM UNIVERSITY
UNION ALL SELECT 'FACULTY', COUNT(*) FROM FACULTY
UNION ALL SELECT 'DEPARTMENT', COUNT(*) FROM DEPARTMENT
UNION ALL SELECT 'EMPLOYEE', COUNT(*) FROM EMPLOYEE
UNION ALL SELECT 'JOB', COUNT(*) FROM JOB
UNION ALL SELECT 'JOB_ASSIGNMENT', COUNT(*) FROM JOB_ASSIGNMENT
UNION ALL SELECT 'EMPLOYEE_KPI_SCORE', COUNT(*) FROM EMPLOYEE_KPI_SCORE
UNION ALL SELECT 'APPRAISAL', COUNT(*) FROM APPRAISAL
UNION ALL SELECT 'TRAINING_PROGRAM', COUNT(*) FROM TRAINING_PROGRAM;

-- Test join between employee, job assignment and department tables
SELECT 
    e.First_Name,
    e.Last_Name,
    j.Job_Title,
    d.Department_Name,
    ja.Start_Date,
    ja.Status
FROM EMPLOYEE e
JOIN JOB_ASSIGNMENT ja ON e.Employee_ID = ja.Employee_ID
JOIN JOB j ON ja.Job_ID = j.Job_ID
JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
WHERE ja.Status = 'Active';

