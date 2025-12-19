# HRMS Database to Frontend Connection

This project provides a complete backend API to connect your MySQL HRMS database to a frontend web application.

## 📁 Project Structure

```
db-project-sql/
├── db/                          # Database SQL files
│   ├── table-creation-MS2.sql   # Database schema
│   ├── data-insertion-MS2.sql   # Sample data
│   ├── views.sql                # Database views
│   ├── functions.sql            # Database functions
│   ├── procedures.sql           # Stored procedures
│   └── triggers.sql             # Database triggers
├── api/                         # API endpoint handlers
│   ├── employees.js             # Employee CRUD operations
│   ├── faculties.js             # Faculty CRUD operations
│   └── dashboard.js             # Dashboard metrics
├── db-connection.js             # MySQL connection pool
├── server.js                    # Express.js server
├── package.json                 # Dependencies
├── CONNECTION_GUIDE.md          # Detailed connection guide
└── FRONTEND_INTEGRATION.md      # Frontend integration examples
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hr_management_system
DB_PORT=3306
PORT=3001
```

### 3. Set Up Database

Run your SQL files to create the database:

```bash
mysql -u root -p < db/table-creation-MS2.sql
mysql -u root -p < db/functions.sql
mysql -u root -p < db/procedures.sql
mysql -u root -p < db/triggers.sql
mysql -u root -p < db/views.sql
mysql -u root -p < db/data-insertion-MS2.sql
```

### 4. Test Database Connection

```bash
npm test
```

### 5. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The API will be available at `http://localhost:3001/api`

## 📡 API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID (uses stored procedure)
- `GET /api/employees/:id/stats` - Get employee statistics
- `POST /api/employees` - Create employee (uses stored procedure)
- `PUT /api/employees/:id` - Update employee
- `PUT /api/employees/:id/contact` - Update contact info (uses stored procedure)
- `DELETE /api/employees/:id` - Delete employee

### Faculties
- `GET /api/faculties` - Get all faculties
- `GET /api/faculties/:id` - Get faculty by ID
- `POST /api/faculties` - Create faculty
- `PUT /api/faculties/:id` - Update faculty
- `DELETE /api/faculties/:id` - Delete faculty

### Dashboard
- `GET /api/dashboard/stats` - Get all dashboard stats (uses database functions)
- `GET /api/dashboard/employee-count-by-dept` - Employee count by department (uses view)
- `GET /api/dashboard/gender-distribution` - Gender distribution (uses view)
- `GET /api/dashboard/status-distribution` - Status distribution (uses view)
- `GET /api/dashboard/jobs-by-level` - Jobs by level (uses view)
- `GET /api/dashboard/salary-stats` - Salary statistics (uses view)
- `GET /api/dashboard/training-completion` - Training completion stats (uses view)
- `GET /api/dashboard/appraisals-per-cycle` - Appraisals per cycle (uses view)

## 🔌 Frontend Integration

See `FRONTEND_INTEGRATION.md` for detailed examples of:
- Creating API service functions
- Using the API in React components
- Handling forms and CRUD operations
- Displaying dashboard data

## 🎯 Key Features

✅ **Uses Your Stored Procedures**: API calls your database procedures like `GetEmployeeFullProfile`, `AddNewEmployee`, etc.

✅ **Uses Your Views**: Dashboard endpoints query your views like `View_Employee_Count_By_Dept`, `View_Gender_Distribution`, etc.

✅ **Uses Your Functions**: Dashboard stats use your functions like `getTotalEmployees()`, `getActiveEmployees()`, etc.

✅ **SQL Injection Protection**: All queries use parameterized statements

✅ **Error Handling**: Comprehensive error handling and validation

✅ **CORS Enabled**: Ready for frontend integration

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Implement authentication/authorization for production
- Use HTTPS in production
- Validate and sanitize all user inputs

## 📚 Documentation

- `CONNECTION_GUIDE.md` - Detailed architecture and setup guide
- `FRONTEND_INTEGRATION.md` - Frontend integration examples and patterns

## 🛠️ Development

### Using Next.js API Routes Instead

If you prefer Next.js API routes over Express, you can:
1. Copy the API handler functions to `pages/api/` or `app/api/`
2. Use the same `db-connection.js` module
3. Adapt the route handlers to Next.js format

### Adding More Endpoints

To add more endpoints:
1. Create a new file in `api/` directory
2. Export handler functions
3. Import and add routes in `server.js`

## 🐛 Troubleshooting

**Database Connection Failed**
- Check your `.env` file has correct credentials
- Verify MySQL is running
- Test connection: `mysql -u root -p`

**CORS Errors**
- Ensure CORS is enabled in `server.js`
- Check frontend API URL matches backend URL

**API Returns 404**
- Verify server is running on correct port
- Check endpoint URL matches route definition

## 📝 Next Steps

1. ✅ Set up database connection
2. ✅ Create API endpoints
3. ✅ Integrate with frontend
4. ⬜ Add authentication/authorization
5. ⬜ Deploy to production

## 📄 License

ISC

