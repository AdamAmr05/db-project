# AI Chat Feature - Programmatic Tool Calling

> **Approach**: The AI writes JavaScript code that executes locally to query and analyze the HR database

## How It Works

```
User Question → LLM writes JavaScript code → Code executes locally → Results formatted → Response
```

Instead of the AI making individual tool calls, it writes a complete code block that:
1. Runs multiple SQL queries via `query(sql)`
2. Transforms and combines the data
3. Returns the final result

## Example

**User**: "Which department has the best training completion rate?"

**AI-Generated Code**:
```javascript
const training = await query(`
  SELECT d.Department_Name, 
         COUNT(CASE WHEN et.Completion_Status = 'Completed' THEN 1 END) as completed,
         COUNT(*) as total
  FROM EMPLOYEE_TRAINING et
  JOIN EMPLOYEE e ON et.Employee_ID = e.Employee_ID
  JOIN JOB_ASSIGNMENT ja ON e.Employee_ID = ja.Employee_ID
  JOIN JOB j ON ja.Job_ID = j.Job_ID
  JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
  GROUP BY d.Department_Name
`);

const result = training.map(d => ({
  department: d.Department_Name,
  rate: ((d.completed / d.total) * 100).toFixed(1) + '%'
})).sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));

return result;
```

## Files

- `api/chat.js` - Gemini integration with `runCode` tool
- `api/schema-context.js` - Database schema and code examples for AI
- `frontend/src/components/ChatWidget.jsx` - Chat UI component
- `frontend/src/services/chatService.js` - API client

## Security

- Only SELECT queries allowed (validated before execution)
- Code runs in a controlled scope with only `query()` available
- Results capped at 100 rows per query
