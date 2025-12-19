-- EXPANDED DATA INSERTION FOR POWERBI DASHBOARD
-- This file adds 40+ more employees and proportional related records
USE hr_management_system;

-- Additional Universities
INSERT INTO UNIVERSITY (University_Name, Acronym, Established_Year, Accreditation_Body, Address, Contact_Email, Website_URL) VALUES 
('British University in Egypt', 'BUE', 2005, 'QAA', 'El Sherouk City, Egypt', 'info@bue.edu.eg', 'www.bue.edu.eg'),
('Future University in Egypt', 'FUE', 2006, 'NAQAAE', 'New Cairo, Egypt', 'info@fue.edu.eg', 'www.fue.edu.eg'),
('Misr International University', 'MIU', 1996, 'NAQAAE', 'Cairo, Egypt', 'info@miu.edu.eg', 'www.miu.edu.eg');

-- Additional Faculties
INSERT INTO FACULTY (Faculty_Name, Location, Contact_Email, University_ID) VALUES 
('Faculty of Pharmacy', 'New Cairo', 'pharmacy@giu.edu.eg', 1),
('Faculty of Law', 'New Cairo', 'law@auc.edu.eg', 2),
('Faculty of Arts', 'Giza', 'arts@cu.edu.eg', 3),
('Faculty of Computer Science', 'El Sherouk', 'cs@bue.edu.eg', 6),
('Faculty of Dentistry', 'New Cairo', 'dentistry@fue.edu.eg', 7);

-- Additional Departments
INSERT INTO DEPARTMENT (Department_Name, Department_Type, Location, Contact_Email) VALUES 
('IT Support', 'Administrative', 'New Cairo', 'itsupport@giu.edu.eg'),
('Legal Affairs', 'Administrative', 'New Cairo', 'legal@auc.edu.eg'),
('Research & Development', 'Academic', 'Giza', 'rnd@cu.edu.eg'),
('Marketing', 'Administrative', 'Cairo', 'marketing@asu.edu.eg'),
('Quality Assurance', 'Administrative', 'Helwan', 'qa@helwan.edu.eg'),
('Pharmacy', 'Academic', 'New Cairo', 'pharmacy@giu.edu.eg'),
('Dentistry', 'Academic', 'New Cairo', 'dentistry@fue.edu.eg'),
('Student Affairs', 'Administrative', 'Cairo', 'students@miu.edu.eg');

-- Link Academic Departments
INSERT INTO ACADEMIC_DEPARTMENT (Department_ID, Faculty_ID) VALUES 
(8, 6), (11, 8), (12, 10);

-- Link Administrative Departments  
INSERT INTO ADMINISTRATIVE_DEPARTMENT (Department_ID, University_ID) VALUES 
(6, 1), (7, 2), (9, 4), (10, 5), (13, 8);

