# SHB Digital Expert Agents

## Executive Summary

SHB Digital Expert Agents là hệ thống AI được hỗ trợ bởi Multi-Agent AI dành cho các hoạt động ngân hàng của SHB. Platform này kết hợp 4 chuyên gia AI chuyên biệt (Credit, Legal, Product, Operations) để cung cấp tư vấn tổng hợp và phân tích cho các vấn đề kinh doanh phức tạp.

## Key Features

### 1. Dashboard (Tổng quan)
- Welcome greeting cho user
- Quick access để tạo yêu cầu mới
- Request processing timeline visualization
- Expert team showcase
- Activity tracking

### 2. Request Management (Tạo yêu cầu)
- Conversational interface với AI experts
- Real-time response từ multi-agent system
- Case memory tracking
- Tool call transparency
- Risk flagging system
- Performance metrics display

### 3. Analysis & Recommendations (Phân tích & Gợi ý)
- Side-by-side comparison (Single-Agent vs Multi-Agent)
- Expert recommendation synthesis
- Feature highlighting
- Performance timing breakdown

### 4. Knowledge Base
- Centralized banking knowledge repository
- Quick access to banking regulations
- Product information
- Process guidelines

### 5. Analytics
- System performance metrics
- Request patterns analysis
- Expert utilization tracking
- Response time analytics

### 6. Management Section
- **Agents**: Manage AI expert configurations
- **Tools**: Manage available tools for agents
- **Users**: User access control
- **Settings**: System configuration

## Expert Team

### 1. Credit Expert (Chuyên gia Tín dụng)
**Expertise**: Thẩm định tín dụng
- Loan eligibility assessment
- Credit risk evaluation
- Collateral valuation
- Lending policy compliance

### 2. Legal & Compliance Expert (Chuyên gia Pháp lý)
**Expertise**: Tuân thủ & Pháp lý
- Regulatory compliance
- Legal documentation
- Risk mitigation
- Compliance verification

### 3. Product Expert (Chuyên gia Sản phẩm)
**Expertise**: Sản phẩm & Tư vấn
- Product recommendations
- Feature matching
- Cross-selling opportunities
- Product optimization

### 4. Operations Expert (Chuyên gia Vận hành)
**Expertise**: Vận hành & Quy trình
- Process optimization
- Operational efficiency
- Workflow management
- Performance metrics

## Technical Architecture

### Frontend
```
- Next.js 16 (App Router)
- React 19.2 with Server Components
- TypeScript 5.7
- Tailwind CSS v4
- Shadcn UI Components
- Framer Motion (animations)
- Recharts (visualizations)
```

### Backend
```
- Backend URL: https://magic-team-vaic2026-api.onrender.com
- API Endpoints:
  - POST /api/chat - Send chat request
  - POST /api/compare - Comparison analysis
  - GET /api/experts - Get expert list
  - GET /api/trace - Get execution trace
```

### Styling
- Light mode by default (professional banking aesthetic)
- SHB brand colors (Blue primary, Orange secondary)
- Responsive design (mobile, tablet, desktop)
- Accessibility compliant

## Color System

### Primary Palette
- **Primary Blue**: `oklch(0.5 0.22 254)` - Main CTA, nav active
- **Secondary Orange**: `oklch(1 0.25 20)` - Accents, special actions
- **Background White**: `oklch(0.99 0 0)` - Professional clean look
- **Text Dark**: `oklch(0.15 0 0)` - High contrast readability

### Semantic Colors
- **Success Green**: Process completion
- **Warning Orange**: Attention needed
- **Error Red**: Critical issues
- **Info Blue**: Informational messages

## Navigation Structure

```
SHB Digital Expert Agents
├── Tổng quan (Dashboard)
├── Tạo yêu cầu (Chat)
├── Kho tri thức (Knowledge Base)
├── Phân tích (Analytics/Compare)
│
└── QUẢN LÝ
    ├── Chuyên gia (Agents)
    ├── Công cụ (Tools)
    ├── Người dùng (Users)
    └── Cài đặt hệ thống (Settings)
```

## User Workflows

### Primary Workflow: Request Handling
```
1. User creates request on Dashboard
   ↓
2. Navigates to "Tạo yêu cầu"
   ↓
3. Enters question/problem
   ↓
4. System routes to relevant experts
   ↓
5. Experts analyze and provide recommendations
   ↓
6. Results displayed with:
   - Main analysis
   - Expert consensus
   - Risk flags
   - Process timeline
   - Tool calls used
   - Performance metrics
```

### Secondary Workflow: Comparative Analysis
```
1. User goes to "Phân tích & Gợi ý"
   ↓
2. Describes problem/scenario
   ↓
3. System runs both:
   - Single-Agent analysis (baseline)
   - Multi-Agent analysis (advanced)
   ↓
4. Side-by-side comparison shows:
   - Different approaches
   - Recommendation variations
   - Timing differences
   - Feature highlights
```

## Deployment

### Prerequisites
```bash
Node.js 18+
pnpm (or npm/yarn)
Environment variables configured
Backend API URL set
```

### Installation
```bash
# Clone repository
git clone [repo-url]

# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Build project
pnpm build

# Run development server
pnpm dev

# Production build
pnpm build && pnpm start
```

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://magic-team-vaic2026-api.onrender.com
```

## Performance Optimizations

- Server-side rendering for better SEO
- React Compiler support enabled
- Efficient state management with hooks
- Optimized images and assets
- Code splitting with dynamic imports
- Caching strategies for API responses

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Focus management
- Screen reader support

## Future Roadmap

### Phase 1 (Current)
- Core dashboard and navigation
- Chat/Request interface
- Compare/Analysis interface
- Expert team showcase

### Phase 2
- Knowledge Base implementation
- Analytics dashboard
- Advanced search functionality
- Report generation

### Phase 3
- Admin management panels
- User role-based access control
- Audit logging
- System analytics

### Phase 4
- Mobile app
- Dark mode support
- Multi-language support (EN, VI, etc.)
- Advanced customization options

## Support & Contact

For technical support or questions:
- Documentation: See project docs folder
- Technical Issues: Check GitHub issues
- Feature Requests: Submit via feature request form

## License

[Add appropriate license]

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-19  
**Status**: Production Ready
