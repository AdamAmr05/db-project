# Frontend Integration Guide React)

## Overview
This guide shows how to connect your frontend to the HRMS backend API.

## Step 1: Update Your API Base URL

In your project, create a config file or environment variable:

```javascript
// config.js or .env.local
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

## Step 2: Create API Service Functions

Create a service file to handle API calls:

```javascript
// services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
}

// Employee API calls
export const employeeAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/employees${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiCall(`/employees/${id}`),
  
  getStats: (id) => apiCall(`/employees/${id}/stats`),
  
  create: (data) => apiCall('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/employees/${id}`, {
    method: 'DELETE',
  }),
};

// Faculty API calls
export const facultyAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/faculties${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiCall(`/faculties/${id}`),
  
  create: (data) => apiCall('/faculties', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/faculties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/faculties/${id}`, {
    method: 'DELETE',
  }),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
  getEmployeeCountByDept: () => apiCall('/dashboard/employee-count-by-dept'),
  getGenderDistribution: () => apiCall('/dashboard/gender-distribution'),
  getStatusDistribution: () => apiCall('/dashboard/status-distribution'),
  getJobsByLevel: () => apiCall('/dashboard/jobs-by-level'),
  getSalaryStats: () => apiCall('/dashboard/salary-stats'),
  getTrainingCompletion: () => apiCall('/dashboard/training-completion'),
  getAppraisalsPerCycle: () => apiCall('/dashboard/appraisals-per-cycle'),
};
```

## Step 3: Use in React Components

### Example: Employee List Component

```javascript
// components/EmployeeList.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Employees</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.Employee_ID}>
              <td>{emp.First_Name} {emp.Last_Name}</td>
              <td>{emp.Work_Email}</td>
              <td>{emp.Employment_Status}</td>
              <td>{emp.Department_Name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Example: Dashboard Component

```javascript
// components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="dashboard">
      <h1>HRMS Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p className="stat-value">{stats.totalEmployees}</p>
        </div>
        <div className="stat-card">
          <h3>Active Employees</h3>
          <p className="stat-value">{stats.activeEmployees}</p>
        </div>
        <div className="stat-card">
          <h3>Active Jobs</h3>
          <p className="stat-value">{stats.activeJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Training Programs</h3>
          <p className="stat-value">{stats.totalTrainingPrograms}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Appraisal Score</h3>
          <p className="stat-value">{stats.avgAppraisalScore.toFixed(1)}</p>
        </div>
        <div className="stat-card">
          <h3>KPI Completion Rate</h3>
          <p className="stat-value">{stats.kpiCompletionRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
```

### Example: Create Employee Form

```javascript
// components/CreateEmployeeForm.jsx
import { useState } from 'react';
import { employeeAPI } from '../services/api';

export default function CreateEmployeeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Gender: '',
    DOB: '',
    Work_Email: '',
    Mobile_Phone: '',
    Employment_Status: 'Active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await employeeAPI.create(formData);
      onSuccess?.();
      // Reset form
      setFormData({
        First_Name: '',
        Last_Name: '',
        Gender: '',
        DOB: '',
        Work_Email: '',
        Mobile_Phone: '',
        Employment_Status: 'Active',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="First Name"
        value={formData.First_Name}
        onChange={(e) => setFormData({ ...formData, First_Name: e.target.value })}
        required
      />
      
      <input
        type="text"
        placeholder="Last Name"
        value={formData.Last_Name}
        onChange={(e) => setFormData({ ...formData, Last_Name: e.target.value })}
        required
      />
      
      <select
        value={formData.Gender}
        onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      
      <input
        type="date"
        value={formData.DOB}
        onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
        required
      />
      
      <input
        type="email"
        placeholder="Work Email"
        value={formData.Work_Email}
        onChange={(e) => setFormData({ ...formData, Work_Email: e.target.value })}
        required
      />
      
      <input
        type="tel"
        placeholder="Mobile Phone"
        value={formData.Mobile_Phone}
        onChange={(e) => setFormData({ ...formData, Mobile_Phone: e.target.value })}
        required
      />
      
      <select
        value={formData.Employment_Status}
        onChange={(e) => setFormData({ ...formData, Employment_Status: e.target.value })}
      >
        <option value="Active">Active</option>
        <option value="Probation">Probation</option>
        <option value="Leave">Leave</option>
        <option value="Retired">Retired</option>
      </select>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Employee'}
      </button>
    </form>
  );
}
```

## Step 4: Using Next.js API Routes (Alternative)

If you prefer to use Next.js API routes instead of a separate Express server:

```javascript
// pages/api/employees/index.js (or app/api/employees/route.js for App Router)
import db from '../../../db-connection';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const employees = await db.query('SELECT * FROM EMPLOYEE LIMIT 100');
      res.status(200).json({ success: true, data: employees });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    // Handle POST request
  }
}
```

## Step 5: Environment Variables

Create `.env.local` in you React  project:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Testing

1. Start your backend server: `npm start`
2. Test API endpoints using Postman or curl
3. Update frontend API calls to match your backend URL
4. Test CRUD operations from your frontend

## Common Issues

1. **CORS Errors**: Make sure your Express server has CORS enabled
2. **Connection Refused**: Check that your backend server is running
3. **Database Connection**: Verify your database credentials in `.env`
4. **API URL**: Ensure `NEXT_PUBLIC_API_URL` matches your backend URL