-- 40 MORE EMPLOYEES with diverse demographics
INSERT INTO EMPLOYEE (First_Name, Middle_Name, Last_Name, Arabic_Name, Gender, Nationality, DOB, Place_of_Birth, Marital_Status, Religion, Employment_Status, Mobile_Phone, Work_Phone, Work_Email, Personal_Email, Emergency_Contact_Name, Emergency_Contact_Phone, Emergency_Contact_Relationship, Residential_City, Residential_Area, Residential_Street, Residential_Country, Permanent_City, Permanent_Area, Permanent_Street, Permanent_Country, Medical_Clearance_Status, Criminal_Status) VALUES 
('Ahmed', 'Mohamed', 'Elsayed', 'أحمد محمد السيد', 'Male', 'Egyptian', '1985-03-15', 'Cairo', 'Married', 'Muslim', 'Active', '01011111111', '0226111111', 'ahmed.elsayed@giu.edu.eg', 'ahmed@gmail.com', 'Fatma Elsayed', '01022222222', 'Wife', 'Cairo', 'Maadi', 'Street 1', 'Egypt', 'Cairo', 'Maadi', 'Street 1', 'Egypt', 'Cleared', 'Clear'),
('Fatima', 'Ali', 'Hassan', 'فاطمة علي حسن', 'Female', 'Egyptian', '1990-06-20', 'Alexandria', 'Single', 'Muslim', 'Active', '01011111112', '0226111112', 'fatima.hassan@giu.edu.eg', 'fatima@gmail.com', 'Ali Hassan', '01022222223', 'Father', 'Alexandria', 'Smouha', 'Street 2', 'Egypt', 'Alexandria', 'Smouha', 'Street 2', 'Egypt', 'Cleared', 'Clear'),
('John', 'William', 'Smith', NULL, 'Male', 'American', '1982-11-08', 'New York', 'Married', 'Christian', 'Active', '01011111113', '0226111113', 'john.smith@auc.edu.eg', 'john@gmail.com', 'Mary Smith', '01022222224', 'Wife', 'Cairo', 'New Cairo', 'Street 3', 'Egypt', 'New York', 'Manhattan', 'Street 3', 'USA', 'Cleared', 'Clear'),
('Maria', 'Elena', 'Garcia', NULL, 'Female', 'Spanish', '1988-04-12', 'Madrid', 'Single', 'Christian', 'Active', '01011111114', '0226111114', 'maria.garcia@cu.edu.eg', 'maria@gmail.com', 'Carlos Garcia', '01022222225', 'Brother', 'Giza', 'Dokki', 'Street 4', 'Egypt', 'Madrid', 'Centro', 'Street 4', 'Spain', 'Cleared', 'Clear'),
('Hassan', 'Ibrahim', 'Mahmoud', 'حسن إبراهيم محمود', 'Male', 'Egyptian', '1979-09-25', 'Giza', 'Married', 'Muslim', 'Active', '01011111115', '0226111115', 'hassan.mahmoud@asu.edu.eg', 'hassan@gmail.com', 'Nadia Mahmoud', '01022222226', 'Wife', 'Giza', '6th October', 'Street 5', 'Egypt', 'Giza', '6th October', 'Street 5', 'Egypt', 'Cleared', 'Clear'),
('Aya', 'Khaled', 'Mostafa', 'آية خالد مصطفى', 'Female', 'Egyptian', '1995-01-30', 'Cairo', 'Single', 'Muslim', 'Probation', '01011111116', '0226111116', 'aya.mostafa@helwan.edu.eg', 'aya@gmail.com', 'Khaled Mostafa', '01022222227', 'Father', 'Cairo', 'Nasr City', 'Street 6', 'Egypt', 'Cairo', 'Nasr City', 'Street 6', 'Egypt', 'Cleared', 'Clear'),
('Pierre', 'Jean', 'Dupont', NULL, 'Male', 'French', '1984-07-18', 'Paris', 'Married', 'Christian', 'Active', '01011111117', '0226111117', 'pierre.dupont@bue.edu.eg', 'pierre@gmail.com', 'Sophie Dupont', '01022222228', 'Wife', 'Cairo', 'Zamalek', 'Street 7', 'Egypt', 'Paris', 'Le Marais', 'Street 7', 'France', 'Cleared', 'Clear'),
('Mona', 'Samir', 'Abdallah', 'منى سمير عبدالله', 'Female', 'Egyptian', '1991-12-05', 'Luxor', 'Single', 'Muslim', 'Active', '01011111118', '0226111118', 'mona.abdallah@fue.edu.eg', 'mona@gmail.com', 'Samir Abdallah', '01022222229', 'Father', 'Cairo', 'Heliopolis', 'Street 8', 'Egypt', 'Luxor', 'East Bank', 'Street 8', 'Egypt', 'Cleared', 'Clear'),
('Tarek', 'Ashraf', 'Nour', 'طارق أشرف نور', 'Male', 'Egyptian', '1987-02-14', 'Aswan', 'Married', 'Muslim', 'Active', '01011111119', '0226111119', 'tarek.nour@miu.edu.eg', 'tarek@gmail.com', 'Hana Nour', '01022222230', 'Wife', 'Cairo', 'New Cairo', 'Street 9', 'Egypt', 'Aswan', 'Downtown', 'Street 9', 'Egypt', 'Cleared', 'Clear'),
('Amira', 'Yasser', 'Salem', 'أميرة ياسر سالم', 'Female', 'Egyptian', '1993-08-22', 'Port Said', 'Single', 'Muslim', 'Probation', '01011111120', '0226111120', 'amira.salem@giu.edu.eg', 'amira@gmail.com', 'Yasser Salem', '01022222231', 'Father', 'Cairo', 'Mohandessein', 'Street 10', 'Egypt', 'Port Said', 'Downtown', 'Street 10', 'Egypt', 'Pending', 'Clear'),
('Klaus', 'Heinrich', 'Mueller', NULL, 'Male', 'German', '1976-05-10', 'Berlin', 'Married', 'Christian', 'Active', '01011111121', '0226111121', 'klaus.mueller@giu.edu.eg', 'klaus@gmail.com', 'Anna Mueller', '01022222232', 'Wife', 'Cairo', 'Maadi', 'Street 11', 'Egypt', 'Berlin', 'Mitte', 'Street 11', 'Germany', 'Cleared', 'Clear'),
('Salma', 'Hossam', 'Farid', 'سلمى حسام فريد', 'Female', 'Egyptian', '1989-10-03', 'Tanta', 'Married', 'Muslim', 'Active', '01011111122', '0226111122', 'salma.farid@cu.edu.eg', 'salma@gmail.com', 'Hossam Farid', '01022222233', 'Husband', 'Giza', 'Faisal', 'Street 12', 'Egypt', 'Tanta', 'Downtown', 'Street 12', 'Egypt', 'Cleared', 'Clear'),
('Mahmoud', 'Adel', 'Rizk', 'محمود عادل رزق', 'Male', 'Egyptian', '1983-04-28', 'Mansoura', 'Married', 'Muslim', 'Leave', '01011111123', '0226111123', 'mahmoud.rizk@asu.edu.eg', 'mahmoud@gmail.com', 'Nora Rizk', '01022222234', 'Wife', 'Cairo', 'Shoubra', 'Street 13', 'Egypt', 'Mansoura', 'Downtown', 'Street 13', 'Egypt', 'Cleared', 'Clear'),
('Rania', 'Magdy', 'Taha', 'رانيا مجدي طه', 'Female', 'Egyptian', '1994-11-17', 'Cairo', 'Single', 'Muslim', 'Active', '01011111124', '0226111124', 'rania.taha@helwan.edu.eg', 'rania@gmail.com', 'Magdy Taha', '01022222235', 'Father', 'Cairo', 'Maadi', 'Street 14', 'Egypt', 'Cairo', 'Maadi', 'Street 14', 'Egypt', 'Cleared', 'Clear'),
('Ibrahim', 'Sayed', 'Khalil', 'إبراهيم سيد خليل', 'Male', 'Egyptian', '1972-06-08', 'Suez', 'Married', 'Muslim', 'Retired', '01011111125', '0226111125', 'ibrahim.khalil@bue.edu.eg', 'ibrahim@gmail.com', 'Amal Khalil', '01022222236', 'Wife', 'Cairo', 'Heliopolis', 'Street 15', 'Egypt', 'Suez', 'Downtown', 'Street 15', 'Egypt', 'Cleared', 'Clear'),
('Nadia', 'Fathy', 'Zidan', 'نادية فتحي زيدان', 'Female', 'Egyptian', '1986-03-21', 'Ismailia', 'Married', 'Muslim', 'Active', '01011111126', '0226111126', 'nadia.zidan@fue.edu.eg', 'nadia@gmail.com', 'Ahmed Zidan', '01022222237', 'Husband', 'Cairo', 'New Cairo', 'Street 16', 'Egypt', 'Ismailia', 'Downtown', 'Street 16', 'Egypt', 'Cleared', 'Clear'),
('Ali', 'Hamdi', 'Osman', 'علي حمدي عثمان', 'Male', 'Egyptian', '1980-09-14', 'Beni Suef', 'Married', 'Muslim', 'Active', '01011111127', '0226111127', 'ali.osman@miu.edu.eg', 'ali@gmail.com', 'Samia Osman', '01022222238', 'Wife', 'Cairo', 'Dokki', 'Street 17', 'Egypt', 'Beni Suef', 'Downtown', 'Street 17', 'Egypt', 'Cleared', 'Clear'),
('Yasmin', 'Sherif', 'Moussa', 'ياسمين شريف موسى', 'Female', 'Egyptian', '1997-01-09', 'Fayoum', 'Single', 'Muslim', 'Probation', '01011111128', '0226111128', 'yasmin.moussa@giu.edu.eg', 'yasmin@gmail.com', 'Sherif Moussa', '01022222239', 'Father', 'Cairo', 'Sheikh Zayed', 'Street 18', 'Egypt', 'Fayoum', 'Downtown', 'Street 18', 'Egypt', 'Cleared', 'Clear'),
('David', 'James', 'Wilson', NULL, 'Male', 'British', '1978-12-25', 'London', 'Married', 'Christian', 'Active', '01011111129', '0226111129', 'david.wilson@auc.edu.eg', 'david@gmail.com', 'Emma Wilson', '01022222240', 'Wife', 'Cairo', 'Zamalek', 'Street 19', 'Egypt', 'London', 'Westminster', 'Street 19', 'UK', 'Cleared', 'Clear'),
('Mariam', 'Tamer', 'Shehata', 'مريم تامر شحاتة', 'Female', 'Egyptian', '1992-07-04', 'Minya', 'Single', 'Christian', 'Active', '01011111130', '0226111130', 'mariam.shehata@cu.edu.eg', 'mariam@gmail.com', 'Tamer Shehata', '01022222241', 'Father', 'Cairo', 'Helwan', 'Street 20', 'Egypt', 'Minya', 'Downtown', 'Street 20', 'Egypt', 'Cleared', 'Clear'),
('Karim', 'Essam', 'Abdelaziz', 'كريم عصام عبدالعزيز', 'Male', 'Egyptian', '1981-05-16', 'Sohag', 'Married', 'Muslim', 'Active', '01011111131', '0226111131', 'karim.abdelaziz@asu.edu.eg', 'karim@gmail.com', 'Noha Abdelaziz', '01022222242', 'Wife', 'Cairo', 'Nasr City', 'Street 21', 'Egypt', 'Sohag', 'Downtown', 'Street 21', 'Egypt', 'Cleared', 'Clear'),
('Hana', 'Wael', 'Gaber', 'هنا وائل جابر', 'Female', 'Egyptian', '1996-02-28', 'Qena', 'Single', 'Muslim', 'Probation', '01011111132', '0226111132', 'hana.gaber@helwan.edu.eg', 'hana@gmail.com', 'Wael Gaber', '01022222243', 'Father', 'Cairo', 'Maadi', 'Street 22', 'Egypt', 'Qena', 'Downtown', 'Street 22', 'Egypt', 'Pending', 'Clear'),
('Mostafa', 'Nabil', 'Amin', 'مصطفى نبيل أمين', 'Male', 'Egyptian', '1975-08-11', 'Asyut', 'Married', 'Muslim', 'Retired', '01011111133', '0226111133', 'mostafa.amin@bue.edu.eg', 'mostafa@gmail.com', 'Soad Amin', '01022222244', 'Wife', 'Cairo', 'Mohandessein', 'Street 23', 'Egypt', 'Asyut', 'Downtown', 'Street 23', 'Egypt', 'Cleared', 'Clear'),
('Sarah', 'Ahmed', 'Mansour', 'سارة أحمد منصور', 'Female', 'Egyptian', '1988-04-19', 'Damietta', 'Married', 'Muslim', 'Active', '01011111134', '0226111134', 'sarah.mansour@fue.edu.eg', 'sarah@gmail.com', 'Omar Mansour', '01022222245', 'Husband', 'Cairo', 'New Cairo', 'Street 24', 'Egypt', 'Damietta', 'Downtown', 'Street 24', 'Egypt', 'Cleared', 'Clear'),
('Fadi', 'George', 'Mikhail', 'فادي جورج ميخائيل', 'Male', 'Egyptian', '1984-10-02', 'Cairo', 'Single', 'Christian', 'Active', '01011111135', '0226111135', 'fadi.mikhail@miu.edu.eg', 'fadi@gmail.com', 'George Mikhail', '01022222246', 'Father', 'Cairo', 'Heliopolis', 'Street 25', 'Egypt', 'Cairo', 'Heliopolis', 'Street 25', 'Egypt', 'Cleared', 'Clear'),
('Eman', 'Reda', 'Soliman', 'إيمان رضا سليمان', 'Female', 'Egyptian', '1991-06-15', 'Kafr El Sheikh', 'Single', 'Muslim', 'Active', '01011111136', '0226111136', 'eman.soliman@giu.edu.eg', 'eman@gmail.com', 'Reda Soliman', '01022222247', 'Father', 'Cairo', 'Dokki', 'Street 26', 'Egypt', 'Kafr El Sheikh', 'Downtown', 'Street 26', 'Egypt', 'Cleared', 'Clear'),
('Hesham', 'Farouk', 'Kamel', 'هشام فاروق كامل', 'Male', 'Egyptian', '1977-01-23', 'Beheira', 'Married', 'Muslim', 'Leave', '01011111137', '0226111137', 'hesham.kamel@auc.edu.eg', 'hesham@gmail.com', 'Dalia Kamel', '01022222248', 'Wife', 'Cairo', 'Zamalek', 'Street 27', 'Egypt', 'Beheira', 'Damanhur', 'Street 27', 'Egypt', 'Cleared', 'Clear'),
('Lina', 'Hatem', 'Fawzy', 'لينا حاتم فوزي', 'Female', 'Egyptian', '1999-09-07', 'Sharqia', 'Single', 'Muslim', 'Probation', '01011111138', '0226111138', 'lina.fawzy@cu.edu.eg', 'lina@gmail.com', 'Hatem Fawzy', '01022222249', 'Father', 'Cairo', 'Maadi', 'Street 28', 'Egypt', 'Sharqia', 'Zagazig', 'Street 28', 'Egypt', 'Cleared', 'Clear'),
('Tamer', 'Gamal', 'Helal', 'تامر جمال هلال', 'Male', 'Egyptian', '1986-11-30', 'Gharbia', 'Married', 'Muslim', 'Active', '01011111139', '0226111139', 'tamer.helal@asu.edu.eg', 'tamer@gmail.com', 'Maha Helal', '01022222250', 'Wife', 'Cairo', 'Faisal', 'Street 29', 'Egypt', 'Gharbia', 'Tanta', 'Street 29', 'Egypt', 'Cleared', 'Clear'),
('Nancy', 'Sameh', 'Morsy', 'نانسي سامح مرسي', 'Female', 'Egyptian', '1993-03-12', 'Monufia', 'Single', 'Muslim', 'Active', '01011111140', '0226111140', 'nancy.morsy@helwan.edu.eg', 'nancy@gmail.com', 'Sameh Morsy', '01022222251', 'Father', 'Cairo', 'Shoubra', 'Street 30', 'Egypt', 'Monufia', 'Shibin', 'Street 30', 'Egypt', 'Cleared', 'Clear'),
('Wael', 'Sabry', 'Lotfy', 'وائل صبري لطفي', 'Male', 'Egyptian', '1974-07-26', 'Qalyubia', 'Married', 'Muslim', 'Retired', '01011111141', '0226111141', 'wael.lotfy@bue.edu.eg', 'wael@gmail.com', 'Hoda Lotfy', '01022222252', 'Wife', 'Cairo', 'Nasr City', 'Street 31', 'Egypt', 'Qalyubia', 'Benha', 'Street 31', 'Egypt', 'Cleared', 'Clear'),
('Reem', 'Mohsen', 'Hafez', 'ريم محسن حافظ', 'Female', 'Egyptian', '1987-12-18', 'Dakahlia', 'Married', 'Muslim', 'Active', '01011111142', '0226111142', 'reem.hafez@fue.edu.eg', 'reem@gmail.com', 'Mohsen Hafez', '01022222253', 'Husband', 'Cairo', 'New Cairo', 'Street 32', 'Egypt', 'Dakahlia', 'Mansoura', 'Street 32', 'Egypt', 'Cleared', 'Clear'),
('Ayman', 'Lotfy', 'Saber', 'أيمن لطفي صابر', 'Male', 'Egyptian', '1982-02-05', 'Red Sea', 'Single', 'Muslim', 'Active', '01011111143', '0226111143', 'ayman.saber@miu.edu.eg', 'ayman@gmail.com', 'Lotfy Saber', '01022222254', 'Father', 'Cairo', 'Heliopolis', 'Street 33', 'Egypt', 'Hurghada', 'Downtown', 'Street 33', 'Egypt', 'Cleared', 'Clear'),
('Dalia', 'Nasser', 'Shawky', 'داليا ناصر شوقي', 'Female', 'Egyptian', '1990-05-24', 'South Sinai', 'Single', 'Muslim', 'Active', '01011111144', '0226111144', 'dalia.shawky@giu.edu.eg', 'dalia@gmail.com', 'Nasser Shawky', '01022222255', 'Father', 'Cairo', 'Dokki', 'Street 34', 'Egypt', 'Sharm', 'Downtown', 'Street 34', 'Egypt', 'Cleared', 'Clear'),
('Hazem', 'Atef', 'Hamdy', 'حازم عاطف حمدي', 'Male', 'Egyptian', '1979-08-31', 'North Sinai', 'Married', 'Muslim', 'Active', '01011111145', '0226111145', 'hazem.hamdy@auc.edu.eg', 'hazem@gmail.com', 'Manal Hamdy', '01022222256', 'Wife', 'Cairo', 'Mohandessein', 'Street 35', 'Egypt', 'Arish', 'Downtown', 'Street 35', 'Egypt', 'Cleared', 'Clear'),
('Mai', 'Osama', 'Nassar', 'مي أسامة نصار', 'Female', 'Egyptian', '1998-04-08', 'Matrouh', 'Single', 'Muslim', 'Probation', '01011111146', '0226111146', 'mai.nassar@cu.edu.eg', 'mai@gmail.com', 'Osama Nassar', '01022222257', 'Father', 'Cairo', 'Sheikh Zayed', 'Street 36', 'Egypt', 'Marsa Matrouh', 'Downtown', 'Street 36', 'Egypt', 'Pending', 'Clear'),
('Sherif', 'Maged', 'Rashwan', 'شريف ماجد رشوان', 'Male', 'Egyptian', '1985-10-15', 'New Valley', 'Married', 'Muslim', 'Active', '01011111147', '0226111147', 'sherif.rashwan@asu.edu.eg', 'sherif@gmail.com', 'Heba Rashwan', '01022222258', 'Wife', 'Cairo', 'Maadi', 'Street 37', 'Egypt', 'Kharga', 'Downtown', 'Street 37', 'Egypt', 'Cleared', 'Clear'),
('Noura', 'Akram', 'Barakat', 'نورا أكرم بركات', 'Female', 'Egyptian', '1994-06-22', 'Luxor', 'Single', 'Muslim', 'Active', '01011111148', '0226111148', 'noura.barakat@helwan.edu.eg', 'noura@gmail.com', 'Akram Barakat', '01022222259', 'Father', 'Cairo', 'Helwan', 'Street 38', 'Egypt', 'Luxor', 'West Bank', 'Street 38', 'Egypt', 'Cleared', 'Clear'),
('Amr', 'Hany', 'Seif', 'عمرو هاني سيف', 'Male', 'Egyptian', '1981-01-17', 'Aswan', 'Married', 'Muslim', 'Active', '01011111149', '0226111149', 'amr.seif@bue.edu.eg', 'amr@gmail.com', 'Sara Seif', '01022222260', 'Wife', 'Cairo', 'New Cairo', 'Street 39', 'Egypt', 'Aswan', 'Downtown', 'Street 39', 'Egypt', 'Cleared', 'Clear'),
('Jana', 'Tarek', 'Abdel-Rahim', 'جنى طارق عبدالرحيم', 'Female', 'Egyptian', '2000-09-29', 'Cairo', 'Single', 'Muslim', 'Probation', '01011111150', '0226111150', 'jana.rahim@fue.edu.eg', 'jana@gmail.com', 'Tarek Abdel-Rahim', '01022222261', 'Father', 'Cairo', 'Zamalek', 'Street 40', 'Egypt', 'Cairo', 'Zamalek', 'Street 40', 'Egypt', 'Cleared', 'Clear');

