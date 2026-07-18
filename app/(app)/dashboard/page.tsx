'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchTrace, type TraceResponse } from '@/lib/api'
import { useChatState } from '@/lib/chat-state-context'
import { EXPERT_SOLID_COLORS } from '@/lib/parse-chat-response'
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  Users,
  Wrench,
  ShieldAlert,
  Clock,
  CreditCard,
  Scale,
  Package,
  Workflow,
  Bot,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const EXPERT_ICONS: Record<string, typeof CreditCard> = {
  credit: CreditCard,
  legal: Scale,
  product: Package,
  operations: Workflow,
}

const EXPERT_DESCRIPTIONS: Record<string, string> = {
  credit: 'Thẩm định tín dụng',
  legal: 'Tuân thủ & Pháp lý',
  product: 'Sản phẩm & Tư vấn',
  operations: 'Vận hành & Quy trình',
}

const STATIC_EXPERTS = [
  { id: 'credit', name: 'Credit Expert' },
  { id: 'legal', name: 'Legal & Compliance Expert' },
  { id: 'product', name: 'Product Expert' },
  { id: 'operations', name: 'Operations Expert' },
]

function summarizeToolResult(result: unknown): string {
  if (result && typeof result === 'object' && 'error' in (result as Record<string, unknown>)) {
    return `Lỗi: ${(result as Record<string, unknown>).error}`
  }
  const text = typeof result === 'string' ? result : JSON.stringify(result)
  return text.length > 160 ? text.slice(0, 157) + '...' : text
}

