'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { fetchChat } from '@/lib/api'
import { parseChatResponse } from '@/lib/parse-chat-response'
import { Send, Loader2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  elapsed_seconds?: number
  caseMemory?: string | null
  experts?: Array<{ name: string; color: string }>
  toolCalls?: Array<{ expert: string; tool: string; args: string; result: string }>
  warnings?: string[]
  mainContent?: string
  settingsUsed?: { use_rag: boolean; use_risk_check: boolean }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set())
  const [useRag, setUseRag] = useState(true)
  const [useRiskCheck, setUseRiskCheck] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetchChat({
        message: input,
        context: messages
          .filter((m) => m.role === 'assistant')
          .map((m) => m.content)
          .join('\n\n'),
        use_rag: useRag,
        use_risk_check: useRiskCheck,
      })

      const parsed = parseChatResponse(response.response)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        elapsed_seconds: response.elapsed_seconds,
        caseMemory: parsed.caseMemory,
        experts: parsed.experts,
        toolCalls: parsed.toolCalls,
        warnings: parsed.warnings,
        mainContent: parsed.mainContent,
        settingsUsed: response.settings_used,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header - Desktop only */}
      <div className="hidden md:block border-b border-border px-6 py-4 bg-gradient-to-r from-blue-50 to-white">
        <h1 className="text-2xl font-bold text-foreground">Tạo yêu cầu mới</h1>
        <p className="text-muted-foreground text-sm mt-1">Hỏi đội ngũ chuyên gia số của SHB về nghiệp vụ ngân hàng</p>
      </div>

      {/* Settings toggles */}
      <div className="border-b border-border px-3 md:px-6 py-2.5 bg-card/50 flex flex-wrap items-center gap-4 flex-shrink-0">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={useRag}
            onClick={() => setUseRag((v) => !v)}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
              useRag ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                useRag ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-xs font-medium text-foreground">Tra cứu quy định (RAG)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={useRiskCheck}
            onClick={() => setUseRiskCheck((v) => !v)}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
              useRiskCheck ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                useRiskCheck ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-xs font-medium text-foreground">Cảnh báo rủi ro</span>
        </label>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-md">
              <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">Bắt đầu một yêu cầu</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4">Nhập các câu hỏi của bạn về:</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Kiểm tra điều kiện vay</p>
                <p>• Tư vấn sản phẩm ngân hàng</p>
                <p>• Tra cứu quy định và chính sách</p>
                <p>• Hỗ trợ quy trình xử lý hồ sơ</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} px-1`}
              >
                {message.role === 'user' ? (
                  <div className="max-w-xs md:max-w-lg px-4 py-3 rounded-lg bg-primary text-primary-foreground break-words">
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <div className="w-full md:max-w-2xl space-y-3 bg-card border border-border rounded-lg p-3 md:p-4">
                    {/* Case Memory */}
                    {message.caseMemory && (
                      <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full inline-block">
                        <span className="text-xs font-medium text-blue-300">
                          🧠 {message.caseMemory}
                        </span>
                      </div>
                    )}

                    {/* Experts Called */}
                    {message.experts && message.experts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.experts.map((expert, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${expert.color}`}
                          >
                            {expert.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Main Content */}
                    {message.mainContent && (
                      <div className="prose prose-invert max-w-none text-sm">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="text-foreground leading-relaxed mb-2">{children}</p>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-base font-bold text-foreground mt-3 mb-2">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-sm font-bold text-foreground mt-2 mb-1">{children}</h2>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside text-foreground mb-2 space-y-0.5">
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => (
                              <li className="text-foreground text-sm">{children}</li>
                            ),
                            code: ({ children }) => (
                              <code className="bg-black/40 px-1 py-0.5 rounded text-xs text-blue-300">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {message.mainContent}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Tool Calls */}
                    {message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="border-t border-border pt-3 mt-3">
                        <button
                          onClick={() => {
                            const id = message.id
                            setExpandedTools((prev) =>
                              prev.has(id) ? new Set([...prev].filter((x) => x !== id)) : new Set([...prev, id])
                            )
                          }}
                          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {expandedTools.has(message.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          Xem chi tiết tool đã gọi
                        </button>

                        {expandedTools.has(message.id) && (
                          <div className="mt-3 space-y-2">
                            {message.toolCalls.map((call, idx) => (
                              <div
                                key={idx}
                                className="p-2 bg-black/30 rounded text-xs space-y-1"
                              >
                                <div className="text-gray-300">
                                  <span className="font-medium text-blue-300">{call.expert}</span>
                                  {' gọi '}
                                  <code className="bg-black/60 px-1 py-0.5 rounded text-green-300">
                                    {call.tool}({call.args})
                                  </code>
                                </div>
                                <div className="text-gray-400">→ {call.result}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Warnings */}
                    {message.warnings && message.warnings.length > 0 && (
                      <div className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-500/10 rounded">
                        <p className="text-xs font-bold text-orange-300 mb-1">⚠️ CẢNH BÁO RỦI RO:</p>
                        <ul className="space-y-1">
                          {message.warnings.map((warning, idx) => (
                            <li key={idx} className="text-xs text-orange-200">
                              • {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Elapsed Time + Settings Used */}
                    <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-x-3 gap-y-1">
                      {message.elapsed_seconds && <span>⏱ {message.elapsed_seconds.toFixed(1)}s</span>}
                      {message.settingsUsed && (
                        <span className="opacity-75">
                          {message.settingsUsed.use_rag ? 'RAG: bật' : 'RAG: tắt'} ·{' '}
                          {message.settingsUsed.use_risk_check ? 'Cảnh báo: bật' : 'Cảnh báo: tắt'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-3 md:mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border px-3 md:px-6 py-3 md:py-4 bg-white flex-shrink-0">
        <div className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn về nghiệp vụ ngân hàng..."
            disabled={isLoading}
            className="flex-1 px-3 md:px-4 py-2.5 rounded-lg bg-gray-50 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm md:text-base transition-colors"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="gap-2 flex-shrink-0 bg-primary hover:bg-primary/90"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Gửi</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
