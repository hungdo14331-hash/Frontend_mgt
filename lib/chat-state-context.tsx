'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { TraceResponse } from '@/lib/api'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string // lưu dạng ISO string vì Date không serialize được qua JSON.stringify đúng cách
  elapsed_seconds?: number
  caseMemory?: string | null
  experts?: Array<{ name: string; color: string }>
  toolCalls?: Array<{ expert: string; tool: string; args: string; result: string }>
  warnings?: string[]
  mainContent?: string
  settingsUsed?: { use_rag: boolean; use_risk_check: boolean }
}

interface TraceHistoryEntry extends TraceResponse {
  recorded_at: string
}

interface ChatStateContextValue {
  messages: ChatMessage[]
  setMessages: (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void
  clearMessages: () => void
  traceHistory: TraceHistoryEntry[]
  pushTrace: (trace: TraceResponse) => void
  useRag: boolean
  setUseRag: (value: boolean) => void
  useRiskCheck: boolean
  setUseRiskCheck: (value: boolean) => void
}

const ChatStateContext = createContext<ChatStateContextValue | null>(null)

const MESSAGES_STORAGE_KEY = 'shb-chat-messages'
const TRACE_HISTORY_STORAGE_KEY = 'shb-trace-history'
const SETTINGS_STORAGE_KEY = 'shb-request-settings'
const MAX_TRACE_HISTORY = 10

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function ChatStateProvider({ children }: { children: ReactNode }) {
  // Khởi tạo rỗng trên server-render, nạp thật từ localStorage ở useEffect đầu
  // tiên — tránh lỗi hydration mismatch giữa server và client.
  const [messages, setMessagesState] = useState<ChatMessage[]>([])
  const [traceHistory, setTraceHistory] = useState<TraceHistoryEntry[]>([])
  const [useRag, setUseRagState] = useState(true)
  const [useRiskCheck, setUseRiskCheckState] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setMessagesState(safeParse(localStorage.getItem(MESSAGES_STORAGE_KEY), []))
    setTraceHistory(safeParse(localStorage.getItem(TRACE_HISTORY_STORAGE_KEY), []))
    const savedSettings = safeParse(localStorage.getItem(SETTINGS_STORAGE_KEY), {
      use_rag: true,
      use_risk_check: true,
    })
    setUseRagState(savedSettings.use_rag)
    setUseRiskCheckState(savedSettings.use_risk_check)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages))
  }, [messages, hydrated])

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return
    localStorage.setItem(TRACE_HISTORY_STORAGE_KEY, JSON.stringify(traceHistory))
  }, [traceHistory, hydrated])

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ use_rag: useRag, use_risk_check: useRiskCheck })
    )
  }, [useRag, useRiskCheck, hydrated])

  const setMessages = useCallback(
    (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setMessagesState((prev) => (typeof updater === 'function' ? updater(prev) : updater))
    },
    []
  )

  const clearMessages = useCallback(() => {
    setMessagesState([])
  }, [])

  const pushTrace = useCallback((trace: TraceResponse) => {
    if (!trace.has_data) return
    setTraceHistory((prev) => {
      const entry: TraceHistoryEntry = { ...trace, recorded_at: new Date().toISOString() }
      const next = [entry, ...prev]
      return next.slice(0, MAX_TRACE_HISTORY)
    })
  }, [])

  return (
    <ChatStateContext.Provider
      value={{
        messages,
        setMessages,
        clearMessages,
        traceHistory,
        pushTrace,
        useRag,
        setUseRag: setUseRagState,
        useRiskCheck,
        setUseRiskCheck: setUseRiskCheckState,
      }}
    >
      {children}
    </ChatStateContext.Provider>
  )
}

export function useChatState() {
  const ctx = useContext(ChatStateContext)
  if (!ctx) {
    throw new Error('useChatState phải được dùng bên trong ChatStateProvider')
  }
  return ctx
}
