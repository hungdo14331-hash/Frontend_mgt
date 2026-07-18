import { API_URL } from './api-config'

interface ChatRequest {
  message: string
  context?: string
  use_rag?: boolean
  use_risk_check?: boolean
}

interface ChatResponse {
  response: string
  elapsed_seconds: number
  settings_used?: {
    use_rag: boolean
    use_risk_check: boolean
  }
}

interface CompareRequest {
  message: string
  use_rag?: boolean
  use_risk_check?: boolean
}

interface CompareResponse {
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

export interface Expert {
  id: string
  display_name: string
  icon?: string
}

interface ExpertsResponse {
  experts: Expert[]
}

export interface KnowledgeDocument {
  id: string
  title: string
  expert: string
  expert_display_name: string
  content: string
}

interface KnowledgeBaseResponse {
  documents: KnowledgeDocument[]
}

export interface ToolInfo {
  name: string
  description: string
  used_by_experts: string[]
  used_by_experts_display: string[]
  parameters: string[]
}

interface ToolsResponse {
  tools: ToolInfo[]
}

export interface SystemInfoResponse {
  model_name: string
  experts_count: number
  experts: string[]
  api_version: string
  default_settings: {
    use_rag: boolean
    use_risk_check: boolean
  }
  note: string
}

interface TraceResponse {
  user_input: string
  experts_called: string[]
  experts_called_display: string[]
  task_plan: { [expert_id: string]: string }
  tool_calls: Array<{
    expert: string
    tool: string
    args: Record<string, unknown>
    result: unknown
    from_cache: boolean
  }>
  synthesis_used: boolean
  risk_flagged: boolean
  memory_state: {
    customer_id?: string
    facts: string[]
    cached_tools: Record<string, unknown>
    experts_consulted: string[]
    history_length: number
  }
  timings: {
    routing_sec: number
    experts_sec: number
    synthesis_sec: number
    total_sec: number
  }
  has_data: boolean
}

export async function fetchChat(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    throw error
  }
}

export async function fetchCompare(request: CompareRequest): Promise<CompareResponse> {
  try {
    const response = await fetch(`${API_URL}/api/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Compare failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Compare error:', error)
    throw error
  }
}

export async function fetchExperts(): Promise<ExpertsResponse> {
  try {
    const response = await fetch(`${API_URL}/api/experts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Experts failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Experts error:', error)
    throw error
  }
}

export async function fetchTrace(): Promise<TraceResponse> {
  try {
    const response = await fetch(`${API_URL}/api/trace`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Trace failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Trace error:', error)
    throw error
  }
}

export async function fetchKnowledgeBase(): Promise<KnowledgeBaseResponse> {
  try {
    const response = await fetch(`${API_URL}/api/knowledge-base`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Knowledge base failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Knowledge base error:', error)
    throw error
  }
}

export async function fetchTools(): Promise<ToolsResponse> {
  try {
    const response = await fetch(`${API_URL}/api/tools`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Tools failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Tools error:', error)
    throw error
  }
}

export async function fetchSystemInfo(): Promise<SystemInfoResponse> {
  try {
    const response = await fetch(`${API_URL}/api/system-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`System info failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('System info error:', error)
    throw error
  }
}