-- Additional Jobs across departments
INSERT INTO JOB (Job_Code, Job_Title, Job_Level, Job_Category, Job_Grade, Min_Salary, Max_Salary, Job_Description, Status, Department_ID, Reports_To) VALUES 
('IT-SUP-001', 'IT Support Specialist', 'Entry', 'IT', 'Grade C', 6000.00, 10000.00, 'Provide IT support', 'Active', 6, NULL),
('IT-MGR-001', 'IT Manager', 'Senior', 'IT', 'Grade A', 18000.00, 28000.00, 'Manage IT department', 'Active', 6, NULL),
('LEG-001', 'Legal Advisor', 'Mid', 'Legal', 'Grade B', 14000.00, 22000.00, 'Provide legal advice', 'Active', 7, NULL),
('LEG-MGR-001', 'Legal Manager', 'Senior', 'Management', 'Grade A', 20000.00, 32000.00, 'Manage legal affairs', 'Active', 7, NULL),
('RND-001', 'Research Scientist', 'Mid', 'Science', 'Grade B', 12000.00, 20000.00, 'Conduct research', 'Active', 8, NULL),
('RND-LEAD-001', 'Research Lead', 'Senior', 'Science', 'Grade A', 18000.00, 28000.00, 'Lead research team', 'Active', 8, NULL),
('MKT-001', 'Marketing Specialist', 'Entry', 'Marketing', 'Grade C', 7000.00, 12000.00, 'Handle marketing', 'Active', 9, NULL),
('MKT-MGR-001', 'Marketing Manager', 'Senior', 'Marketing', 'Grade A', 16000.00, 26000.00, 'Manage marketing', 'Active', 9, NULL),
('QA-001', 'Quality Analyst', 'Mid', 'Quality', 'Grade B', 10000.00, 16000.00, 'Quality assurance', 'Active', 10, NULL),
('QA-MGR-001', 'QA Manager', 'Senior', 'Quality', 'Grade A', 15000.00, 24000.00, 'Manage QA dept', 'Active', 10, NULL),
('PHRM-001', 'Pharmacist', 'Mid', 'Medical', 'Grade B', 12000.00, 18000.00, 'Pharmacy work', 'Active', 11, NULL),
('DENT-001', 'Dentist', 'Mid', 'Medical', 'Grade B', 15000.00, 25000.00, 'Dental care', 'Active', 12, NULL),
('STU-001', 'Student Advisor', 'Entry', 'Administrative', 'Grade C', 6000.00, 10000.00, 'Student support', 'Active', 13, NULL),
('ACC-001', 'Accountant', 'Entry', 'Finance', 'Grade C', 7000.00, 12000.00, 'Accounting work', 'Active', 3, 9),
('SR-DEV-001', 'Senior Developer', 'Senior', 'IT', 'Grade A', 16000.00, 25000.00, 'Senior development', 'Active', 1, 6),
('DATA-001', 'Data Analyst', 'Mid', 'IT', 'Grade B', 10000.00, 16000.00, 'Data analysis', 'Active', 1, 6),
('HR-ASST-001', 'HR Assistant', 'Entry', 'HR', 'Grade C', 5000.00, 8000.00, 'HR support', 'Active', 2, 1),
('PROF-CS-001', 'CS Professor', 'Senior', 'Academic', 'Grade A', 20000.00, 35000.00, 'Teach CS', 'Active', 1, NULL),
('PROF-BIO-001', 'Biology Professor', 'Senior', 'Academic', 'Grade A', 18000.00, 30000.00, 'Teach Biology', 'Active', 4, NULL),
('PROF-MED-001', 'Medical Professor', 'Senior', 'Academic', 'Grade A', 25000.00, 40000.00, 'Teach Medicine', 'Active', 5, NULL);

