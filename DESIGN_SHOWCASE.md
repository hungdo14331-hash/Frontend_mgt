# SHB Digital Expert Agents - Design Showcase

## Design Philosophy

### Before → After Comparison

| Aspect | Before (Magic Team AI) | After (SHB Digital Expert Agents) |
|--------|------------------------|------------------------------------|
| **Branding** | Generic "Magic Team" | Professional "SHB Digital Expert Agents" |
| **Color Scheme** | Dark theme with purple | Light theme with blue/orange |
| **Navigation** | Basic 3-item menu | Expanded with 8+ items + management section |
| **Sidebar** | Simple navigation | Rich branding + AI-powered section |
| **Tone** | Casual/Tech | Professional/Banking |
| **Typography** | Standard | Refined with hierarchy |
| **Icons** | Generic | Sector-specific (banking) |

## Component Showcase

### 1. Sidebar Navigation

**Key Features:**
- SHB Logo & Branding
- Main Navigation (4 items)
- Management Section (4 items)
- AI-Powered Callout Box
- Sticky positioning
- Active state highlighting

**Design Elements:**
```
┌─────────────────────┐
│ SHB Logo            │  ← SHB Branding
├─────────────────────┤
│ Tổng quan           │  ← Active (blue background)
│ Tạo yêu cầu         │  ← Icons + text
│ Kho tri thức        │
│ Phân tích           │
├─────────────────────┤
│ QUẢN LÝ (header)    │  ← Section divider
│ Chuyên gia          │
│ Công cụ             │
│ Người dùng          │
│ Cài đặt             │
├─────────────────────┤
│ AI-POWERED Box      │  ← Gradient background
│ Banking Operations  │
│ Reimagined          │
│ Learn more →        │
└─────────────────────┘
```

### 2. Dashboard Page

**Layout Structure:**
```
┌──────────────────────────────────────────────┐
│ Xin chào, Admin! 👋                          │  ← Welcome header
│ SHB Digital Expert Agents sẵn sàng...       │
└──────────────────────────────────────────────┘

┌─────────────────────────────┬────────────────┐
│ Tạo yêu cầu mới             │ Quy trình xử lý│
│ [Orange CTA Button]         │ ① Nhận yêu cầu │
└─────────────────────────────┴────────────────┘

┌──────────────────────────────────────────────┐
│ Đội ngũ chuyên gia                           │
│ [Expert 1] [Expert 2] [Expert 3] [Expert 4] │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Hoạt động gần đây                            │
│ (Chưa có hoạt động)                          │
└──────────────────────────────────────────────┘
```

**Key Features:**
- Clean white background
- Clear information hierarchy
- Expert showcase with status
- Process visualization
- Quick action buttons
- Empty states for future content

### 3. Chat Page (Tạo yêu cầu)

**Features:**
- Dedicated header for request creation
- Empty state with helpful prompts
- Vietnamese instructions
- Clean input interface
- Primary blue CTA button
- Visual emoji for context

**Use Cases Shown:**
```
• Kiểm tra điều kiện vay
• Tư vấn sản phẩm ngân hàng
• Tra cứu quy định và chính sách
• Hỗ trợ quy trình xử lý hồ sơ
```

### 4. Compare Page (Phân tích & Gợi ý)

**Features:**
- Descriptive header
- Large textarea for detailed input
- White card container
- Prominent primary button
- Professional typography
- Clear placeholder text

**Comparison View:**
```
┌─────────────────┬─────────────────┐
│ Single-Agent    │ Multi-Agent      │
├─────────────────┼─────────────────┤
│ Response 1      │ Response 2       │
│ Time: X.Xs      │ Time: Y.Ys       │
│ Features        │ Features         │
└─────────────────┴─────────────────┘
```

## Color Palette

