# SHB Digital Expert Agents - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Clone & Install
```bash
# Clone the project
git clone [repository-url]
cd shb-digital-expert-agents

# Install dependencies
pnpm install
# or: npm install
# or: yarn install
```

### Step 2: Configure Environment
```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_API_URL=https://magic-team-vaic2026-api.onrender.com
```

### Step 3: Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Start Building
- Navigate to Dashboard
- Create a request
- Compare analysis options
- Explore expert recommendations

## 📚 Main Features Overview

### Dashboard (Tổng quan)
**Access**: Click "Tổng quan" in sidebar or go to `/dashboard`

What you can do:
- View system status
- See expert availability
- Access quick links to main features
- Check recent activity

### Create Request (Tạo yêu cầu)
**Access**: `/chat` or click "Tạo yêu cầu"

How to use:
1. Enter your question about banking operations
2. Examples provided in empty state
3. AI experts will process and respond
4. View full analysis with expert inputs

### Analysis & Recommendations (Phân tích & Gợi ý)
**Access**: `/compare` or click "Phân tích"

How to use:
1. Describe the scenario or problem
2. Click "Gửi yêu cầu phân tích"
3. Compare single-agent vs multi-agent responses
4. Review recommendations side-by-side

### Knowledge Base (Kho tri thức)
**Access**: `/knowledge-base` or click "Kho tri thức"

Coming soon:
- Banking regulations reference
- Product documentation
- Process guidelines
- Best practices

### Analytics (Phân tích)
**Access**: `/analytics` (under "Phân tích" - Analytics section)

Coming soon:
- Performance metrics
- Usage patterns
- Expert utilization
- Trend analysis

## 🔧 Management Section (QUẢN LÝ)

### Agents (Chuyên gia)
**Access**: `/agents` or click "Chuyên gia (Agents)"

Manage:
- Credit Expert configuration
- Legal & Compliance Expert setup
- Product Expert settings
- Operations Expert configuration

### Tools (Công cụ)
**Access**: `/tools` or click "Công cụ (Tools)"

Manage:
- Available tools for agents
- Tool configurations
- Tool availability status
- Usage permissions

### Users (Người dùng)
**Access**: `/users` or click "Người dùng"

Manage:
- User accounts
- Access permissions
- User roles
- Activity tracking

### Settings (Cài đặt hệ thống)
**Access**: `/settings` or click "Cài đặt hệ thống"

Configure:
- System preferences
- API settings
- Notification preferences
- System defaults

## 🎨 Customization

### Changing Colors
Edit `/app/globals.css`:
```css
.light {
  --primary: oklch(0.5 0.22 254); /* Change blue */
  --secondary: oklch(1 0.25 20);  /* Change orange */
  /* ... other colors ... */
}
```

### Modifying Sidebar
Edit `/components/sidebar.tsx`:
- Change navigation items
- Update branding section
- Modify colors and spacing
- Add new menu sections

### Updating Content
Edit individual page files:
- `/app/(app)/dashboard/page.tsx`
- `/app/(app)/chat/page.tsx`
- `/app/(app)/compare/page.tsx`
- Other route files

## 📱 Responsive Design

The application is fully responsive:

**Desktop (1280px+)**
- Full sidebar always visible
- Multi-column layouts
- Complete feature set

**Tablet (768px - 1279px)**
- Collapsible sidebar
- 2-column layouts
- Touch-friendly buttons

**Mobile (<768px)**
- Sidebar as drawer/modal
- Single column layout
- Touch optimized

## 🔐 API Integration

### Available Endpoints
```
POST /api/chat
- Send request to AI experts
- Body: { message, context }
- Returns: Full analysis with expert input

POST /api/compare
- Compare single vs multi-agent
- Body: { message }
- Returns: Comparison with metrics

GET /api/experts
- List all available experts
- Returns: Array of expert definitions

GET /api/trace
- Get execution trace/logs
- Returns: Full execution details
```

### Making API Calls
```typescript
// Example request
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Your question here',
    context: 'Previous context if any'
  })
});

const data = await response.json();
```

## 🛠️ Development Commands

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format
```

## 📂 Project Structure

```
shb-digital-expert-agents/
├── app/
│   ├── (app)/
│   │   ├── dashboard/page.tsx
│   │   ├── chat/page.tsx
│   │   ├── compare/page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── sidebar.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   └── ...
│   └── ...
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── parse-chat-response.ts
├── public/
├── package.json
└── tsconfig.json
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### API Connection Issues
- Check environment variables are set
- Verify API URL is accessible
- Check browser console for errors
- Confirm CORS is enabled on backend

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
pnpm install
pnpm build
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📖 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Shadcn UI**: https://ui.shadcn.com

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section
2. Review documentation files
3. Check GitHub issues
4. Submit feature requests

## 📝 Key Files to Know

### Core Application Files
- `app/layout.tsx` - Root layout & metadata
- `app/globals.css` - Global styles & theme
- `components/sidebar.tsx` - Main navigation
- `lib/api.ts` - API integration layer

### Page Files
- `app/(app)/dashboard/page.tsx` - Dashboard
- `app/(app)/chat/page.tsx` - Chat/Request
- `app/(app)/compare/page.tsx` - Analysis

### Important Config Files
- `package.json` - Dependencies & scripts
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template

## 🎯 Next Steps

1. **Familiarize Yourself**
   - Explore all pages
   - Try creating requests
   - Review expert responses

2. **Customize**
   - Update branding colors
   - Add your content
   - Modify navigation

3. **Deploy**
   - Build for production
   - Deploy to Vercel (recommended)
   - Configure CI/CD

4. **Extend**
   - Add new pages
   - Integrate additional APIs
   - Implement new features

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-19  
**Status**: Ready to Use
