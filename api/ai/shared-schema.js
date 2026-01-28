/**
 * Shared database schema context for AI prompts.
 */
const SCHEMA_CONTEXT = `
## HR Management System Database Schema

### Organizational Structure
- UNIVERSITY: University_ID*, University_Name, Acronym, Address
- FACULTY: Faculty_ID*, Faculty_Name, Location, Contact_Email, University_ID→UNIVERSITY
- DEPARTMENT: Department_ID*, Department_Name, Department_Type (Academic/Administrative), Location
- ACADEMIC_DEPARTMENT: Department_ID→DEPARTMENT, Faculty_ID→FACULTY
- ADMINISTRATIVE_DEPARTMENT: Department_ID→DEPARTMENT, University_ID→UNIVERSITY

### Employee Management
- EMPLOYEE: Employee_ID*, First_Name, Middle_Name, Last_Name, Gender, DOB, Nationality, Employment_Status (Active/Probation/Leave/Retired), Mobile_Phone, Work_Email, Residential_City, Residential_Country
- EMPLOYEE_DISABILITY: Disability_ID*, Employee_ID→EMPLOYEE, Disability_Type, Severity_Level
- SOCIAL_INSURANCE: Insurance_ID*, Employee_ID→EMPLOYEE, Insurance_Number, Start_Date, Status
- EDUCATIONAL_QUALIFICATION: Qualification_ID*, Employee_ID→EMPLOYEE, Institution_Name, Major, Degree_Type
- PROFESSIONAL_CERTIFICATE: Certificate_ID*, Employee_ID→EMPLOYEE, Certification_Name, Issuing_Organization, Issue_Date

### Jobs & Assignments
- CONTRACT: Contract_ID*, Contract_Name, Type, Default_Duration, Work_Modality
- JOB: Job_ID*, Job_Code, Job_Title, Job_Level (Entry/Mid/Senior), Job_Category, Min_Salary, Max_Salary, Status, Department_ID→DEPARTMENT, Reports_To→JOB
- JOB_OBJECTIVE: Objective_ID*, Job_ID→JOB, Objective_Title, Weight (0-100)
- OBJECTIVE_KPI: KPI_ID*, Objective_ID→JOB_OBJECTIVE, KPI_Name, Target_Value, Weight
- JOB_ASSIGNMENT: Assignment_ID*, Employee_ID→EMPLOYEE, Job_ID→JOB, Contract_ID→CONTRACT, Start_Date, End_Date, Status (Active/Inactive), Assigned_Salary

### Performance Management
- PERFORMANCE_CYCLE: Cycle_ID*, Cycle_Name, Cycle_Type (Annual/Quarterly/Semi-Annual), Start_Date, End_Date, Submission_Deadline
- EMPLOYEE_KPI_SCORE: Score_ID*, Assignment_ID→JOB_ASSIGNMENT, KPI_ID→OBJECTIVE_KPI, Performance_Cycle_ID→PERFORMANCE_CYCLE, Employee_Score (1-5), Weighted_Score
- APPRAISAL: Appraisal_ID*, Assignment_ID→JOB_ASSIGNMENT, Cycle_ID→PERFORMANCE_CYCLE, Overall_Score (0-100), Manager_Comments, HR_Comments
- APPEAL: Appeal_ID*, Appraisal_ID→APPRAISAL, Reason, Approval_Status (Pending/Approved/Rejected)

### Training & Development
- TRAINING_PROGRAM: Program_ID*, Program_Code, Title, Type, Subtype, Delivery_Method, Approval_Status
- EMPLOYEE_TRAINING: ET_ID*, Employee_ID→EMPLOYEE, Program_ID→TRAINING_PROGRAM, Completion_Status (Enrolled/In Progress/Completed)
- TRAINING_CERTIFICATE: Certificate_ID*, ET_ID→EMPLOYEE_TRAINING, Issue_Date

### Pre-built Views (efficient for common queries)
- View_Total_Employees, View_Active_Employees
- View_Employee_Count_By_Dept: Department_Name, EmployeeCount
- View_Gender_Distribution: Gender, CountPerGender
- View_Status_Distribution: Employment_Status, CountPerStatus
- View_Active_Assignments: Assignment_ID, Employee_ID, EmployeeName, Job_ID, Job_Title, Start_Date, End_Date
- View_Jobs_By_Level: Job_Level, Job_Count
- View_Salary_Stats_By_Category: Job_Category, MinSalary, MaxSalary, AvgSalary
- View_Training_Completion_Stats: Program_ID, Title, TotalAssigned, CompletedCount
- View_Full_Appraisal_Summary: Employee_ID, EmployeeName, Job_ID, Job_Title, Cycle_Name, Overall_Score

Note: * = primary key, → = foreign key
`;

module.exports = {
    SCHEMA_CONTEXT
};
