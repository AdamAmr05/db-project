# Connecting HRMS Database to Frontend 

## Overview
. The architecture uses a **backend API layer** that sits between your frontend and database.

## Architecture

```
Frontend (React) 
    ↓ HTTP Requests
Backend API (Node.js/Express or Next.js API Routes)
    ↓ SQL Queries
MySQL Database (hr_management_system)
```

## Step 1: Choose Your Backend Approach

### Option B: Separate Express.js Server
Create a standalone Express.js server that your frontend calls.

## Step 2: Database Connection Setup

### Environment Variables
Create a `.env` file in your project root:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=hr_management_system
DB_PORT=3306
```

### For Production/Cloud:
```env
DB_HOST=your-cloud-host.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=hr_management_system
DB_PORT=3306
```

## Step 3: Install Dependencies

```bash
npm install mysql2 dotenv
# or for TypeScript
npm install mysql2 dotenv @types/node
```

## Step 4: Database Connection Module

Create a database connection pool (see `db-connection.js` example).

## Step 5: API Endpoints

Create REST API endpoints for CRUD operations. See examples in:
- `api/employees.js` - Employee CRUD
- `api/faculties.js` - Faculty CRUD
- `api/jobs.js` - Job CRUD
- `api/dashboard.js` - Dashboard metrics using your functions

## Step 6: Frontend Integration

In your React frontend, use `fetch()` or `axios` to call your API:

```javascript
// Example: Fetch all employees
const response = await fetch('/api/employees');
const employees = await response.json();
```

## Step 7: Using Your Stored Procedures

Your database has stored procedures that can be called directly:

```javascript
// Example: Call GetEmployeeFullProfile procedure
const [rows] = await db.execute('CALL GetEmployeeFullProfile(?)', [employeeId]);
```

## Step 8: Using Your Views

Your views can be queried like regular tables:

```javascript
// Example: Get employee count by department
const [rows] = await db.execute('SELECT * FROM View_Employee_Count_By_Dept');
```

## Step 9: Using Your Functions

Your database functions can be called in SELECT statements:

```javascript
// Example: Get total employees
const [rows] = await db.execute('SELECT getTotalEmployees() AS total');
```

## Security Considerations

1. **Never expose database credentials** in frontend code
2. **Use environment variables** for all sensitive data
3. **Validate and sanitize** all user inputs
4. **Use parameterized queries** (prepared statements) to prevent SQL injection
5. **Implement authentication/authorization** for API endpoints
6. **Use HTTPS** in production

## Deployment

### For React:
- Deploy your backend API (Next.js API routes or Express server)
- Update frontend API calls to point to your deployed backend URL
- Set environment variables in your hosting platform

### Common Hosting Options:
- **Vercel** (for Next.js)
- **Railway** (for Express.js)
- **Render** (for Express.js)
- **AWS/Google Cloud/Azure** (for production)

## Testing Your Connection

1. Test database connection
2. Test API endpoints (use Postman or curl)
3. Test frontend integration
4. Verify CRUD operations work end-to-end

## Next Steps

1. Review the example API files provided
2. Customize endpoints based on your frontend needs
3. Add error handling and validation
4. Implement authentication if needed
5. Add pagination for large datasets
6. Add filtering and search functionality

