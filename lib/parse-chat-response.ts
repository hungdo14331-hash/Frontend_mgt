export interface ParsedChatResponse {
  caseMemory: string | null
  experts: Array<{ name: string; color: string }>
  toolCalls: Array<{ expert: string; tool: string; args: string; result: string }>
  warnings: string[]
  mainContent: string
}

export const EXPERT_COLORS: Record<string, string> = {
  credit: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  legal: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  product: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  operations: 'bg-green-500/20 text-green-400 border-green-500/30',
}

// Bảng màu dạng nền đặc (không phải outline mờ) — dùng cho card lớn ở các
// trang Kho tri thức / Công cụ / Chuyên gia, nơi cần độ tương phản cao hơn
// so với badge nhỏ trong bong bóng chat.
export const EXPERT_SOLID_COLORS: Record<string, string> = {
  credit: 'bg-blue-500',
  legal: 'bg-purple-500',
  product: 'bg-orange-500',
  operations: 'bg-green-500',
}

export const EXPERT_BORDER_COLORS: Record<string, string> = {
  credit: 'border-blue-500',
  legal: 'border-purple-500',
  product: 'border-orange-500',
  operations: 'border-green-500',
}

export function parseChatResponse(text: string): ParsedChatResponse {
  const lines = text.split('\n')
  const result: ParsedChatResponse = {
    caseMemory: null,
    experts: [],
    toolCalls: [],
    warnings: [],
    mainContent: '',
  }

  let mainContentLines: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Parse Case Memory
    if (line.includes('🧠 Case Memory:')) {
      result.caseMemory = line.replace('🧠 Case Memory:', '').trim()
      i++
      continue
    }

    // Parse Experts
    if (line.includes('🔍 Đã hỏi ý kiến:')) {
      const expertText = line.replace('🔍 Đã hỏi ý kiến:', '').trim()
      const expertNames = expertText.split(/[,、]/).map((e) => e.trim())
      result.experts = expertNames.map((name) => ({
        name,
        color: EXPERT_COLORS[name.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      }))
      i++
      continue
    }

    // Parse Tool Calls
    if (line.includes('🔧')) {
      const toolMatch = line.match(/🔧\s+(\w+)\s+đã gọi\s+`(\w+)\((.*?)\)`\s*->\s*(.*)/)
      if (toolMatch) {
        result.toolCalls.push({
          expert: toolMatch[1],
          tool: toolMatch[2],
          args: toolMatch[3],
          result: toolMatch[4],
        })
      }
      i++
      continue
    }

    // Parse Warnings
    if (line.includes('⚠️ CẢNH BÁO RỦI RO:')) {
      const warningText = line.replace('⚠️ CẢNH BÁO RỦI RO:', '').trim()
      if (warningText) {
        result.warnings.push(warningText)
      }
      // Collect following warning lines
      i++
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith('�')) {
        result.warnings.push(lines[i].trim())
        i++
      }
      continue
    }

    // Collect main content
    if (line.trim()) {
      mainContentLines.push(line)
    } else if (mainContentLines.length > 0) {
      mainContentLines.push('')
    }

    i++
  }

  result.mainContent = mainContentLines.join('\n').trim()

  return result
}
