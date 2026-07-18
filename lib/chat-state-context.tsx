'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { fetchChat, fetchTrace, type TraceResponse } from '@/lib/api'
import { parseChatResponse } from '@/lib/parse-chat-response'

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
  isSending: boolean
  sendError: string | null
  sendMessage: (text: string) => Promise<void>
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
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  // QUAN TRỌNG: dùng ref để sendMessage luôn đọc được giá trị mới nhất của
  // messages/useRag/useRiskCheck tại thời điểm gọi, mà không cần đưa các biến
  // này vào dependency của useCallback (tránh tạo lại hàm liên tục, và tránh
  // "stale closure" - lấy nhầm giá trị cũ nếu người dùng đổi trang giữa chừng).
  const messagesRef = useRef(messages)
  const useRagRef = useRef(useRag)
  const useRiskCheckRef = useRef(useRiskCheck)
  messagesRef.current = messages
  useRagRef.current = useRag
  useRiskCheckRef.current = useRiskCheck

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

  // sendMessage sống trong Context (không phải trong component ChatPage), nên
  // dù người dùng chuyển sang tab khác giữa lúc đang chờ phản hồi (request có
  // thể mất 10-40 giây), hàm này vẫn tiếp tục chạy và ghi kết quả đúng chỗ khi
  // xong - không bị "mất tiến độ" như khi state nằm trong component có thể
  // unmount.
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }

    setMessagesState((prev) => [...prev, userMessage])
    setSendError(null)
    setIsSending(true)

    try {
      const response = await fetchChat({
        message: trimmed,
        context: messagesRef.current
          .filter((m) => m.role === 'assistant')
          .map((m) => m.content)
          .join('\n\n'),
        use_rag: useRagRef.current,
        use_risk_check: useRiskCheckRef.current,
      })

      const parsed = parseChatResponse(response.response)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        elapsed_seconds: response.elapsed_seconds,
        caseMemory: parsed.caseMemory,
        experts: parsed.experts,
        toolCalls: parsed.toolCalls,
        warnings: parsed.warnings,
        mainContent: parsed.mainContent,
        settingsUsed: response.settings_used,
      }

      setMessagesState((prev) => [...prev, assistantMessage])

      try {
        const trace = await fetchTrace()
        pushTrace(trace)
      } catch {
        // Không chặn luồng chính nếu lấy trace thất bại - chat vẫn đã thành công.
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setSendError(errorMessage)
    } finally {
      setIsSending(false)
    }
  }, [pushTrace])

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
        isSending,
        sendError,
        sendMessage,
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