### Primary Colors
```
Blue (Primary)
Color: oklch(0.5 0.22 254)
Usage: Navigation active, CTAs, primary elements
Accessible for readability on white backgrounds

Orange (Secondary)
Color: oklch(1 0.25 20)
Usage: Special actions, highlights, emphasis
Matches SHB brand identity

White (Background)
Color: oklch(0.99 0 0)
Usage: Clean professional background
High contrast with text

Dark Text (Foreground)
Color: oklch(0.15 0 0)
Usage: Primary text, maximum readability
WCAG AAA compliant contrast
```

### Semantic Colors
```
Success: Green
- oklch(0.65 0.2 142)
- Used for: Availability status, success messages

Warning: Orange
- oklch(1 0.25 20)
- Used for: Attention needed, alerts

Error: Red
- oklch(0.6 0.25 20)
- Used for: Error states, critical issues

Info: Blue
- oklch(0.5 0.22 254)
- Used for: Information messages, timestamps
```

## Typography Scale

```
Display:    28-32px  (Dashboard titles)
Heading 1:  24px     (Page headers)
Heading 2:  20px     (Section titles)
Heading 3:  16px     (Card titles)
Body:       14-16px  (Standard text)
Small:      12px     (Labels, hints)
Tiny:       11px     (Timestamps, badges)
```

## Layout Grid

**Desktop (1280px+):**
- Sidebar: 256px fixed
- Content area: Remaining width
- Grid columns: 12 (flexible)
- Gutter: 16px

**Tablet (768px - 1279px):**
- Sidebar: Collapse/expand toggle
- Content area: Full width when sidebar closed
- Grid columns: 8
- Gutter: 12px

**Mobile (<768px):**
- Sidebar: Modal/drawer
- Content area: Full width
- Grid columns: 4
- Gutter: 8px

## Component Spacing

```
Extra Small: 4px   (Icon spacing, tight layout)
Small:       8px   (Padding in buttons
Medium:      16px  (Standard padding, gaps)
Large:       24px  (Section spacing)
Extra Large: 32px  (Major section separation)
```

## Interactive Elements

### Buttons
```
Primary Button:
- Background: Blue
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Hover: Darker blue
- Active: Even darker

Secondary Button:
- Background: Gray (light)
- Text: Blue
- Padding: 12px 24px
- Border: 1px gray
- Hover: Lighter gray background
```

### Navigation Links
```
Active State:
- Background: Light blue (oklch(0.95 0.08 254))
- Text: Blue
- Left border: 2px blue
- Reduced padding on left

Hover State:
- Background: Very light blue
- Smooth transition
- Slight elevation
```

### Input Fields
```
Default:
- Background: Light gray
- Border: 1px light gray
- Padding: 12px 16px
- Border radius: 8px

Focus:
- Ring: 2px blue
- Border: Blue
- Outline: None

Disabled:
- Background: Very light gray
- Text: Muted gray
- Opacity: 50%
```

## Animation & Transitions

```
Fade In/Out:     200ms ease-out
Hover Effects:   150ms ease-in-out
Sidebar Toggle:  300ms ease-in-out
Loading Spinner: Linear infinite 1s
Smooth Scroll:   Behavior: smooth
```

## Responsive Breakpoints

```
Mobile:  <768px
Tablet:  768px - 1024px
Desktop: 1024px - 1440px
Wide:    >1440px
```

## Accessibility Considerations

✓ WCAG AAA color contrast (Blue text on white)
✓ Semantic HTML structure
✓ ARIA labels for interactive elements
✓ Keyboard navigation support
✓ Focus indicators visible
✓ Screen reader optimization
✓ Alt text for all images/icons
✓ Reduced motion support

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Design System Extensions

### Future Components
```
- Card Component
- Modal/Dialog
- Toast Notifications
- Dropdown Menu
- Switch Toggle
- Radio Buttons
- Checkboxes
- Progress Bar
- Tabs
- Stepper
```

### Future Features
- Dark mode variant
- High contrast mode
- Reduced motion mode
- Customizable sidebar
- Theme switching
- Layout presets
- Advanced animations

---

**Design Version**: 1.0.0  
**Last Updated**: 2026-07-19  
**Framework**: Tailwind CSS v4 + Shadcn UI