-- Job Objectives for new jobs
INSERT INTO JOB_OBJECTIVE (Job_ID, Objective_Title, Description, Weight, Salary) VALUES 
(11, 'Ticket Resolution', 'Resolve IT tickets efficiently', 50.00, 4000.00),
(11, 'User Satisfaction', 'Maintain user satisfaction', 50.00, 4000.00),
(12, 'System Uptime', 'Ensure system availability', 60.00, 16800.00),
(12, 'Budget Management', 'Control IT budget', 40.00, 11200.00),
(15, 'Research Output', 'Publish papers', 60.00, 12000.00),
(15, 'Grant Acquisition', 'Secure research grants', 40.00, 8000.00),
(18, 'Campaign Success', 'Run successful campaigns', 60.00, 15600.00),
(18, 'Brand Awareness', 'Increase visibility', 40.00, 10400.00),
(20, 'Quality Metrics', 'Meet quality standards', 70.00, 16800.00),
(20, 'Process Improvement', 'Improve processes', 30.00, 7200.00);

-- Objective KPIs for new objectives
INSERT INTO OBJECTIVE_KPI (Objective_ID, KPI_Name, Description, Measurement_Unit, Target_Value, Weight) VALUES 
(9, 'Avg Resolution Time', 'Hours to resolve tickets', 'Hours', 4.00, 60.00),
(9, 'First Call Resolution', 'Resolve on first call', 'Percentage', 75.00, 40.00),
(10, 'User Rating', 'User satisfaction score', 'Score', 4.20, 100.00),
(11, 'Uptime Percentage', 'System uptime', 'Percentage', 99.50, 70.00),
(11, 'Incident Response', 'Response time in minutes', 'Minutes', 15.00, 30.00),
(13, 'Papers Published', 'Annual publications', 'Count', 4.00, 60.00),
(13, 'Citation Count', 'Total citations', 'Count', 50.00, 40.00),
(15, 'Campaign ROI', 'Return on investment', 'Percentage', 150.00, 70.00),
(15, 'Lead Generation', 'Leads generated', 'Count', 500.00, 30.00),
(17, 'Defect Rate', 'Defects per release', 'Count', 5.00, 50.00),
(17, 'Test Coverage', 'Code test coverage', 'Percentage', 80.00, 50.00);

