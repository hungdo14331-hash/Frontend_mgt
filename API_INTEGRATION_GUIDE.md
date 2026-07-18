# API Integration Guide

## Overview

The Magic Team AI application integrates with 4 backend endpoints to provide intelligent analysis and comparison features. All endpoints use the base URL: `https://magic-team-vaic2026-api.onrender.com`

## API Endpoints

### 1. POST /api/chat

**Purpose:** Get AI-powered responses with metadata about expert consultation and tool usage.

**Request:**
```json
{
  "message": "Your question here",
  "context": "Previous conversation context (optional)"
}
```

**Response:**
```json
{
  "response": "Markdown response with special sections",
  "elapsed_seconds": 12.4
}
```

**Response Format Parsing:**

The response contains special markers that are parsed and displayed separately:

- **🧠 Case Memory:** Shows as a blue badge/pill
- **🔍 Đã hỏi ý kiến: X, Y** → Expert badges with colors:
  - `credit` = Blue
  - `legal` = Purple  
  - `product` = Orange
  - `operations` = Green
- **🔧 Tool calls:** Grouped in collapsible section (closed by default)
- **⚠️ CẢNH BÁO RỦI RO:** Warning message in red/orange highlight
- Remaining text rendered as markdown

**Display:** Elapsed time shown as "⏱ 12.4s" at bottom of message bubble

---

### 2. POST /api/compare

**Purpose:** Compare Single-Agent vs Multi-Agent approaches for a query.

**Request:**
```json
{
  "message": "Your comparison question"
}
```

**Response:**
```json
{
  "single_agent": {
    "response": "Markdown analysis",
    "elapsed_seconds": 5.2,
    "features": ["feature1", "feature2"]
  },
  "multi_agent": {
    "response": "Markdown analysis",
    "elapsed_seconds": 3.8,
    "features": ["feature3", "feature4"]
  }
}
```

**Display:** 
- Two-column layout side-by-side
- Left column: "Single-Agent (Baseline)" with grey feature chips
- Right column: "Multi-Agent" with colored feature chips
- Each shows response (rendered as markdown), elapsed_seconds, and features

---

### 3. GET /api/experts

**Purpose:** Get list of available experts for display.

**Response:**
```json
{
  "experts": [
    { "id": "credit", "name": "Credit Analyst" },
    { "id": "legal", "name": "Legal Expert" },
    { "id": "product", "name": "Product Manager" },
    { "id": "operations", "name": "Operations Lead" }
  ]
}
```

**Use:** Display expert information throughout the application. Names are used to color-code expert badges and references.

---

### 4. GET /api/trace

**Purpose:** Get comprehensive trace/execution data from the last request.

**Response:**
```json
{
  "user_input": "The original user query",
  "experts_called": ["credit", "legal"],
  "experts_called_display": ["Credit Analyst", "Legal Expert"],
  "task_plan": {
    "credit": "Analyze credit risk factors",
    "legal": "Review legal compliance"
  },
  "tool_calls": [
    {
      "expert": "credit",
      "tool": "analyze_risk",
      "args": {"param": "value"},
      "result": "Result data",
      "from_cache": false
    }
  ],
  "synthesis_used": true,
  "risk_flagged": true,
  "memory_state": {
    "customer_id": "C123",
    "facts": ["Fact 1", "Fact 2"],
    "cached_tools": {},
    "experts_consulted": ["credit", "legal"],
    "history_length": 5
  },
  "timings": {
    "routing_sec": 0.5,
    "experts_sec": 2.3,
    "synthesis_sec": 0.8,
    "total_sec": 3.6
  },
  "has_data": true
}
```

**Dashboard Display:**

If `has_data == false`:
- Show empty state: "Chưa có yêu cầu nào được xử lý"

If `has_data == true`:
- **Metric Cards (3 cols):**
  - Số Expert được gọi → `experts_called.length`
  - Số lượt gọi Tool → `tool_calls.length`
  - Cảnh báo rủi ro → `risk_flagged` (✓/✗)

- **Collaboration Flow:** Visual diagram showing:
  - Planner → Experts → Synthesis (if used) → Results

- **Experts Called:** Display expert names from `experts_called_display`

- **Task Decomposition:** Show `task_plan` items

- **Case Memory State:** Display `memory_state` details

- **Tool Calls Table:** List with columns: Expert, Tool, Args, Cached

- **Timing Breakdown:** Stacked bar chart showing routing/experts/synthesis times

---

## Client Implementation

### API Service (`lib/api.ts`)

```typescript
export async function fetchChat(request: ChatRequest): Promise<ChatResponse>
export async function fetchCompare(request: CompareRequest): Promise<CompareResponse>
export async function fetchExperts(): Promise<ExpertsResponse>
export async function fetchTrace(): Promise<TraceResponse>
```

All functions handle errors and use `API_URL` from `lib/api-config.ts` (fallback: `https://magic-team-vaic2026-api.onrender.com`)

### Markdown Parsing (`lib/parse-chat-response.ts`)

Utility function that parses chat response and extracts:
- `caseMemory`: String from 🧠 line
- `experts`: Array of expert names with colors
- `toolCalls`: Array of tool invocations
- `warnings`: Array of warning messages
- `mainContent`: Rest of markdown

---

## Page Implementation

### /chat
- Real-time messaging interface
- Parses special markdown sections
- Shows expert badges with colors
- Collapsible tool calls section
- Displays elapsed time per message

### /compare
- Single text input for comparison question
- Calls POST /api/compare
- Displays results in two columns
- Shows execution time and features for each approach
- Supports markdown rendering in responses

### /dashboard
- Calls GET /api/trace to get execution data
- Shows 3 metric cards
- Displays collaboration flow diagram
- Shows task decomposition and memory state
- Table of tool calls with caching info
- Timing breakdown with recharts visualization

---

## Dependencies

- `react-markdown`: For rendering markdown in responses
- `recharts`: For timeline and bar chart visualizations
- `lucide-react`: For icons throughout the UI

All pages are client-side rendered for dynamic API integration.
