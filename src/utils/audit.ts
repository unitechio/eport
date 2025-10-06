import type { AuditLog } from '@/types/audit'

export function decodeRequestMessage(encodedMessage: string): any {
  try {
    const decoded = atob(encodedMessage)
    return JSON.parse(decoded)
  } catch (error) {
    return 'Unable to decode message'
  }
}

export function formatAuditAction(action: string): string {
  return action.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

export function getAuditSeverity(statusCode: number): 'low' | 'medium' | 'high' | 'critical' {
  if (statusCode >= 200 && statusCode < 300) return 'low'
  if (statusCode >= 400 && statusCode < 500) return 'medium'
  if (statusCode >= 500) return 'high'
  if (statusCode === 401 || statusCode === 403) return 'critical'
  return 'medium'
}

export function groupAuditLogsByTimeframe(logs: AuditLog[], timeframe: 'hour' | 'day' | 'week') {
  const grouped: Record<string, AuditLog[]> = {}
  
  logs.forEach(log => {
    const date = new Date(log.request_time)
    let key: string
    
    switch (timeframe) {
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
        break
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        break
      case 'week':
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`
        break
    }
    
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(log)
  })
  
  return grouped
}