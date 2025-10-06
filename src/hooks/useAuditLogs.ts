import { useState, useEffect, useCallback } from 'react'
import { auditService } from '@/services/auditService'
import type { AuditLog, AuditLogFilters, AuditLogResponse, AuditStatistics } from '@/types/audit'

export function useAuditLogs(initialFilters: AuditLogFilters = {}) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState<AuditLogFilters>(initialFilters)

  const fetchLogs = useCallback(async (newFilters?: AuditLogFilters) => {
    try {
      setLoading(true)
      setError(null)
      
      const currentFilters = newFilters || filters
      const response = await auditService.getAuditLogs(currentFilters)
      
      setLogs(response.data)
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<AuditLogFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)
    fetchLogs(updatedFilters)
  }, [filters, fetchLogs])

  const changePage = useCallback((page: number) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)
    fetchLogs(updatedFilters)
  }, [filters, fetchLogs])

  const exportLogs = useCallback(async () => {
    try {
      const blob = await auditService.exportAuditLogs(filters)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export audit logs')
    }
  }, [filters])

  useEffect(() => {
    fetchLogs()
  }, [])

  return {
    logs,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    exportLogs,
    refetch: fetchLogs
  }
}

export function useAuditStatistics(filters: Partial<AuditLogFilters> = {}) {
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await auditService.getAuditStatistics(filters)
      setStatistics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit statistics')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  }
}