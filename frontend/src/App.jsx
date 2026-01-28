import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { ChatProvider } from './context/ChatContext';

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
import PerformanceHub from './pages/PerformanceHub';
import CycleDetail from './pages/CycleDetail';
import Appeals from './pages/Appeals';

import PowerBiDashboard from './pages/PowerBiDashboard';
import ChatPage from './pages/ChatPage';
import AiDashboard from './pages/AiDashboard';

const AppShell = () => {
  const location = useLocation();
  const [isPowerBiMounted, setIsPowerBiMounted] = useState(false);
  const showAnalytics = location.pathname === '/analytics/powerbi';

  useEffect(() => {
    if (showAnalytics && !isPowerBiMounted) {
      setIsPowerBiMounted(true);
    }
  }, [showAnalytics, isPowerBiMounted]);

  return (
    <Layout>
      {isPowerBiMounted ? (
        <div className={showAnalytics ? 'block' : 'hidden'}>
          <PowerBiDashboard />
        </div>
      ) : null}
      <div className={showAnalytics ? 'hidden' : 'block'}>
        <Outlet />
      </div>
    </Layout>
  );
};

function App() {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id" element={<EmployeeForm />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/faculties/new" element={<FacultyForm />} />
            <Route path="/faculties/:id" element={<FacultyForm />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/new" element={<DepartmentForm />} />
            <Route path="/departments/:id" element={<DepartmentForm />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/new" element={<JobForm />} />
            <Route path="/jobs/:id" element={<JobForm />} />
            <Route path="/training" element={<TrainingPrograms />} />
            <Route path="/training/new" element={<TrainingProgramForm />} />
            <Route path="/training/:id" element={<TrainingProgramForm />} />
            <Route path="/performance" element={<PerformanceHub />} />
            <Route path="/performance/cycles" element={<PerformanceCycles />} />
            <Route path="/performance/cycles/:id" element={<CycleDetail />} />
            <Route path="/performance/appraisals" element={<PerformanceAppraisals />} />
            <Route path="/performance/appraisals/:cycleId/:assignmentId" element={<EmployeeAppraisal />} />
            <Route path="/appeals" element={<Appeals />} />
            <Route path="/analytics/powerbi" element={<></>} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/ai-dashboard" element={<AiDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;
