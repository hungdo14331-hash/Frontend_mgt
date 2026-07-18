'use client'

import { useState, useEffect } from 'react'
import { fetchTrace, fetchExperts } from '@/lib/api'
import { Loader2, AlertCircle, Users, Zap, AlertTriangle, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchTrace(), fetchExperts()])
      } catch (err) {
        console.log('[v0] Dashboard load started')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 md:px-8 py-6">
        <h1 className="text-3xl font-bold text-foreground">Xin chào, Admin! 👋</h1>
        <p className="text-muted-foreground mt-2">SHB Digital Expert Agents sẵn sàng hỗ trợ nghiệp vụ ngân hàng của bạn.</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* New Request Card */}
            <div className="md:col-span-2 bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📋</span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Tạo yêu cầu mới</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">Nhập câu hỏi của bạn về nghiệp vụ ngân hàng...</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Kiểm tra điều kiện vay</span> • <span className="font-medium">Tư vấn sản phẩm</span> • <span className="font-medium">Tra cứu quy định</span> • <span className="font-medium">Quy trình xử lý hồ sơ</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white gap-2">
                <span>Gửi yêu cầu</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Request Process Timeline */}
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Quy trình xử lý</h3>
              <div className="space-y-3">
                {[
                  { num: '01', title: 'Nhận yêu cầu', time: '10:30:15' },
                  { num: '02', title: 'Phân tích & Phân rã', time: '10:30:16' },
                  { num: '03', title: 'Giao cho chuyên gia', time: '10:30:17' },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0',
                      idx < 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    )}>
                      {step.num}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-sm font-medium text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center gap-1">
                Xem chi tiết <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Expert Agents Section */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Đội ngũ chuyên gia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Credit Expert', desc: 'Thẩm định tín dụng', icon: '💳', status: 'ready' },
                { name: 'Legal & Compliance Expert', desc: 'Tuân thủ & Pháp lý', icon: '⚖️', status: 'ready' },
                { name: 'Product Expert', desc: 'Sản phẩm & Tư vấn', icon: '📦', status: 'ready' },
                { name: 'Operations Expert', desc: 'Vận hành & Quy trình', icon: '⚙️', status: 'ready' },
              ].map((expert, idx) => (
                <div key={idx} className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow text-center">
                  <div className="text-3xl mb-3">{expert.icon}</div>
                  <h3 className="font-bold text-foreground text-sm">{expert.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{expert.desc}</p>
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600 font-medium">Sẵn sàng</span>
                  </div>
                </div>
              ))}
            </div>
            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Hoạt động gần đây</h2>
            <div className="bg-white border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-center py-8">Chưa có hoạt động nào được ghi nhận</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
