'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { fetchCompare } from '@/lib/api'
import { useChatState } from '@/lib/chat-state-context'
import { Loader2, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ComparisonResult {
  single_agent: {
    response: string
    elapsed_seconds: number
    features: string[]
  }
  multi_agent: {
    response: string
    elapsed_seconds: number
    features: string[]
  }
}

export default function ComparePage() {
  const { useRag, setUseRag, useRiskCheck, setUseRiskCheck } = useChatState()
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async () => {
    if (!question.trim()) {
      setError('Vui lòng nhập câu hỏi để so sánh')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const response = await fetchCompare({
        message: question,
        use_rag: useRag,
        use_risk_check: useRiskCheck,
      })

      setResult(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to compare items'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="hidden md:block border-b border-border px-6 py-4 bg-gradient-to-r from-blue-50 to-white">
        <h1 className="text-2xl font-bold text-foreground">Phân tích & Gợi ý</h1>
        <p className="text-muted-foreground text-sm mt-1">So sánh và phân tích các phương án từ chuyên gia</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6">
        <div className="max-w-5xl mx-auto">
          {/* Question Input */}
          <div className="mb-6 bg-white border border-border rounded-lg p-4 md:p-6">
            <label className="block text-sm font-medium text-foreground mb-3">Vấn đề cần tư vấn</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base transition-colors resize-none"
            />

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={useRag}
                  onClick={() => setUseRag(!useRag)}
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
                  onClick={() => setUseRiskCheck(!useRiskCheck)}
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Compare Button */}
          <Button
            onClick={handleCompare}
            disabled={isLoading || !question.trim()}
            className="w-full gap-2 mb-8 bg-primary hover:bg-primary/90 text-white font-semibold"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang phân tích...
              </>
            ) : (
              'Gửi yêu cầu phân tích'
            )}
          </Button>

          {/* Results - Two Column Layout */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Single-Agent Column */}
              <div className="space-y-4">
                <div className="border-b-2 border-blue-500/30 pb-3">
                  <h2 className="text-base md:text-xl font-bold text-foreground">Single-Agent (Baseline)</h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">⏱ {result.single_agent.elapsed_seconds.toFixed(2)}s</p>
                </div>

                {/* Response */}
                <div className="prose prose-invert max-w-none text-xs md:text-sm">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="text-foreground leading-relaxed mb-2 md:mb-3">{children}</p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-sm md:text-lg font-bold text-foreground mt-3 md:mt-4 mb-1 md:mb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xs md:text-base font-bold text-foreground mt-2 md:mt-3 mb-1">{children}</h2>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-foreground mb-2 md:mb-3 space-y-0.5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-foreground mb-2 md:mb-3 space-y-0.5">{children}</ol>
                      ),
                      code: ({ children }) => (
                        <code className="bg-black/30 px-1 md:px-1.5 py-0.5 rounded text-xs md:text-sm text-blue-300">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {result.single_agent.response}
                  </ReactMarkdown>
                </div>

                {/* Features */}
                {result.single_agent.features.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Các tính năng</p>
                    <div className="flex flex-wrap gap-2">
                      {result.single_agent.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs bg-gray-500/20 text-gray-300 border border-gray-500/30"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Agent Column */}
              <div className="space-y-4">
                <div className="border-b-2 border-purple-500/30 pb-3">
                  <h2 className="text-base md:text-xl font-bold text-foreground">Multi-Agent</h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">⏱ {result.multi_agent.elapsed_seconds.toFixed(2)}s</p>
                </div>

                {/* Response */}
                <div className="prose prose-invert max-w-none text-xs md:text-sm">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="text-foreground leading-relaxed mb-2 md:mb-3">{children}</p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-sm md:text-lg font-bold text-foreground mt-3 md:mt-4 mb-1 md:mb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xs md:text-base font-bold text-foreground mt-2 md:mt-3 mb-1">{children}</h2>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-foreground mb-2 md:mb-3 space-y-0.5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-foreground mb-2 md:mb-3 space-y-0.5">{children}</ol>
                      ),
                      code: ({ children }) => (
                        <code className="bg-black/30 px-1 md:px-1.5 py-0.5 rounded text-xs md:text-sm text-purple-300">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {result.multi_agent.response}
                  </ReactMarkdown>
                </div>

                {/* Features */}
                {result.multi_agent.features.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Các tính năng</p>
                    <div className="flex flex-wrap gap-2">
                      {result.multi_agent.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
