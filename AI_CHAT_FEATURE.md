# AI Chat Feature - Implementation Plan

> **Feature**: Natural language chatbot that can query and analyze the HR database
> **Approach**: Programmatic tool calling - AI writes SQL queries based on user questions

---

## Overview

This feature adds an AI-powered chat interface that allows users to ask natural language questions about the HR database. Instead of navigating through multiple pages, users can simply ask:
- "How many employees are in the Computer Science department?"
- "Show me all employees with completed training"
- "What's the average appraisal score this cycle?"

The AI will:
1. Understand the user's intent
2. Generate appropriate SQL queries
3. Execute them against the database
4. Return formatted, human-readable results

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ChatWidget.jsx (floating button + chat panel)          │    │
│  │  - Message input                                         │    │
│  │  - Chat history                                          │    │
│  │  - Result tables/cards                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │ POST /api/chat
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  api/chat.js                                             │    │
│  │  - Receives user message                                 │    │
│  │  - Calls Gemini API with schema context + tools          │    │
│  │  - Tool: executeQuery(sql) → runs SQL via db-connection  │    │
│  │  - Returns AI response + query results                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MySQL Database                               │
│  20+ tables, 20+ views, stored procedures                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components to Build

### 1. Compact Schema Reference (`api/schema-context.js`)
A minimal representation of the database schema (~300 tokens) that gives the AI enough context to write correct queries.

### 2. Chat API Endpoint (`api/chat.js`)
Core logic:
1. Receive user message
2. Build prompt with schema context
3. Call Gemini with function calling enabled
4. If Gemini wants to call executeQuery(), run the SQL
5. Return results to Gemini for formatting
6. Send formatted response to frontend

**Tools provided to the AI:**
- `executeQuery(sql: string)` - Runs a SELECT query and returns results
- `describeTable(tableName: string)` - Returns column details for a specific table

**Safety:**
- Only SELECT queries allowed (regex validation)
- Query timeout limit
- Results capped at 100 rows

### 3. Chat Widget (`frontend/src/components/ChatWidget.jsx`)
Floating chat button (bottom-right corner) that expands to a chat panel:
- Dark cyber theme matching existing UI
- Message history with user/AI distinction
- Loading states while AI thinks
- Formatted tables for query results

### 4. Chat Service (`frontend/src/services/chatService.js`)
Simple API wrapper for frontend-backend communication.

---

## Implementation Phases

### Phase 1: Backend Setup
1. Install `@google/generative-ai` package
2. Create `api/schema-context.js` with compact schema
3. Create `api/chat.js` with Gemini integration
4. Add route to `server.js`
5. Test with curl/Postman

### Phase 2: Frontend Chat Widget
1. Create `ChatWidget.jsx` component
2. Create `chatService.js` API client
3. Add widget to main layout
4. Style with dark cyber theme

### Phase 3: Polish & Safety
1. Add query validation (SELECT only)
2. Add error handling and user-friendly messages
3. Add loading states
4. Test edge cases

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `api/schema-context.js` | NEW | Compact schema for AI context |
| `api/chat.js` | NEW | Chat endpoint with Gemini integration |
| `server.js` | MODIFY | Add chat route |
| `package.json` | MODIFY | Add @google/generative-ai dependency |
| `frontend/src/components/ChatWidget.jsx` | NEW | Floating chat component |
| `frontend/src/services/chatService.js` | NEW | API client for chat |
| `frontend/src/components/Layout.jsx` | MODIFY | Mount ChatWidget |

---

## Notes

- This runs entirely locally, no external sandbox needed
- Gemini API has generous free tier
- The AI can only READ data, never modify it
- Conversation history maintained per session for context
