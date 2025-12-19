import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';

// Placeholder pages
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import Faculties from './pages/Faculties';
import FacultyForm from './pages/FacultyForm';

import Departments from './pages/Departments';
import DepartmentForm from './pages/DepartmentForm';

import Jobs from './pages/Jobs';
import JobForm from './pages/JobForm';

import TrainingPrograms from './pages/TrainingPrograms';
import TrainingProgramForm from './pages/TrainingProgramForm';

import PerformanceCycles from './pages/PerformanceCycles';
import PerformanceAppraisals from './pages/PerformanceAppraisals';
import EmployeeAppraisal from './pages/EmployeeAppraisal';
import Appeals from './pages/Appeals';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/employees" element={<Layout><Employees /></Layout>} />
        <Route path="/employees/new" element={<Layout><EmployeeForm /></Layout>} />
        <Route path="/employees/:id" element={<Layout><EmployeeForm /></Layout>} />
        <Route path="/faculties" element={<Layout><Faculties /></Layout>} />
        <Route path="/faculties/new" element={<Layout><FacultyForm /></Layout>} />
        <Route path="/faculties/:id" element={<Layout><FacultyForm /></Layout>} />
        <Route path="/departments" element={<Layout><Departments /></Layout>} />
        <Route path="/departments/new" element={<Layout><DepartmentForm /></Layout>} />
        <Route path="/departments/:id" element={<Layout><DepartmentForm /></Layout>} />
        <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
        <Route path="/jobs/new" element={<Layout><JobForm /></Layout>} />
        <Route path="/jobs/:id" element={<Layout><JobForm /></Layout>} />
        <Route path="/training" element={<Layout><TrainingPrograms /></Layout>} />
        <Route path="/training/new" element={<Layout><TrainingProgramForm /></Layout>} />
        <Route path="/training/:id" element={<Layout><TrainingProgramForm /></Layout>} />

        <Route path="/performance/cycles" element={<Layout><PerformanceCycles /></Layout>} />
        <Route path="/performance/appraisals" element={<Layout><PerformanceAppraisals /></Layout>} />
        <Route path="/performance/appraisals/:cycleId/:assignmentId" element={<Layout><EmployeeAppraisal /></Layout>} />
        <Route path="/appeals" element={<Layout><Appeals /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
