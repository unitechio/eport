"use client"

import { useState } from 'react'
import { useAuditLogs, useAuditStatistics } from '@/hooks/useAuditLogs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { PermissionGuard } from '@/guards/permission-guard'
import { PERMISSIONS } from '@/config/permissions'
import {
  Search,
  Download,
  Filter,
  Clock,
  User,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'
import type { AuditLogFilters } from '@/types/audit'

export function AuditLogViewer() {
  const [, setSelectedLogId] = useState<string | null>(null)
  const [dateRange] = useState({
    startDate: '',
    endDate: ''
  })
  
  const {
    logs,
    loading,
    error,
    pagination,
    updateFilters,
    changePage,
    exportLogs
  } = useAuditLogs({
    limit: 50,
    sortBy: 'request_time',
    sortOrder: 'desc'
  })

  const { statistics } = useAuditStatistics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  })

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-500'
    if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-500'
    if (statusCode >= 500) return 'bg-red-500'
    return 'bg-gray-500'
  }

  const getStatusIcon = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return <CheckCircle className="h-4 w-4" />
    if (statusCode >= 400 && statusCode < 500) return <AlertTriangle className="h-4 w-4" />
    if (statusCode >= 500) return <XCircle className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
    return `${(ms / 60000).toFixed(2)}m`
  }

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    updateFilters({ [key]: value })
  }

  return (
    <PermissionGuard permission={PERMISSIONS.SYSTEM_ADMIN}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground">System activity and security audit trail</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        className="pl-10"
                        onChange={(e) => handleFilterChange('userName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Action</label>
                    <Select onValueChange={(value) => handleFilterChange('action', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All actions</SelectItem>
                        <SelectItem value="USER_LOGIN">User Login</SelectItem>
                        <SelectItem value="SERVER_RESTART">Server Restart</SelectItem>
                        <SelectItem value="CONTAINER_DEPLOY">Container Deploy</SelectItem>
                        <SelectItem value="CONFIG_UPDATE">Config Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Status Code</label>
                    <Select onValueChange={(value) => handleFilterChange('statusCode', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All status</SelectItem>
                        <SelectItem value="200">200 - Success</SelectItem>
                        <SelectItem value="400">400 - Bad Request</SelectItem>
                        <SelectItem value="401">401 - Unauthorized</SelectItem>
                        <SelectItem value="403">403 - Forbidden</SelectItem>
                        <SelectItem value="500">500 - Server Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Source App</label>
                    <Select onValueChange={(value) => handleFilterChange('sourceApp', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All apps" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All apps</SelectItem>
                        <SelectItem value="CRM-WEB">CRM Web</SelectItem>
                        <SelectItem value="CRM-APP">CRM App</SelectItem>
                        <SelectItem value="SERVER-MANAGER">Server Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Audit Trail ({pagination.total} records)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading audit logs...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Time</th>
                          <th className="text-left p-2 font-medium">User</th>
                          <th className="text-left p-2 font-medium">Action</th>
                          <th className="text-left p-2 font-medium">IP</th>
                          <th className="text-left p-2 font-medium">Status</th>
                          <th className="text-left p-2 font-medium">Duration</th>
                          <th className="text-left p-2 font-medium">App</th>
                          <th className="text-left p-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.audit_log_id} className="border-b hover:bg-gray-50">
                            <td className="p-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {new Date(log.request_time).toLocaleString()}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{log.action_user_name}</span>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge variant="outline">{log.action}</Badge>
                            </td>
                            <td className="p-2 font-mono text-sm">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                {log.client_.ip}
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge className={`${getStatusColor(log.status_code)} text-white border-0`}>
                                {getStatusIcon(log.status_code)}
                                <span className="ml-1">{log.status_code}</span>
                              </Badge>
                            </td>
                            <td className="p-2 text-sm">
                              {formatDuration(log.duration_ms)}
                            </td>
                            <td className="p-2">
                              <Badge variant="secondary">{log.source_app_id}</Badge>
                            </td>
                            <td className="p-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedLogId(log.audit_log_id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page <= 1}
                      onClick={() => changePage(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => changePage(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            {statistics && (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Requests</p>
                          <p className="text-2xl font-bold">{statistics.totalRequests.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                          <p className="text-2xl font-bold">
                            {((statistics.successRequests / statistics.totalRequests) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Error Requests</p>
                          <p className="text-2xl font-bold">{statistics.errorRequests.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-8 w-8 text-orange-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Duration</p>
                          <p className="text-2xl font-bold">{formatDuration(statistics.averageDuration)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts placeholder - you can integrate Chart.js or Recharts here */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Requests by Action</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {statistics.requestsByAction.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{item.action}</span>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={(item.count / statistics.totalRequests) * 100} 
                                className="w-24" 
                              />
                              <span className="text-sm font-medium">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {statistics.requestsByUser.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{item.user}</span>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={(item.count / statistics.totalRequests) * 100} 
                                className="w-24" 
                              />
                              <span className="text-sm font-medium">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  )
}