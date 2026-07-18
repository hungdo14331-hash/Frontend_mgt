'use client'

import { useState, useEffect } from 'react'
import { fetchExperts, type Expert } from '@/lib/api'
import { EXPERT_SOLID_COLORS } from '@/lib/parse-chat-response'
import { Loader2, AlertCircle, CreditCard, Scale, Package, Workflow, Bot } from 'lucide-react'

const EXPERT_ICONS: Record<string, typeof CreditCard> = {
  credit: CreditCard,
  legal: Scale,
  product: Package,
  operations: Workflow,
}

const EXPERT_DESCRIPTIONS: Record<string, string> = {
  credit: 'Thẩm định tín dụng, tính DTI, tra cứu điểm CIC và hồ sơ khách hàng.',
  legal: 'Kiểm tra tuân thủ KYC/AML và các quy định pháp lý ngân hàng hiện hành.',
  product: 'Tư vấn sản phẩm vay, tiết kiệm, thẻ và các gói ưu đãi phù hợp.',
  operations: 'Hướng dẫn quy trình phê duyệt, SLA xử lý hồ sơ và tạo phiếu trình.',
}

export default function AgentsPage() {
  const [experts, setExperts] = useState<Expert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadExperts()
  }, [])

  const loadExperts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchExperts()
      setExperts(data.experts)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách chuyên gia'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border px-4 md:px-6 py-4 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Chuyên gia (Agents)</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Đội ngũ 4 chuyên gia AI chuyên biệt, phối hợp xử lý mỗi yêu cầu nghiệp vụ
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {isLoading && (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {error && !isLoading && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 max-w-2xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={loadExperts} className="text-xs text-red-700 underline mt-1">
                Thử lại
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {experts.map((expert) => {
              const Icon = EXPERT_ICONS[expert.id] || Bot
              return (
                <div
                  key={expert.id}
                  className="bg-card border border-border rounded-lg p-5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        EXPERT_SOLID_COLORS[expert.id] || 'bg-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{expert.display_name}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Sẵn sàng
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {EXPERT_DESCRIPTIONS[expert.id] || 'Chuyên gia AI hỗ trợ nghiệp vụ ngân hàng.'}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
