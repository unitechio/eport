"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  User,
  Server,
  Database,
  Network,
  FileText,
  Download,
  Filter,
  Search,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  resourceType: "server" | "docker" | "kubernetes" | "database" | "network" | "security"
  impact: "low" | "medium" | "high" | "critical"
  status: "success" | "failed" | "pending"
  details: string
  ipAddress: string
  userAgent: string
  changes?: {
    before: Record<string, unknown>
    after: Record<string, unknown>
  }
}

interface SystemImpact {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  affectedSystems: string[]
  estimatedDowntime: string
  rollbackPlan: string
  approvalStatus: "pending" | "approved" | "rejected"
  scheduledTime?: string
  executedBy?: string
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15T10:30:00Z",
    user: "admin@company.com",
    action: "Server Configuration Update",
    resource: "web-server-01",
    resourceType: "server",
    impact: "medium",
    status: "success",
    details: "Updated firewall rules to allow port 8080",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    changes: {
      before: { firewall_rules: ["80", "443"] },
      after: { firewall_rules: ["80", "443", "8080"] },
    },
  },
  {
    id: "2",
    timestamp: "2024-01-15T09:15:00Z",
    user: "devops@company.com",
    action: "Docker Container Deployment",
    resource: "nginx-proxy",
    resourceType: "docker",
    impact: "high",
    status: "success",
    details: "Deployed new nginx proxy container with SSL configuration",
    ipAddress: "192.168.1.101",
    userAgent: "Docker CLI 24.0.7",
  },
  {
    id: "3",
    timestamp: "2024-01-15T08:45:00Z",
    user: "sysadmin@company.com",
    action: "Kubernetes Pod Scale",
    resource: "api-deployment",
    resourceType: "kubernetes",
    impact: "medium",
    status: "failed",
    details: "Failed to scale pods due to resource constraints",
    ipAddress: "192.168.1.102",
    userAgent: "kubectl v1.28.0",
  },
]

const mockSystemImpacts: SystemImpact[] = [
  {
    id: "1",
    title: "Database Migration - User Table Schema Update",
    description: "Update user table to add new authentication fields and indexes",
    severity: "high",
    affectedSystems: ["user-db-01", "auth-service", "web-app"],
    estimatedDowntime: "30 minutes",
    rollbackPlan: "Restore from backup taken at 2024-01-15T00:00:00Z",
    approvalStatus: "approved",
    scheduledTime: "2024-01-16T02:00:00Z",
    executedBy: "dba@company.com",
  },
  {
    id: "2",
    title: "Load Balancer Configuration Update",
    description: "Update load balancer rules to redirect traffic to new data center",
    severity: "critical",
    affectedSystems: ["lb-01", "lb-02", "all-web-services"],
    estimatedDowntime: "5 minutes",
    rollbackPlan: "Revert to previous configuration via automated script",
    approvalStatus: "pending",
  },
]

export function SystemAudit() {
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [systemImpacts] = useState<SystemImpact[]>(mockSystemImpacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterResource, setFilterResource] = useState("all")
  const [filterImpact, setFilterImpact] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResource = filterResource === "all" || log.resourceType === filterResource
    const matchesImpact = filterImpact === "all" || log.impact === filterImpact
    const matchesStatus = filterStatus === "all" || log.status === filterStatus

    return matchesSearch && matchesResource && matchesImpact && matchesStatus
  })

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "server":
        return <Server className="h-4 w-4" />
      case "docker":
        return <Database className="h-4 w-4" />
      case "kubernetes":
        return <Network className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "network":
        return <Network className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Audit & Impact Management</h1>
          <p className="text-muted-foreground mt-2">Monitor system changes, track impacts, and maintain audit trails</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="audit-logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="system-impacts">System Impacts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterResource} onValueChange={setFilterResource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="docker">Docker</SelectItem>
                    <SelectItem value="kubernetes">Kubernetes</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterImpact} onValueChange={setFilterImpact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Impact Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Impacts</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {auditLogs.length} audit entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Impact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {log.user}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getResourceIcon(log.resourceType)}
                            <span className="capitalize">{log.resourceType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getImpactColor(log.impact)}>{log.impact.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <span className="capitalize">{log.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-impacts" className="space-y-6">
          <div className="grid gap-6">
            {systemImpacts.map((impact) => (
              <Card key={impact.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        {impact.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{impact.description}</CardDescription>
                    </div>
                    <Badge className={getImpactColor(impact.severity)}>{impact.severity.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Affected Systems</h4>
                      <div className="space-y-1">
                        {impact.affectedSystems.map((system, index) => (
                          <Badge key={index} variant="outline" className="mr-1">
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Estimated Downtime</h4>
                      <p className="text-sm">{impact.estimatedDowntime}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Approval Status</h4>
                      <Badge variant={impact.approvalStatus === "approved" ? "default" : "secondary"}>
                        {impact.approvalStatus}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Scheduled Time</h4>
                      <p className="text-sm">
                        {impact.scheduledTime ? new Date(impact.scheduledTime).toLocaleString() : "Not scheduled"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Rollback Plan</h4>
                    <p className="text-sm bg-muted p-3 rounded-md">{impact.rollbackPlan}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {impact.approvalStatus === "pending" && (
                      <>
                        <Button size="sm" variant="default">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>SOC 2 Type II</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ISO 27001</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>GDPR</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Review Required</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Audit Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span>94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "94.2%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Critical Issues</span>
                      <span>3</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Pending Reviews</span>
                      <span>12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Policy Update</div>
                    <div className="text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Compliance Check</div>
                    <div className="text-muted-foreground">6 hours ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Audit Report Generated</div>
                    <div className="text-muted-foreground">1 day ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>Audit Log Details</CardTitle>
              <Button variant="ghost" size="sm" className="absolute top-4 right-4" onClick={() => setSelectedLog(null)}>
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Timestamp</h4>
                  <p className="font-mono text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">User</h4>
                  <p className="text-sm">{selectedLog.user}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">IP Address</h4>
                  <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">User Agent</h4>
                  <p className="text-sm truncate">{selectedLog.userAgent}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Action Details</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{selectedLog.details}</p>
              </div>
              {selectedLog.changes && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Changes</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">Before</h5>
                      <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded border">
                        {JSON.stringify(selectedLog.changes.before, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">After</h5>
                      <pre className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded border">
                        {JSON.stringify(selectedLog.changes.after, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