-- Additional Contracts
INSERT INTO CONTRACT (Contract_Name, Type, Description, Default_Duration, Work_Modality, Eligibility_Criteria) VALUES 
('Academic Full-Time', 'Permanent', 'Academic staff contract', NULL, 'Full-Time', 'PhD required'),
('Research Grant', 'Temporary', 'Grant-funded position', 24, 'Full-Time', 'Research experience'),
('Visiting Professor', 'Temporary', 'Visiting position', 12, 'Part-Time', 'Professorship');

-- Job Assignments for new employees (IDs 11-50)
INSERT INTO JOB_ASSIGNMENT (Employee_ID, Job_ID, Contract_ID, Start_Date, End_Date, Status, Assigned_Salary) VALUES 
(11, 11, 1, '2021-03-15', NULL, 'Active', 8500.00),
(12, 17, 1, '2022-06-20', NULL, 'Active', 12000.00),
(13, 28, 6, '2019-11-08', NULL, 'Active', 28000.00),
(14, 13, 1, '2020-04-12', NULL, 'Active', 18000.00),
(15, 12, 1, '2018-09-25', NULL, 'Active', 24000.00),
(16, 27, 2, '2024-01-30', '2024-04-30', 'Active', 6500.00),
(17, 15, 1, '2021-07-18', NULL, 'Active', 16000.00),
(18, 21, 1, '2022-12-05', NULL, 'Active', 14000.00),
(19, 19, 1, '2020-02-14', NULL, 'Active', 22000.00),
(20, 7, 2, '2024-08-22', NULL, 'Active', 10000.00),
(21, 29, 6, '2017-05-10', NULL, 'Active', 32000.00),
(22, 2, 1, '2021-10-03', NULL, 'Active', 14500.00),
(23, 6, 1, '2019-04-28', NULL, 'Leave', 24000.00),
(24, 24, 1, '2023-11-17', NULL, 'Active', 11000.00),
(25, 5, 1, '2016-06-08', '2024-06-08', 'Inactive', 35000.00),
(26, 22, 1, '2021-03-21', NULL, 'Active', 17000.00),
(27, 3, 1, '2019-09-14', NULL, 'Active', 12000.00),
(28, 8, 2, '2024-01-09', NULL, 'Active', 7500.00),
(29, 14, 1, '2020-12-25', NULL, 'Active', 20000.00),
(30, 23, 1, '2022-07-04', NULL, 'Active', 9000.00),
(31, 16, 1, '2020-05-16', NULL, 'Active', 18000.00),
(32, 11, 2, '2024-02-28', NULL, 'Active', 7000.00),
(33, 30, 7, '2015-08-11', '2024-08-11', 'Inactive', 38000.00),
(34, 25, 1, '2021-04-19', NULL, 'Active', 12500.00),
(35, 26, 1, '2020-10-02', NULL, 'Active', 14000.00),
(36, 17, 1, '2022-06-15', NULL, 'Active', 11000.00),
(37, 3, 1, '2019-01-23', NULL, 'Leave', 13000.00),
(38, 8, 2, '2024-09-07', NULL, 'Active', 8000.00),
(39, 2, 1, '2021-11-30', NULL, 'Active', 15500.00),
(40, 19, 1, '2022-03-12', NULL, 'Active', 20000.00),
(41, 5, 1, '2017-07-26', '2024-07-26', 'Inactive', 36000.00),
(42, 20, 1, '2021-12-18', NULL, 'Active', 22000.00),
(43, 2, 1, '2020-02-05', NULL, 'Active', 16000.00),
(44, 17, 1, '2022-05-24', NULL, 'Active', 10500.00),
(45, 14, 1, '2019-08-31', NULL, 'Active', 21000.00),
(46, 8, 2, '2024-04-08', NULL, 'Active', 7500.00),
(47, 16, 1, '2021-10-15', NULL, 'Active', 17500.00),
(48, 24, 1, '2023-06-22', NULL, 'Active', 10000.00),
(49, 12, 1, '2020-01-17', NULL, 'Active', 25000.00),
(50, 27, 2, '2024-09-29', NULL, 'Active', 6000.00);

-- More Performance Cycles
INSERT INTO PERFORMANCE_CYCLE (Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline) VALUES 
('Q3 2024', 'Quarterly', '2024-07-01', '2024-09-30', '2024-10-15'),
('Q4 2024', 'Quarterly', '2024-10-01', '2024-12-31', '2025-01-15'),
('H2 2024', 'Bi-Annual', '2024-07-01', '2024-12-31', '2025-01-15'),
('Annual 2024', 'Annual', '2024-01-01', '2024-12-31', '2025-01-31'),
('Q1 2025', 'Quarterly', '2025-01-01', '2025-03-31', '2025-04-15'),
('Q2 2025', 'Quarterly', '2025-04-01', '2025-06-30', '2025-07-15'),
('Q3 2025', 'Quarterly', '2025-07-01', '2025-09-30', '2025-10-15'),
('Q4 2025', 'Quarterly', '2025-10-01', '2025-12-31', '2026-01-15'),
('H2 2025', 'Bi-Annual', '2025-07-01', '2025-12-31', '2026-01-15'),
('Annual 2025', 'Annual', '2025-01-01', '2025-12-31', '2026-01-31');