export default function DashboardPage() {
  const { traceHistory } = useChatState()
  const [trace, setTrace] = useState<TraceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTrace()
  }, [])

  const loadTrace = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchTrace()
      setTrace(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu trace'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 md:px-8 py-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-foreground">Xin chào, Admin! 👋</h1>
        <p className="text-muted-foreground mt-2">
          SHB Digital Expert Agents sẵn sàng hỗ trợ nghiệp vụ ngân hàng của bạn.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* New Request Card */}
            <div className="md:col-span-2 bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📋</span>
                </div>
                <h2 className="text-lg font-bold text-foreground">Tạo yêu cầu mới</h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Nhập câu hỏi của bạn về nghiệp vụ ngân hàng...
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium">Kiểm tra điều kiện vay</span> •{' '}
                <span className="font-medium">Tư vấn sản phẩm</span> •{' '}
                <span className="font-medium">Tra cứu quy định</span> •{' '}
                <span className="font-medium">Quy trình xử lý hồ sơ</span>
              </div>
              <Link href="/chat">
                <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white gap-2 flex items-center justify-center py-2.5 rounded-lg font-medium transition-colors">
                  <span>Gửi yêu cầu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Quick stats from last real run */}
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Lần xử lý gần nhất</h3>

              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}

              {error && !isLoading && (
                <div className="text-xs text-red-600 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {!isLoading && !error && trace && !trace.has_data && (
                <p className="text-sm text-muted-foreground">
                  Chưa có yêu cầu nào được xử lý. Hãy đặt câu hỏi ở trang Tạo yêu cầu trước.
                </p>
              )}

              {!isLoading && !error && trace && trace.has_data && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      {trace.experts_called.length} chuyên gia được gọi
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wrench className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      {trace.tool_calls.length} lượt gọi công cụ
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldAlert
                      className={cn(
                        'w-4 h-4 flex-shrink-0',
                        trace.risk_flagged ? 'text-red-500' : 'text-gray-400'
                      )}
                    />
                    <span className="text-sm text-foreground">
                      {trace.risk_flagged ? 'Có cảnh báo rủi ro' : 'Không có cảnh báo'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      {trace.timings.total_sec.toFixed(1)}s tổng thời gian
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expert Agents Section - static intro cards, real status comes from /agents page */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Đội ngũ chuyên gia</h2>
              <Link
                href="/agents"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STATIC_EXPERTS.map((expert) => {
                const Icon = EXPERT_ICONS[expert.id] || Bot
                return (
                  <div
                    key={expert.id}
                    className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow text-center"
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3',
                        EXPERT_SOLID_COLORS[expert.id] || 'bg-gray-400'
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{expert.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {EXPERT_DESCRIPTIONS[expert.id]}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-green-600 font-medium">Sẵn sàng</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Agent Trace Section - REAL data from last /api/chat or /api/compare run */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Agent Trace — Hoạt động gần đây</h2>
              {trace?.has_data && (
                <button
                  onClick={loadTrace}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Làm mới
                </button>
              )}
            </div>

            <div className="bg-white border border-border rounded-lg p-6">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {error && !isLoading && (
                <div className="flex items-start gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">{error}</p>
                    <button onClick={loadTrace} className="text-xs underline mt-1">
                      Thử lại
                    </button>
                  </div>
                </div>
              )}

              {!isLoading && !error && (!trace || !trace.has_data) && (
                <p className="text-muted-foreground text-center py-8">
                  Chưa có hoạt động nào được ghi nhận. Đặt câu hỏi ở trang Tạo yêu cầu để xem trace
                  tại đây.
                </p>
              )}

              {!isLoading && !error && trace && trace.has_data && (
                <div className="space-y-6">
                  {/* User input */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Yêu cầu
                    </p>
                    <p className="text-sm text-foreground">{trace.user_input}</p>
                  </div>

                  {/* Collaboration Flow */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Collaboration Flow
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Planner (Fast Routing)
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {trace.experts_called.map((expertId, idx) => (
                        <span key={expertId} className="flex items-center gap-2">
                          <span
                            className={cn(
                              'px-3 py-1.5 rounded-full text-xs font-medium text-white',
                              EXPERT_SOLID_COLORS[expertId] || 'bg-gray-400'
                            )}
                          >
                            {trace.experts_called_display[idx] || expertId}
                          </span>
                          {idx < trace.experts_called.length - 1 && (
                            <span className="text-gray-400 text-xs">+</span>
                          )}
                        </span>
                      ))}
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {trace.synthesis_used ? 'Synthesis Agent' : 'Kết quả cuối (bỏ qua Synthesis)'}
                      </span>
                    </div>
                  </div>

                  {/* Task Decomposition */}
                  {Object.keys(trace.task_plan).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Task Decomposition
                      </p>
                      <div className="space-y-2">
                        {Object.entries(trace.task_plan).map(([expertId, task]) => (
                          <div
                            key={expertId}
                            className={cn(
                              'pl-3 py-1.5 border-l-4 text-sm',
                              `border-l-[color:var(--tw-border-opacity)]`
                            )}
                            style={{
                              borderLeftColor:
                                expertId === 'credit'
                                  ? '#3b82f6'
                                  : expertId === 'legal'
                                    ? '#a855f7'
                                    : expertId === 'product'
                                      ? '#f97316'
                                      : '#22c55e',
                            }}
                          >
                            <span className="font-medium text-foreground">
                              {trace.experts_called_display[trace.experts_called.indexOf(expertId)] ||
                                expertId}
                              :{' '}
                            </span>
                            <span className="text-muted-foreground">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Case Memory */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Case Memory
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Hồ sơ đang xử lý</p>
                        <p className="text-sm font-semibold text-foreground">
                          {trace.memory_state.customer_id || '—'}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Dữ liệu đã cache</p>
                        <p className="text-sm font-semibold text-foreground">
                          {trace.memory_state.cached_tools}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Lượt trao đổi</p>
                        <p className="text-sm font-semibold text-foreground">
                          {trace.memory_state.history_length}
                        </p>
                      </div>
                    </div>
                    {(trace.memory_state.facts.loan_amount || trace.memory_state.facts.income_monthly) && (
                      <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                        {trace.memory_state.facts.loan_amount && (
                          <p>
                            Số tiền vay: {trace.memory_state.facts.loan_amount.toLocaleString('vi-VN')} VNĐ
                          </p>
                        )}
                        {trace.memory_state.facts.income_monthly && (
                          <p>
                            Thu nhập: {trace.memory_state.facts.income_monthly.toLocaleString('vi-VN')}{' '}
                            VNĐ/tháng
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tool Calls */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Task Status — Tool Calls
                    </p>
                    {trace.tool_calls.length > 0 ? (
                      <div className="space-y-1.5">
                        {trace.tool_calls.map((call, idx) => (
                          <div key={idx} className="text-xs bg-muted/40 rounded p-2">
                            <span className="font-medium text-foreground">{call.expert}</span>
                            {' gọi '}
                            <code className="bg-black/10 px-1 py-0.5 rounded">{call.tool}</code>
                            {call.from_cache && (
                              <span className="ml-1 text-muted-foreground">[cache]</span>
                            )}
                            <span className="text-muted-foreground"> → {summarizeToolResult(call.result)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Không có tool nào được gọi cho yêu cầu này.
                      </p>
                    )}
                  </div>

                  {/* Timing Breakdown */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Timing Breakdown
                    </p>
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100">
                      {trace.timings.total_sec > 0 && (
                        <>
                          <div
                            className="bg-blue-400 h-full"
                            style={{
                              width: `${(trace.timings.routing_sec / trace.timings.total_sec) * 100}%`,
                            }}
                          />
                          <div
                            className="bg-orange-400 h-full"
                            style={{
                              width: `${(trace.timings.experts_sec / trace.timings.total_sec) * 100}%`,
                            }}
                          />
                          <div
                            className="bg-purple-400 h-full"
                            style={{
                              width: `${(trace.timings.synthesis_sec / trace.timings.total_sec) * 100}%`,
                            }}
                          />
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span>
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />
                        Routing: {trace.timings.routing_sec}s
                      </span>
                      <span>
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-1" />
                        Experts: {trace.timings.experts_sec}s
                      </span>
                      <span>
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1" />
                        Synthesis: {trace.timings.synthesis_sec}s
                      </span>
                      <span className="font-semibold text-foreground">
                        Tổng: {trace.timings.total_sec}s
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lịch sử xử lý gần đây - vấn đề 3: hiện nhiều lần thay vì chỉ 1 lần
              gần nhất. Dữ liệu lấy từ traceHistory trong Context, được ghi lại
              phía Frontend mỗi khi trang Chat nhận response mới - vì backend
              (LAST_RUN_LOG) chỉ giữ đúng 1 dict, không phải danh sách. */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Lịch sử xử lý gần đây ({traceHistory.length})
            </h2>
            <div className="bg-white border border-border rounded-lg p-4 md:p-6">
              {traceHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 text-sm">
                  Chưa có lịch sử nào được ghi lại trong phiên này. Lịch sử chỉ lưu tối đa 10 lần
                  gần nhất và chỉ trong trình duyệt hiện tại.
                </p>
              ) : (
                <div className="space-y-2">
                  {traceHistory.map((entry, idx) => (
                    <div
                      key={`${entry.recorded_at}-${idx}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border"
                    >
                      <span className="text-xs text-muted-foreground font-mono flex-shrink-0 w-16 pt-0.5">
                        {new Date(entry.recorded_at).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{entry.user_input}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {entry.experts_called_display.map((name) => (
                            <span
                              key={name}
                              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                            >
                              {name}
                            </span>
                          ))}
                          {entry.risk_flagged && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" /> Rủi ro
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                            {entry.timings.total_sec}s
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
