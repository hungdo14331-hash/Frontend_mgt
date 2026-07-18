'use client'

import { useState, useEffect } from 'react'
import { fetchTools, type ToolInfo } from '@/lib/api'
import { EXPERT_COLORS } from '@/lib/parse-chat-response'
import { Loader2, AlertCircle, Wrench } from 'lucide-react'

export default function ToolsPage() {
  const [tools, setTools] = useState<ToolInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTools()
  }, [])

  const loadTools = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchTools()
      setTools(data.tools)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách công cụ'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 md:px-6 py-4 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Công cụ (Tools)</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Các hàm thật mà chuyên gia AI có thể gọi để tra cứu dữ liệu hoặc thực hiện hành động
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
              <button onClick={loadTools} className="text-xs text-red-700 underline mt-1">
                Thử lại
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="bg-card border border-border rounded-lg p-4 md:p-5 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <code className="text-sm font-semibold text-foreground break-all">
                      {tool.name}()
                    </code>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>

                {tool.parameters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tool.parameters.map((param) => (
                      <span
                        key={param}
                        className="px-2 py-0.5 rounded bg-muted text-xs font-mono text-muted-foreground"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1.5">Được sử dụng bởi:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.used_by_experts_display.map((name, idx) => {
                      const expertId = tool.used_by_experts[idx]
                      return (
                        <span
                          key={name}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            EXPERT_COLORS[expertId] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}
                        >
                          {name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
