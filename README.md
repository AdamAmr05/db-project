# HR Management System

A web application built for a database course project. The core focus is the `db/` directory, which contains the MySQL schema, views, stored procedures, functions, and triggers that power the HR management system.

## Database (`db/`)

- `table-creation-MS2.sql` - Schema definition
- `data-insertion-MS2.sql` - Sample data
- `views.sql` - Database views
- `functions.sql` - Database functions
- `procedures.sql` - Stored procedures
- `triggers.sql` - Database triggers

## Environment Variables

Create a `.env` file with:

```
DB_HOST=localhost
DB_USER=root
DB_NAME=hr_management_system
DB_PORT=3306
PORT=3001
```

## Running the Database

Execute the SQL files in order:

```bash
mysql -u root -p < db/table-creation-MS2.sql
mysql -u root -p < db/functions.sql
mysql -u root -p < db/procedures.sql
mysql -u root -p < db/triggers.sql
mysql -u root -p < db/views.sql
mysql -u root -p < db/data-insertion-MS2.sql
```

## Running the Web App

```bash
# Install dependencies
npm install

# Start the backend server
npm run dev

# In a separate terminal, start the frontend
cd frontend
npm install
npm run dev
```

The API runs on `http://localhost:3001/api` and the frontend on `http://localhost:5173`.
