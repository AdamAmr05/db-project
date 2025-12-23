# AI Chat Feature - Programmatic Tool Calling

## What Is This?

An AI-powered chat widget that uses **programmatic tool calling** - a cutting-edge pattern where the LLM doesn't just call pre-defined functions, but **writes custom JavaScript code** that executes locally to query and analyze the database.

When you ask a question, the AI writes code that:
- Runs multiple SQL queries via `query(sql)`
- Transforms and combines data using JavaScript (.map, .filter, .sort)
- Performs calculations and aggregations
- Returns the final result for display

This is more powerful than traditional tool calling because the AI can express complex multi-step logic in code rather than making sequential individual tool calls.

---

## How It Works

```
User Question
     ↓
LLM writes JavaScript code
     ↓
Code executes locally with query() access
     ↓
Results returned to LLM
     ↓
Formatted response to user
```

**Example - "Show employees with the most training":**

The AI writes:
```javascript
const employees = await query("SELECT * FROM EMPLOYEE");
const training = await query("SELECT * FROM EMPLOYEE_TRAINING WHERE Completion_Status = 'Completed'");

const counts = {};
training.forEach(t => counts[t.Employee_ID] = (counts[t.Employee_ID] || 0) + 1);

const result = employees
  .filter(e => counts[e.Employee_ID])
  .map(e => ({ Name: e.First_Name + ' ' + e.Last_Name, Completed: counts[e.Employee_ID] }))
  .sort((a, b) => b.Completed - a.Completed)
  .slice(0, 5);

return result;
```

---

## Files

| File | Purpose |
|------|---------|
| `api/chat.js` | Gemini integration with `runCode` tool |
| `api/schema-context.js` | Database schema + code examples for AI |
| `frontend/src/components/ChatWidget.jsx` | Chat UI component |

## Security

- Only SELECT queries allowed (validated before execution)
- Code runs in a controlled scope with only `query()` available
- Results capped at 100 rows per query
