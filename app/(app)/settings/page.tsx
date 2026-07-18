'use client'

import { useState, useEffect } from 'react'
import { fetchSystemInfo, type SystemInfoResponse } from '@/lib/api'
import { Loader2, AlertCircle, Info, Cpu, Users, Tag } from 'lucide-react'

export default function SettingsPage() {
  const [info, setInfo] = useState<SystemInfoResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSystemInfo()
  }, [])

  const loadSystemInfo = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchSystemInfo()
      setInfo(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải thông tin hệ thống'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border px-4 md:px-6 py-4 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Thông tin cấu hình hiện tại — chỉ xem, không chỉnh sửa tại đây
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
              <button onClick={loadSystemInfo} className="text-xs text-red-700 underline mt-1">
                Thử lại
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && info && (
          <div className="max-w-2xl space-y-4">
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              <div className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Model AI đang sử dụng</p>
                  <p className="text-sm font-semibold text-foreground font-mono">{info.model_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Số lượng chuyên gia</p>
                  <p className="text-sm font-semibold text-foreground">
                    {info.experts_count} chuyên gia: {info.experts.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phiên bản API</p>
                  <p className="text-sm font-semibold text-foreground font-mono">{info.api_version}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Cấu hình mặc định</p>
              <div className="flex gap-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    info.default_settings.use_rag
                      ? 'bg-green-500/10 text-green-700 border-green-500/30'
                      : 'bg-gray-500/10 text-gray-600 border-gray-500/30'
                  }`}
                >
                  Tra cứu quy định (RAG): {info.default_settings.use_rag ? 'Bật' : 'Tắt'}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    info.default_settings.use_risk_check
                      ? 'bg-green-500/10 text-green-700 border-green-500/30'
                      : 'bg-gray-500/10 text-gray-600 border-gray-500/30'
                  }`}
                >
                  Cảnh báo rủi ro: {info.default_settings.use_risk_check ? 'Bật' : 'Tắt'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">{info.note}</p>
            </div>

            <p className="text-xs text-muted-foreground">
              Muốn bật/tắt RAG hoặc cảnh báo rủi ro cho một yêu cầu cụ thể? Vào trang{' '}
              <span className="font-medium text-foreground">Tạo yêu cầu</span> hoặc{' '}
              <span className="font-medium text-foreground">Phân tích</span> — mỗi công tắc chỉ áp
              dụng cho lần gửi đó, không thay đổi cấu hình chung của hệ thống.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
