# HR Management System

A web application built for a database course project. The core focus is the `db/` directory, which contains the MySQL schema, views, stored procedures, functions, and triggers that power the HR management system.
![Full-main-dashboard](https://github.com/user-attachments/assets/01f24ba7-4a29-49b9-add3-48d728f6dcfb)


## Features

### AI Chat Assistant (Programmatic Tool Calling)
An AI-powered chat assistant accessible via a floating button or dedicated chat page. It uses **programmatic tool calling** - a cutting-edge pattern where the LLM doesn't just call pre-defined functions, but writes custom JavaScript code that executes locally to query and analyze the database.

When you ask a question, the AI:
1. Writes JavaScript code with SQL queries and data transformations
2. The code runs locally with access to a `query()` function (read-only SELECT queries)
3. Results are formatted and returned as natural language responses with interactive tables and charts rendered inline

The assistant maintains synchronized state across the floating chat widget and full chat page, so conversations persist seamlessly. The assistant knows everything and can find anything in the system, employees, jobs, departments, training, performance cycles, appraisals, and appeals, so responses are fast and directly relevant.
It renders interactive tables for structured data and charts (bar, line, pie, area and more) for trends and distributions, all rendered inline and streamed in real time as the AI processes the query, so insights appear instantly alongside clear explanations.
![Chat-insight-charts](https://github.com/user-attachments/assets/37f38fe1-171e-4c30-90eb-eca7f4d44582)


Beyond analysis, when you request changes (create/update/delete records), the AI proposes editable approval forms pre-filled with inferred values. You review and confirm; nothing is applied automatically.
![AI-Action](https://github.com/user-attachments/assets/1e81fd44-ebbc-4f75-ad1b-d4d2233446c1)


This is more powerful than traditional tool calling because the AI can express complex multi-step logic (combining multiple queries, filtering, sorting, aggregating) in a single code execution rather than making sequential individual API calls, though when needed because this isnt a small task and inherently requires many steps, it .

<img width="3012" height="1896" alt="image" src="https://github.com/user-attachments/assets/0ebd0efe-9ee0-4d8e-aa8c-d79ea8fb6cbf" />
(chat window is resizable)

To try it, add a `GOOGLE_GENERATIVE_AI_API_KEY` to your `.env` file. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).

### Power BI Analytics Dashboard
A dedicated "Analytics" page that embeds a live, interactive Power BI dashboard directly inside the web app. This would allow users to explore HR metrics, performance trends, and workforce data or whatever they have in the Power BI dashboard through Power BI's rich visualizations without leaving the application. The embed uses Microsoft's embedded demo mode.
<img width="3012" height="1896" alt="image" src="https://github.com/user-attachments/assets/d48cf1f1-b4c6-43b3-be89-8402f6959a7a" />


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
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
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
<img width="3024" height="1900" alt="image" src="https://github.com/user-attachments/assets/50847ff1-a442-4b5c-a400-640bee16b3e0" />


The API runs on `http://localhost:3001/api` and the frontend on `http://localhost:5173`.

## AI Chat Usage

Access the AI assistant via the floating chat button in the bottom-right corner or navigate to the dedicated Chat page. The conversation state is synchronized across both interfaces.

Ask questions in plain language:
- "How many employees do we have?"
- "Compare salary ranges across all departments and show me the job level distribution"
- "Show me performance trends over the last few cycles"
- "Which departments have the best training completion rates?"
- "Help me add an employee called Adam Amr, male, born in 2005"

The AI writes and executes JavaScript code to query the database, returning formatted results with interactive tables and charts rendered inline. For data modifications, it proposes approval forms that require your confirmation before any changes are applied.
