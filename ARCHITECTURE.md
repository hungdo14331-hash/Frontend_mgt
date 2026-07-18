# Magic Team AI - Application Architecture

## Application Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser / Client (Dark Mode)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Root Layout (app/layout.tsx)                │   │
│  │         Dark mode enabled, Theme: OKLCH                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                      │
│                    ┌───────┴────────┐                            │
│                    │                │                            │
│  ┌─────────────────▼─┐    ┌────────┴────────────────────────┐   │
│  │  Sidebar (Fixed)  │    │   App Layout (Main Content)     │   │
│  ├─────────────────┤    ├──────────────────────────────────┤   │
│  │ Logo/Header     │    │  Router (Outlet)                 │   │
│  │                 │    │   ├─ /chat → Chat Page           │   │
│  │ Navigation:     │    │   ├─ /compare → Compare Page     │   │
│  │ • Chat          │◄───┤   └─ /dashboard → Dashboard      │   │
│  │ • Compare       │    │                                   │   │
│  │ • Dashboard     │    │  Each page includes:              │   │
│  │                 │    │  • Header with title             │   │
│  │ Version: v1.0.0 │    │  • Main content area             │   │
│  └─────────────────┘    │  • Loading/error states          │   │
│                         │  • API integration                │   │
│                         └────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
        ┌──────────────────────┐ ┌──────────────────────┐
        │  Service Layer       │ │  Utilities           │
        │  (lib/api.ts)        │ │  (lib/utils.ts)      │
        ├──────────────────────┤ ├──────────────────────┤
        │ fetchChat()          │ │ cn() - class name    │
        │ fetchCompare()       │ │ merging              │
        │ fetchDashboard()     │ │                      │
        │ fetchTrace()         │ └──────────────────────┘
        └──────────────────────┘
                    │
                    │ (API URLs from lib/api-config.ts)
                    │ Base: https://magic-team-vaic2026-api.onrender.com
                    │
                    ▼
        ┌──────────────────────────────────────────┐
        │   Backend API (Render.com)               │
        ├──────────────────────────────────────────┤
        │ POST /api/chat                           │
        │   → { message, context }                 │
        │   ← { response, trace_id }               │
        │                                          │
        │ POST /api/compare                        │
        │   → { items[], criteria }                │
        │   ← { comparison, analysis }             │
        │                                          │
        │ GET /api/experts                         │
        │   → { trace_id } (query param)           │
        │   ← { experts[], stats }                 │
        │                                          │
        │ GET /api/trace                           │
        │   → { trace_id } (query param)           │
        │   ← { trace_id, status, data }           │
        └──────────────────────────────────────────┘
```

## Component Hierarchy

```
RootLayout
├── html.dark
└── body
    ├── Page (/ → redirects to /chat)
    └── AppLayout
        ├── Sidebar
        │   ├── Logo/Header
        │   ├── Navigation
        │   │   ├── Link: Chat
        │   │   ├── Link: Compare
        │   │   └── Link: Dashboard
        │   └── Footer (version)
        └── main
            ├── ChatPage (client component)
            │   ├── Header
            │   ├── Messages Container
            │   └── Form (input + send button)
            │
            ├── ComparePage (client component)
            │   ├── Header
            │   ├── Items Input
            │   ├── Criteria Input
            │   ├── Compare Button
            │   └── Results (table + analysis)
            │
            └── DashboardPage (client component)
                ├── Header
                ├── Stats Cards
                │   ├── Total Chats
                │   ├── Total Comparisons
                │   └── Active Experts
                └── Experts List
                    └── Expert Cards (with status)
```

## Data Flow

### Chat Feature
```
User Input
    │
    ├─→ ChatPage component (client state)
    │
    ├─→ fetchChat(message, context)
    │
    ├─→ HTTP POST /api/chat
    │
    ├─→ Backend AI processing
    │
    └─→ Response displayed in message thread
        (with timestamp)
```

### Compare Feature
```
Items + Criteria
    │
    ├─→ ComparePage component (manages items array)
    │
    ├─→ fetchCompare(items[], criteria)
    │
    ├─→ HTTP POST /api/compare
    │
    ├─→ Backend comparison engine
    │
    └─→ Table results + analysis displayed
```

### Dashboard
```
Page Load
    │
    ├─→ DashboardPage useEffect()
    │
    ├─→ fetchDashboard() + fetchTrace()
    │
    ├─→ HTTP GET /api/experts
    ├─→ HTTP GET /api/trace
    │
    ├─→ Backend queries
    │
    └─→ Stats cards + experts list rendered
```

## Styling System

### Theme Colors (Dark Mode)
```
Background      → oklch(0.08 0 0)     [Very dark gray]
Foreground      → oklch(0.95 0 0)     [Near white]
Card            → oklch(0.12 0 0)     [Dark card]
Primary         → oklch(0.65 0.2 259) [Blue-purple]
Accent          → oklch(0.65 0.2 259) [Same as primary]
Muted           → oklch(0.25 0 0)     [Medium gray]
Border          → oklch(1 0 0 / 8%)   [Subtle borders]
```

### Component Patterns
- **Sidebar**: Fixed position, dark background, accent on active
- **Cards**: Dark background with subtle border
- **Buttons**: Primary color background with hover state
- **Forms**: Card background input fields with focus ring
- **Messages**: User (primary bg), Assistant (card bg)
- **Status**: Green (online), Yellow (busy), Gray (offline)

## Environment Configuration

### Development
```env
NEXT_PUBLIC_API_URL=https://magic-team-vaic2026-api.onrender.com
```

### Production (Vercel)
Set in Vercel dashboard environment variables:
```
NEXT_PUBLIC_API_URL=https://magic-team-vaic2026-api.onrender.com
```

The app automatically falls back to the default URL if the env var is not set.

## Build & Deployment

### Development
```bash
pnpm dev  # Runs on http://localhost:3000
```

### Production Build
```bash
pnpm build  # Optimizes with Turbopack
pnpm start  # Serves production build
```

### Deployment to Vercel
1. Connect GitHub repository
2. Set environment variables
3. Deploy via git push or Vercel CLI

## Performance Considerations

- **Code Splitting**: Each page is lazy-loaded
- **Static Pre-rendering**: All routes are pre-rendered
- **Caching**: API responses can be cached client-side with SWR (future enhancement)
- **Bundle Size**: Tree-shaking removes unused code
- **Dark Mode**: No layout shift on load (declared in html tag)

## Security

- **Environment Variables**: API URL exposed as NEXT_PUBLIC_ (safe for client)
- **Input Validation**: Form inputs validated before API calls
- **Error Handling**: All API errors caught and logged
- **No Auth**: Currently public (add authentication in backend if needed)

## Future Enhancements

1. **Authentication**: Add user sessions/login
2. **Data Persistence**: Cache results with localStorage or database
3. **Export**: Add ability to export comparisons/chat logs
4. **Real-time Updates**: WebSocket integration for live updates
5. **Advanced Analytics**: Charts and graphs for statistics
6. **Accessibility**: WCAG 2.1 AA compliance audit
