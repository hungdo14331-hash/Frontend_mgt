'use client'

import { useState, useEffect } from 'react'
import { fetchKnowledgeBase, type KnowledgeDocument } from '@/lib/api'
import { EXPERT_SOLID_COLORS, EXPERT_BORDER_COLORS } from '@/lib/parse-chat-response'
import { Loader2, AlertCircle, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadKnowledgeBase()
  }, [])

  const loadKnowledgeBase = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchKnowledgeBase()
      setDocuments(data.documents)
      if (data.documents.length > 0) {
        setActiveId(data.documents[0].id)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải kho tri thức'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const activeDocument = documents.find((doc) => doc.id === activeId)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 md:px-6 py-4 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Kho tri thức</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Nội dung quy định nội bộ mà các chuyên gia AI tra cứu trực tiếp (RAG)
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
              <button
                onClick={loadKnowledgeBase}
                className="text-xs text-red-700 underline mt-1"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Tab list - stacks on top for mobile, side column on desktop */}
            <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {documents.map((doc) => {
                const isActive = doc.id === activeId
                return (
                  <button
                    key={doc.id}
                    onClick={() => setActiveId(doc.id)}
                    className={`flex-shrink-0 lg:flex-shrink flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all whitespace-nowrap lg:whitespace-normal ${
                      isActive
                        ? `${EXPERT_BORDER_COLORS[doc.expert] || 'border-primary'} bg-card shadow-sm`
                        : 'border-border bg-card/50 hover:bg-card'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        EXPERT_SOLID_COLORS[doc.expert] || 'bg-gray-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.expert_display_name}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="lg:col-span-3 bg-card border border-border rounded-lg p-4 md:p-6">
              {activeDocument ? (
                <>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        EXPERT_SOLID_COLORS[activeDocument.expert] || 'bg-gray-400'
                      }`}
                    >
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{activeDocument.title}</h2>
                      <p className="text-xs text-muted-foreground">
                        Nguồn tra cứu của {activeDocument.expert_display_name}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold text-foreground mt-4 mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-bold text-foreground mt-4 mb-2">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-bold text-foreground mt-3 mb-1">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-sm text-foreground leading-relaxed mb-2">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside text-sm text-foreground mb-2 space-y-1">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => <li className="text-sm text-foreground">{children}</li>,
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">{children}</strong>
                        ),
                        code: ({ children }) => (
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
                        ),
                      }}
                    >
                      {activeDocument.content}
                    </ReactMarkdown>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có tài liệu nào.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
