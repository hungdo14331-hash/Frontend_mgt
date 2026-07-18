'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, BookOpen, BarChart3, Users, Wrench, Settings, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNavItems = [
  {
    name: 'Tổng quan',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Tạo yêu cầu',
    href: '/chat',
    icon: FileText,
  },
  {
    name: 'Kho tri thức',
    href: '/knowledge-base',
    icon: BookOpen,
  },
  {
    name: 'Phân tích',
    href: '/compare',
    icon: BarChart3,
  },
]

const managementItems = [
  {
    name: 'Chuyên gia (Agents)',
    href: '/agents',
    icon: Users,
  },
  {
    name: 'Công cụ (Tools)',
    href: '/tools',
    icon: Wrench,
  },
  {
    name: 'Cài đặt hệ thống',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleNavClick = () => {
    if (onClose) {
      onClose()
    }
  }

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col overflow-y-auto',
      'md:relative md:block',
      !isOpen && 'hidden md:flex'
    )}>
      {/* SHB Logo/Header */}
      <div className="p-4 border-b border-sidebar-border sticky top-0 bg-sidebar z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
            SHB
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-sidebar-foreground leading-tight">SHB</p>
            <p className="text-xs text-sidebar-foreground/70">Digital Expert Agents</p>
          </div>
        </div>
        <p className="text-xs text-sidebar-foreground/60 mt-2">Hội đồng chuyên gia số cho Nghiệp vụ Ngân hàng</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const active = isActiveLink(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium',
                  active
                    ? 'bg-blue-50 text-primary border-l-2 border-primary pl-3'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/30'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Management Section */}
        <div className="pt-6 mt-6 border-t border-sidebar-border">
          <p className="text-xs font-bold text-sidebar-foreground/60 px-4 py-2 uppercase tracking-wider">QUẢN LÝ</p>
          <div className="space-y-1">
            {managementItems.map((item) => {
              const Icon = item.icon
              const active = isActiveLink(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium',
                    active
                      ? 'bg-blue-50 text-primary border-l-2 border-primary pl-3'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/30'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* AI-Powered Section */}
        <div className="pt-6 mt-6 border-t border-sidebar-border">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-sidebar-foreground">AI-POWERED</p>
                <p className="text-sm font-bold text-sidebar-foreground mt-1">Banking Operations Reimagined</p>
                <p className="text-xs text-sidebar-foreground/70 mt-2">Multi-Agent AI System for SHB Digital Transformation</p>
              </div>
            </div>
            <a href="#" className="inline-flex text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Learn more →
            </a>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border sticky bottom-0 bg-sidebar">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-sidebar-accent/30 transition-colors text-sm font-medium text-sidebar-foreground">
          <span>‹ Thu gọn</span>
        </button>
      </div>
    </aside>
  )
}
