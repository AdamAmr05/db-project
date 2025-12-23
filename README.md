# HR Management System

A web application built for a database course project. The core focus is the `db/` directory, which contains the MySQL schema, views, stored procedures, functions, and triggers that power the HR management system.

## Features

### AI Chat Assistant (Programmatic Tool Calling)
An AI-powered chat widget that uses **programmatic tool calling** - a cutting-edge pattern introduced by cloudflare and anthropic just recently where the LLM doesn't just call pre-defined functions, but writes custom JavaScript code that executes locally to query and analyze the database.

When you ask a question, the AI:
1. Writes JavaScript code with SQL queries and data transformations
2. The code runs locally with access to a `query()` function
3. Results are formatted and returned as a natural language response

This is more powerful than traditional tool calling because the AI can express complex multi-step logic (combining multiple queries, filtering, sorting, aggregating) in a single code execution rather than making sequential individual API calls.

To try it, add a `GEMINI_API_KEY` to your `.env` file. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).

## Database (`db/`)

- `table-creation-MS2.sql` - Schema definition (20+ tables)
- `data-insertion-MS2.sql` - Sample data
- `views.sql` - Database views (20+ pre-aggregated views)
- `functions.sql` - 15+ stored functions
- `procedures.sql` - 17+ stored procedures
- `triggers.sql` - 6 database triggers

## Environment Variables

Create a `.env` file with:

```
DB_HOST=localhost
DB_USER=root
DB_NAME=hr_management_system
DB_PORT=3306
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
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

## AI Chat Usage

Click the chat bubble in the bottom-right corner and ask questions like:
- "How many employees do we have?"
- "Show me the top 5 performers by appraisal score"
- "Which departments have the best training completion rates?"
- "Compare salaries across job levels"

The AI will write and execute JavaScript code to query the database and return formatted results.