-- Employee KPI Scores for all active assignments
INSERT INTO EMPLOYEE_KPI_SCORE (Assignment_ID, KPI_ID, Performance_Cycle_ID, Actual_Value, Employee_Score, Weighted_Score, Reviewer_ID, Comments, Review_Date) VALUES 
(11, 11, 1, 3.50, 4.20, 2.52, 1, 'Good resolution time', '2024-04-10'),
(11, 12, 1, 78.00, 4.00, 1.60, 1, 'Above target', '2024-04-10'),
(12, 5, 1, 90.00, 4.50, 2.25, 7, 'Excellent code quality', '2024-04-12'),
(13, 9, 2, 6.00, 5.00, 3.50, 5, 'Outstanding publications', '2024-01-10'),
(14, 5, 1, 85.00, 4.00, 2.00, 3, 'Solid legal work', '2024-04-15'),
(15, 13, 3, 99.80, 5.00, 3.50, 1, 'Exceptional uptime', '2024-07-10'),
(17, 15, 1, 5.00, 4.60, 2.76, 5, 'Strong research', '2024-04-12'),
(18, 21, 3, 15.00, 4.00, 2.00, 5, 'Good pharma work', '2024-07-15'),
(19, 7, 2, 93.00, 4.70, 2.82, 1, 'Great delivery', '2024-01-12'),
(22, 5, 1, 88.00, 4.30, 2.15, 7, 'Good performance', '2024-04-15'),
(24, 3, 1, 28.00, 4.20, 2.52, 1, 'Quick hiring', '2024-04-18'),
(26, 5, 6, 87.00, 4.20, 2.10, 7, 'Solid work', '2024-10-12'),
(27, 5, 1, 82.00, 3.80, 1.90, 9, 'Meets expectations', '2024-04-20'),
(29, 5, 1, 89.00, 4.40, 2.20, 7, 'Strong skills', '2024-04-15'),
(30, 9, 3, 4.00, 3.80, 2.28, 5, 'Good progress', '2024-07-18'),
(31, 7, 2, 91.00, 4.50, 2.70, 1, 'Excellent work', '2024-01-15'),
(34, 5, 6, 86.00, 4.10, 2.05, 7, 'Good coding', '2024-10-15'),
(35, 9, 3, 5.00, 4.50, 2.70, 5, 'Strong output', '2024-07-20'),
(36, 5, 1, 84.00, 4.00, 2.00, 7, 'Meets targets', '2024-04-22'),
(39, 5, 6, 92.00, 4.80, 2.40, 7, 'Excellent work', '2024-10-18'),
(40, 7, 3, 94.00, 4.90, 2.94, 1, 'Outstanding', '2024-07-25'),
(42, 17, 6, 4.00, 4.20, 2.10, 9, 'Good defect rate', '2024-10-20'),
(43, 5, 1, 87.00, 4.30, 2.15, 7, 'Solid developer', '2024-04-25'),
(44, 5, 6, 83.00, 3.90, 1.95, 7, 'Good progress', '2024-10-22'),
(45, 5, 2, 90.00, 4.60, 2.30, 7, 'Strong performer', '2024-01-18'),
(47, 7, 3, 92.00, 4.70, 2.82, 1, 'Great delivery', '2024-07-28'),
(48, 3, 6, 32.00, 3.70, 2.22, 1, 'Room for improvement', '2024-10-25'),
(49, 13, 3, 99.90, 5.00, 3.50, 1, 'Perfect uptime', '2024-07-30');

-- Appraisals for employees
INSERT INTO APPRAISAL (Assignment_ID, Cycle_ID, Appraisal_Date, Overall_Score, Manager_Comments, HR_Comments, Employee_Comments, Reviewer_ID) VALUES 
(11, 1, '2024-04-20', 84.00, 'Good IT support', 'Meets standards', 'Thank you', 1),
(12, 1, '2024-04-22', 88.00, 'Strong developer', 'Recommend training', 'Appreciated', 7),
(13, 2, '2024-01-20', 96.00, 'Outstanding professor', 'Bonus approved', 'Grateful', 5),
(14, 1, '2024-04-24', 86.00, 'Solid legal advice', 'Good work', 'Will improve', 3),
(15, 3, '2024-07-18', 94.00, 'Excellent IT management', 'Promote', 'Thank you', 1),
(17, 1, '2024-04-26', 89.00, 'Great research', 'Continue', 'Thanks', 5),
(18, 3, '2024-07-20', 82.00, 'Good pharma work', 'Needs training', 'Understood', 5),
(19, 2, '2024-01-22', 91.00, 'Strong QA work', 'Excellent', 'Appreciated', 1),
(22, 1, '2024-04-28', 86.00, 'Good developer', 'Meets targets', 'Thanks', 7),
(24, 1, '2024-04-30', 83.00, 'Room to grow', 'Training needed', 'Will work on it', 1),
(26, 6, '2024-10-18', 87.00, 'Consistent work', 'Good progress', 'Thank you', 7),
(27, 1, '2024-05-02', 78.00, 'Needs improvement', 'Support needed', 'Understood', 9),
(29, 1, '2024-05-04', 90.00, 'Great developer', 'Bonus approved', 'Grateful', 7),
(30, 3, '2024-07-22', 80.00, 'Good progress', 'Keep working', 'Thanks', 5),
(31, 2, '2024-01-24', 93.00, 'Excellent analyst', 'Promote', 'Appreciated', 1),
(34, 6, '2024-10-20', 85.00, 'Good work', 'Meets expectations', 'Thanks', 7),
(35, 3, '2024-07-24', 88.00, 'Strong research', 'Continue', 'Appreciated', 5),
(36, 1, '2024-05-06', 82.00, 'Meeting targets', 'Good', 'Will improve', 7),
(39, 6, '2024-10-22', 92.00, 'Outstanding developer', 'Bonus', 'Grateful', 7),
(40, 3, '2024-07-26', 94.00, 'Exceptional work', 'Promote', 'Thank you', 1),
(42, 6, '2024-10-24', 88.00, 'Strong QA', 'Good progress', 'Appreciated', 9),
(43, 1, '2024-05-08', 87.00, 'Solid performance', 'Meets targets', 'Thanks', 7),
(44, 6, '2024-10-26', 81.00, 'Good progress', 'Training upcoming', 'Will work hard', 7),
(45, 2, '2024-01-26', 91.00, 'Excellent legal work', 'Continue', 'Appreciated', 7),
(47, 3, '2024-07-28', 90.00, 'Great analyst', 'Good work', 'Thank you', 1),
(48, 6, '2024-10-28', 76.00, 'Needs improvement', 'Training needed', 'Will improve', 1),
(49, 3, '2024-07-30', 97.00, 'Exceptional IT manager', 'Bonus approved', 'Grateful', 1);

-- Additional Appeals
INSERT INTO APPEAL (Appraisal_ID, Submission_Date, Reason, Original_Score, Approval_Status, appeal_outcome_Score) VALUES 
(11, '2024-05-05', 'Critical project not considered', 78.00, 'Approved', 82.00),
(14, '2024-05-08', 'Additional duties overlooked', 82.00, 'Pending', NULL),
(20, '2024-10-30', 'Metrics unclear', 76.00, 'Approved', 80.00);

-- More Training Programs
INSERT INTO TRAINING_PROGRAM (Program_Code, Title, Objectives, Type, Subtype, Delivery_Method, Approval_Status) VALUES 
('TRN-AI-001', 'AI Fundamentals', 'Learn AI basics', 'External', 'Technical', 'Virtual', 'Approved'),
('TRN-AGILE-001', 'Agile Methodology', 'Agile practices', 'Classroom', 'Management', 'In-Person', 'Approved'),
('TRN-FIN-001', 'Financial Management', 'Financial skills', 'Internal', 'Business', 'Blended', 'Approved'),
('TRN-HR-001', 'HR Best Practices', 'Modern HR methods', 'Online', 'HR', 'Virtual', 'Approved'),
('TRN-LEGAL-001', 'Legal Compliance', 'Compliance training', 'Internal', 'Legal', 'In-Person', 'Approved'),
('TRN-MED-001', 'Medical Ethics', 'Ethics in medicine', 'Classroom', 'Medical', 'In-Person', 'Approved'),
('TRN-RES-001', 'Research Methods', 'Research techniques', 'External', 'Academic', 'Blended', 'Approved');

