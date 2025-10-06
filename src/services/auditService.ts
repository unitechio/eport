import apiClient  from '@/lib/interceptor'
import type { AuditLog, AuditLogFilters, AuditLogResponse, AuditStatistics } from '@/types/audit'

export const auditService = {
  getAuditLogs: async (filters: AuditLogFilters = {}): Promise<AuditLogResponse> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`/api/audit/logs?${params}`)
    return response.data
  },

  getAuditLogById: async (id: string): Promise<AuditLog> => {
    const response = await apiClient.get(`/api/audit/logs/${id}`)
    return response.data
  },

  getAuditStatistics: async (filters: Partial<AuditLogFilters> = {}): Promise<AuditStatistics> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`/api/audit/statistics?${params}`)
    return response.data
  },

  exportAuditLogs: async (filters: AuditLogFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`/api/audit/export?${params}`, {
      responseType: 'blob'
    })
    return response.data
  },

  getAuditLogsByTraceId: async (traceId: string): Promise<AuditLog[]> => {
    const response = await apiClient.get(`/api/audit/trace/${traceId}`)
    return response.data
  },

  getAuditLogsByUser: async (userId: string, filters: Partial<AuditLogFilters> = {}): Promise<AuditLogResponse> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`/api/audit/users/${userId}?${params}`)
    return response.data
  }
}