-- Employee Training assignments
INSERT INTO EMPLOYEE_TRAINING (Employee_ID, Program_ID, Completion_Status) VALUES 
(11, 9, 'Completed'), (12, 2, 'Completed'), (13, 15, 'Completed'),
(14, 13, 'Completed'), (15, 9, 'Completed'), (16, 4, 'In Progress'),
(17, 15, 'Completed'), (18, 14, 'Completed'), (19, 10, 'Completed'),
(20, 12, 'In Progress'), (21, 15, 'Completed'), (22, 2, 'Completed'),
(23, 1, 'Completed'), (24, 4, 'In Progress'), (25, 14, 'Completed'),
(26, 14, 'Completed'), (27, 5, 'Completed'), (28, 2, 'In Progress'),
(29, 1, 'Completed'), (30, 15, 'Completed'), (31, 9, 'Completed'),
(32, 9, 'In Progress'), (33, 14, 'Completed'), (34, 2, 'Completed'),
(35, 8, 'Completed'), (36, 2, 'In Progress'), (37, 5, 'Completed'),
(38, 2, 'In Progress'), (39, 9, 'Completed'), (40, 10, 'Completed'),
(41, 14, 'Completed'), (42, 9, 'Completed'), (43, 2, 'Completed'),
(44, 2, 'In Progress'), (45, 13, 'Completed'), (46, 4, 'In Progress'),
(47, 9, 'Completed'), (48, 12, 'In Progress'), (49, 1, 'Completed'),
(50, 4, 'In Progress'), (11, 10, 'Completed'), (15, 1, 'Completed'),
(21, 9, 'Completed'), (29, 9, 'Completed'), (43, 9, 'Completed');

-- Training Certificates for completed trainings
INSERT INTO TRAINING_CERTIFICATE (ET_ID, Issue_Date, certificate_file_path) VALUES 
(11, '2024-04-15', '/certificates/2024/cert_011.pdf'),
(12, '2024-05-20', '/certificates/2024/cert_012.pdf'),
(13, '2024-02-28', '/certificates/2024/cert_013.pdf'),
(14, '2024-06-10', '/certificates/2024/cert_014.pdf'),
(15, '2024-03-15', '/certificates/2024/cert_015.pdf'),
(17, '2024-05-25', '/certificates/2024/cert_017.pdf'),
(18, '2024-07-12', '/certificates/2024/cert_018.pdf'),
(19, '2024-04-20', '/certificates/2024/cert_019.pdf'),
(21, '2024-01-30', '/certificates/2024/cert_021.pdf'),
(22, '2024-06-18', '/certificates/2024/cert_022.pdf'),
(23, '2024-03-10', '/certificates/2024/cert_023.pdf'),
(25, '2024-08-05', '/certificates/2024/cert_025.pdf'),
(26, '2024-07-20', '/certificates/2024/cert_026.pdf'),
(27, '2024-05-15', '/certificates/2024/cert_027.pdf'),
(29, '2024-04-25', '/certificates/2024/cert_029.pdf'),
(30, '2024-08-10', '/certificates/2024/cert_030.pdf'),
(31, '2024-06-22', '/certificates/2024/cert_031.pdf'),
(33, '2024-09-01', '/certificates/2024/cert_033.pdf'),
(34, '2024-07-28', '/certificates/2024/cert_034.pdf'),
(35, '2024-08-15', '/certificates/2024/cert_035.pdf'),
(37, '2024-05-30', '/certificates/2024/cert_037.pdf'),
(39, '2024-09-10', '/certificates/2024/cert_039.pdf'),
(40, '2024-06-25', '/certificates/2024/cert_040.pdf'),
(41, '2024-09-15', '/certificates/2024/cert_041.pdf'),
(42, '2024-08-20', '/certificates/2024/cert_042.pdf'),
(43, '2024-07-05', '/certificates/2024/cert_043.pdf'),
(45, '2024-06-30', '/certificates/2024/cert_045.pdf'),
(47, '2024-08-28', '/certificates/2024/cert_047.pdf'),
(49, '2024-04-30', '/certificates/2024/cert_049.pdf'),
(51, '2024-05-10', '/certificates/2024/cert_051.pdf'),
(52, '2024-04-05', '/certificates/2024/cert_052.pdf'),
(53, '2024-02-15', '/certificates/2024/cert_053.pdf'),
(54, '2024-05-18', '/certificates/2024/cert_054.pdf'),
(55, '2024-07-15', '/certificates/2024/cert_055.pdf');

-- Additional disabilities for new employees
INSERT INTO EMPLOYEE_DISABILITY (Employee_ID, Disability_Type, Severity_Level, Required_Support) VALUES 
(13, 'Color Blindness', 'Mild', 'Color-adjusted displays'),
(21, 'Back Condition', 'Medium', 'Ergonomic workstation'),
(27, 'Hearing Loss', 'Mild', 'Hearing assistance devices');

-- Social insurance for new employees
INSERT INTO SOCIAL_INSURANCE (Employee_ID, Insurance_Number, Coverage_Details, Start_Date, End_Date, Status) VALUES 
(11, 'SI-2021-011', 'Standard coverage', '2021-03-15', NULL, 'Active'),
(12, 'SI-2022-012', 'Basic coverage', '2022-06-20', NULL, 'Active'),
(13, 'SI-2019-013', 'Premium coverage', '2019-11-08', NULL, 'Active'),
(14, 'SI-2020-014', 'Full coverage', '2020-04-12', NULL, 'Active'),
(15, 'SI-2018-015', 'Family coverage', '2018-09-25', NULL, 'Active'),
(16, 'SI-2024-016', 'Basic coverage', '2024-01-30', '2024-07-30', 'Active'),
(17, 'SI-2021-017', 'Standard coverage', '2021-07-18', NULL, 'Active'),
(18, 'SI-2022-018', 'Standard coverage', '2022-12-05', NULL, 'Active'),
(19, 'SI-2020-019', 'Premium coverage', '2020-02-14', NULL, 'Active'),
(20, 'SI-2024-020', 'Basic coverage', '2024-08-22', NULL, 'Active'),
(21, 'SI-2017-021', 'Premium coverage', '2017-05-10', NULL, 'Active'),
(22, 'SI-2021-022', 'Standard coverage', '2021-10-03', NULL, 'Active'),
(23, 'SI-2019-023', 'Full coverage', '2019-04-28', NULL, 'Active'),
(24, 'SI-2023-024', 'Basic coverage', '2023-11-17', NULL, 'Active'),
(25, 'SI-2016-025', 'Retiree coverage', '2016-06-08', NULL, 'Inactive'),
(26, 'SI-2021-026', 'Standard coverage', '2021-03-21', NULL, 'Active'),
(27, 'SI-2019-027', 'Standard coverage', '2019-09-14', NULL, 'Active'),
(28, 'SI-2024-028', 'Basic coverage', '2024-01-09', NULL, 'Active'),
(29, 'SI-2020-029', 'Premium coverage', '2020-12-25', NULL, 'Active'),
(30, 'SI-2022-030', 'Standard coverage', '2022-07-04', NULL, 'Active'),
(31, 'SI-2020-031', 'Full coverage', '2020-05-16', NULL, 'Active'),
(32, 'SI-2024-032', 'Basic coverage', '2024-02-28', NULL, 'Active'),
(33, 'SI-2015-033', 'Retiree coverage', '2015-08-11', NULL, 'Inactive'),
(34, 'SI-2021-034', 'Standard coverage', '2021-04-19', NULL, 'Active'),
(35, 'SI-2020-035', 'Standard coverage', '2020-10-02', NULL, 'Active'),
(36, 'SI-2022-036', 'Basic coverage', '2022-06-15', NULL, 'Active'),
(37, 'SI-2019-037', 'Standard coverage', '2019-01-23', NULL, 'Active'),
(38, 'SI-2024-038', 'Basic coverage', '2024-09-07', NULL, 'Active'),
(39, 'SI-2021-039', 'Full coverage', '2021-11-30', NULL, 'Active'),
(40, 'SI-2022-040', 'Premium coverage', '2022-03-12', NULL, 'Active'),
(41, 'SI-2017-041', 'Retiree coverage', '2017-07-26', NULL, 'Inactive'),
(42, 'SI-2021-042', 'Full coverage', '2021-12-18', NULL, 'Active'),
(43, 'SI-2020-043', 'Standard coverage', '2020-02-05', NULL, 'Active'),
(44, 'SI-2022-044', 'Basic coverage', '2022-05-24', NULL, 'Active'),
(45, 'SI-2019-045', 'Premium coverage', '2019-08-31', NULL, 'Active'),
(46, 'SI-2024-046', 'Basic coverage', '2024-04-08', NULL, 'Active'),
(47, 'SI-2021-047', 'Full coverage', '2021-10-15', NULL, 'Active'),
(48, 'SI-2023-048', 'Basic coverage', '2023-06-22', NULL, 'Active'),
(49, 'SI-2020-049', 'Family coverage', '2020-01-17', NULL, 'Active'),
(50, 'SI-2024-050', 'Basic coverage', '2024-09-29', NULL, 'Active');

-- Educational qualifications for new employees
INSERT INTO EDUCATIONAL_QUALIFICATION (Employee_ID, Institution_Name, Major, Degree_Type) VALUES 
(11, 'Cairo University', 'Information Technology', 'BSc'),
(12, 'GIU', 'Computer Science', 'BSc'),
(13, 'MIT', 'Computer Science', 'PhD'),
(14, 'Cairo University', 'Law', 'LLB'),
(15, 'GIU', 'Computer Engineering', 'MSc'),
(16, 'Helwan University', 'HR Management', 'BSc'),
(17, 'Oxford University', 'Chemistry', 'PhD'),
(18, 'Cairo University', 'Pharmacy', 'PharmD'),
(19, 'AUC', 'Quality Management', 'MBA'),
(20, 'GIU', 'HR Management', 'BSc'),
(21, 'Berlin University', 'Computer Science', 'PhD'),
(22, 'Cairo University', 'Software Engineering', 'BSc'),
(23, 'Ain Shams University', 'Computer Science', 'MSc'),
(24, 'Helwan University', 'Finance', 'BSc'),
(25, 'Cairo University', 'Medicine', 'MD'),
(26, 'Future University', 'Dentistry', 'DDS'),
(27, 'Ain Shams University', 'Accounting', 'BSc'),
(28, 'GIU', 'Computer Science', 'BSc'),
(29, 'London Business School', 'Law', 'LLM'),
(30, 'Cairo University', 'Education', 'BSc'),
(31, 'AUC', 'Data Science', 'MSc'),
(32, 'Helwan University', 'IT', 'BSc'),
(33, 'Harvard', 'Medicine', 'PhD'),
(34, 'GIU', 'Marketing', 'BSc'),
(35, 'Ain Shams University', 'Research Methods', 'MSc'),
(36, 'Cairo University', 'Computer Science', 'BSc'),
(37, 'Cairo University', 'Accounting', 'BSc'),
(38, 'GIU', 'Software Development', 'BSc'),
(39, 'AUC', 'Computer Engineering', 'BSc'),
(40, 'Cairo University', 'Quality Engineering', 'MSc'),
(41, 'Cairo University', 'Surgery', 'MD'),
(42, 'Future University', 'Quality Assurance', 'BSc'),
(43, 'GIU', 'Software Engineering', 'BSc'),
(44, 'Helwan University', 'Computer Science', 'BSc'),
(45, 'Sorbonne', 'International Law', 'LLM'),
(46, 'GIU', 'HR Management', 'BSc'),
(47, 'AUC', 'Business Analytics', 'MBA'),
(48, 'Cairo University', 'Finance', 'BSc'),
(49, 'GIU', 'Computer Science', 'MSc'),
(50, 'Future University', 'HR Management', 'BSc');

-- Professional certificates for new employees
INSERT INTO PROFESSIONAL_CERTIFICATE (Employee_ID, Certification_Name, Issuing_Organization, Issue_Date, Expiry_Date, Credential_ID) VALUES 
(11, 'CompTIA A+', 'CompTIA', '2021-05-15', '2024-05-15', 'COMPTIA-A-011'),
(12, 'Oracle Java', 'Oracle', '2022-08-20', '2025-08-20', 'ORACLE-JAVA-012'),
(13, 'IEEE Fellow', 'IEEE', '2020-01-10', NULL, 'IEEE-FELLOW-013'),
(15, 'CISSP', 'ISC2', '2020-03-25', '2023-03-25', 'CISSP-015'),
(17, 'Six Sigma', 'ASQ', '2021-09-10', NULL, 'SIXSIGMA-017'),
(19, 'PMP', 'PMI', '2021-04-14', '2024-04-14', 'PMP-019'),
(21, 'AWS Solutions Architect', 'Amazon', '2019-05-10', '2022-05-10', 'AWS-021'),
(22, 'Microsoft Azure', 'Microsoft', '2022-01-15', '2025-01-15', 'AZURE-022'),
(29, 'LLM Certification', 'Law Society', '2021-06-20', NULL, 'LLM-029'),
(31, 'Google Analytics', 'Google', '2021-08-25', '2024-08-25', 'GANALYTICS-031'),
(39, 'Docker Certified', 'Docker', '2022-03-10', '2025-03-10', 'DOCKER-039'),
(43, 'Kubernetes Admin', 'CNCF', '2021-11-05', '2024-11-05', 'K8S-043'),
(47, 'Tableau Desktop', 'Tableau', '2022-07-18', '2025-07-18', 'TABLEAU-047'),
(49, 'ITIL Expert', 'AXELOS', '2020-09-22', NULL, 'ITIL-049');

-- Summary counts
SELECT 'SUMMARY OF INSERTED DATA' AS Info;
SELECT 'UNIVERSITY' as Table_Name, COUNT(*) as Row_Count FROM UNIVERSITY
UNION ALL SELECT 'FACULTY', COUNT(*) FROM FACULTY
UNION ALL SELECT 'DEPARTMENT', COUNT(*) FROM DEPARTMENT
UNION ALL SELECT 'EMPLOYEE', COUNT(*) FROM EMPLOYEE
UNION ALL SELECT 'JOB', COUNT(*) FROM JOB
UNION ALL SELECT 'JOB_ASSIGNMENT', COUNT(*) FROM JOB_ASSIGNMENT
UNION ALL SELECT 'PERFORMANCE_CYCLE', COUNT(*) FROM PERFORMANCE_CYCLE
UNION ALL SELECT 'EMPLOYEE_KPI_SCORE', COUNT(*) FROM EMPLOYEE_KPI_SCORE
UNION ALL SELECT 'APPRAISAL', COUNT(*) FROM APPRAISAL
UNION ALL SELECT 'APPEAL', COUNT(*) FROM APPEAL
UNION ALL SELECT 'TRAINING_PROGRAM', COUNT(*) FROM TRAINING_PROGRAM
UNION ALL SELECT 'EMPLOYEE_TRAINING', COUNT(*) FROM EMPLOYEE_TRAINING
UNION ALL SELECT 'TRAINING_CERTIFICATE', COUNT(*) FROM TRAINING_CERTIFICATE;
