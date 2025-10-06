"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Download,
  Eye,
  FileText,
  Activity,
  Zap,
  TrendingUp,
  Filter,
} from "lucide-react"

interface SecurityVulnerability {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  category: "server" | "database" | "network" | "application" | "container"
  resource: string
  description: string
  cve?: string
  cvss?: number
  status: "open" | "in_progress" | "resolved" | "ignored"
  detectedAt: string
  resolvedAt?: string
  affectedResources: number
}

interface SecurityScan {
  id: string
  target: string
  type: "vulnerability" | "compliance" | "penetration" | "configuration"
  status: "running" | "completed" | "failed"
  startedAt: string
  completedAt?: string
  findings: {
    critical: number
    high: number
    medium: number
    low: number
  }
  score: number
}

interface ComplianceCheck {
  id: string
  framework: "SOC2" | "ISO27001" | "HIPAA" | "PCI-DSS" | "GDPR"
  control: string
  status: "compliant" | "non_compliant" | "partial"
  lastChecked: string
  evidence?: string
}

interface AccessLog {
  id: string
  user: string
  action: string
  resource: string
  result: "success" | "failure" | "blocked"
  ip: string
  timestamp: string
  details?: string
}

const mockVulnerabilities: SecurityVulnerability[] = [
  {
    id: "vuln1",
    title: "Critical SQL Injection Vulnerability",
    severity: "critical",
    category: "database",
    resource: "prod-postgres-main",
    description: "SQL injection vulnerability in user authentication endpoint",
    cve: "CVE-2024-1234",
    cvss: 9.8,
    status: "open",
    detectedAt: "2024-01-15T08:30:00Z",
    affectedResources: 1,
  },
  {
    id: "vuln2",
    title: "Outdated OpenSSL Version",
    severity: "high",
    category: "server",
    resource: "web-server-01",
    description: "Server running vulnerable OpenSSL version 1.1.1k",
    cve: "CVE-2024-5678",
    cvss: 7.5,
    status: "in_progress",
    detectedAt: "2024-01-14T14:20:00Z",
    affectedResources: 3,
  },
  {
    id: "vuln3",
    title: "Weak Password Policy",
    severity: "medium",
    category: "application",
    resource: "admin-portal",
    description: "Password policy allows weak passwords",
    status: "open",
    detectedAt: "2024-01-13T10:15:00Z",
    affectedResources: 1,
  },
  {
    id: "vuln4",
    title: "Unencrypted Network Traffic",
    severity: "high",
    category: "network",
    resource: "internal-api",
    description: "API endpoint serving traffic over HTTP instead of HTTPS",
    cvss: 7.2,
    status: "resolved",
    detectedAt: "2024-01-10T09:00:00Z",
    resolvedAt: "2024-01-12T16:30:00Z",
    affectedResources: 2,
  },
  {
    id: "vuln5",
    title: "Container Running as Root",
    severity: "medium",
    category: "container",
    resource: "api-service-v2",
    description: "Docker container running with root privileges",
    status: "open",
    detectedAt: "2024-01-12T11:45:00Z",
    affectedResources: 5,
  },
]

const mockScans: SecurityScan[] = [
  {
    id: "scan1",
    target: "Production Infrastructure",
    type: "vulnerability",
    status: "completed",
    startedAt: "2024-01-15T02:00:00Z",
    completedAt: "2024-01-15T03:45:00Z",
    findings: { critical: 1, high: 2, medium: 5, low: 12 },
    score: 72,
  },
  {
    id: "scan2",
    target: "Database Servers",
    type: "compliance",
    status: "completed",
    startedAt: "2024-01-14T22:00:00Z",
    completedAt: "2024-01-14T23:30:00Z",
    findings: { critical: 0, high: 1, medium: 3, low: 8 },
    score: 85,
  },
  {
    id: "scan3",
    target: "Web Applications",
    type: "penetration",
    status: "running",
    startedAt: "2024-01-15T10:00:00Z",
    findings: { critical: 0, high: 0, medium: 2, low: 4 },
    score: 0,
  },
]

const mockCompliance: ComplianceCheck[] = [
  {
    id: "comp1",
    framework: "SOC2",
    control: "Access Control - Multi-Factor Authentication",
    status: "compliant",
    lastChecked: "2024-01-15T08:00:00Z",
    evidence: "MFA enabled for all users",
  },
  {
    id: "comp2",
    framework: "ISO27001",
    control: "A.12.6.1 - Management of Technical Vulnerabilities",
    status: "partial",
    lastChecked: "2024-01-15T08:00:00Z",
    evidence: "2 high-severity vulnerabilities pending",
  },
  {
    id: "comp3",
    framework: "PCI-DSS",
    control: "Requirement 8 - Identify and Authenticate Access",
    status: "compliant",
    lastChecked: "2024-01-14T20:00:00Z",
  },
  {
    id: "comp4",
    framework: "GDPR",
    control: "Article 32 - Security of Processing",
    status: "non_compliant",
    lastChecked: "2024-01-15T08:00:00Z",
    evidence: "Unencrypted data transmission detected",
  },
]

const mockAccessLogs: AccessLog[] = [
  {
    id: "log1",
    user: "admin@company.com",
    action: "SSH Login",
    resource: "prod-server-01",
    result: "success",
    ip: "192.168.1.100",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "log2",
    user: "unknown",
    action: "Database Access",
    resource: "prod-postgres-main",
    result: "blocked",
    ip: "203.0.113.45",
    timestamp: "2024-01-15T10:25:00Z",
    details: "Unauthorized access attempt",
  },
  {
    id: "log3",
    user: "developer@company.com",
    action: "API Key Generation",
    resource: "api-gateway",
    result: "success",
    ip: "192.168.1.105",
    timestamp: "2024-01-15T10:20:00Z",
  },
  {
    id: "log4",
    user: "attacker",
    action: "Brute Force Login",
    resource: "admin-portal",
    result: "blocked",
    ip: "198.51.100.23",
    timestamp: "2024-01-15T10:15:00Z",
    details: "Multiple failed login attempts",
  },
]

export function SecurityCenter() {
  const [vulnerabilities, setVulnerabilities] = useState<SecurityVulnerability[]>(mockVulnerabilities)
  const [scans, setScans] = useState<SecurityScan[]>(mockScans)
  const [compliance, setCompliance] = useState<ComplianceCheck[]>(mockCompliance)
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(mockAccessLogs)
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVulnerabilities = vulnerabilities.filter((vuln) => {
    const matchesSeverity = selectedSeverity === "all" || vuln.severity === selectedSeverity
    const matchesStatus = selectedStatus === "all" || vuln.status === selectedStatus
    const matchesSearch =
      vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSeverity && matchesStatus && matchesSearch
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "ignored":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "non_compliant":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "failure":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const securityScore = 78
  const criticalIssues = vulnerabilities.filter((v) => v.severity === "critical" && v.status === "open").length
  const highIssues = vulnerabilities.filter((v) => v.severity === "high" && v.status === "open").length
  const complianceRate = Math.round(
    (compliance.filter((c) => c.status === "compliant").length / compliance.length) * 100,
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Center</h1>
          <p className="text-muted-foreground mt-2">Monitor security posture, vulnerabilities, and compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Run Scan
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityScore}/100</div>
            <Progress value={securityScore} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +5 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highIssues}</div>
            <p className="text-xs text-muted-foreground">High severity vulnerabilities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceRate}%</div>
            <p className="text-xs text-muted-foreground">Across all frameworks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vulnerabilities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="scans">Security Scans</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="access">Access Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerabilities" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="ignored">Ignored</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vulnerabilities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vulnerabilities List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vulnerabilities ({filteredVulnerabilities.length})</CardTitle>
                  <CardDescription>Security vulnerabilities detected across infrastructure</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vulnerability</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVulnerabilities.map((vuln) => (
                    <TableRow key={vuln.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vuln.title}</div>
                          <div className="text-sm text-muted-foreground">{vuln.description}</div>
                          {vuln.cve && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {vuln.cve} {vuln.cvss && `• CVSS ${vuln.cvss}`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vuln.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{vuln.resource}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vuln.status)}>{vuln.status.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(vuln.detectedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Scans</CardTitle>
                  <CardDescription>Automated security scanning results</CardDescription>
                </div>
                <Button size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  New Scan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scans.map((scan) => (
                  <Card key={scan.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{scan.target}</CardTitle>
                          <CardDescription>
                            {scan.type} scan • Started {new Date(scan.startedAt).toLocaleString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              scan.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : scan.status === "running"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }
                          >
                            {scan.status === "running" && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
                            {scan.status}
                          </Badge>
                          {scan.status === "completed" && <div className="text-2xl font-bold">{scan.score}/100</div>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{scan.findings.critical}</div>
                          <div className="text-xs text-muted-foreground">Critical</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{scan.findings.high}</div>
                          <div className="text-xs text-muted-foreground">High</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{scan.findings.medium}</div>
                          <div className="text-xs text-muted-foreground">Medium</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{scan.findings.low}</div>
                          <div className="text-xs text-muted-foreground">Low</div>
                        </div>
                      </div>
                      {scan.status === "completed" && (
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Regulatory compliance checks across frameworks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Framework</TableHead>
                    <TableHead>Control</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compliance.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell>
                        <Badge variant="outline">{check.framework}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{check.control}</TableCell>
                      <TableCell>
                        <Badge className={getComplianceColor(check.status)}>
                          {check.status === "compliant" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {check.status === "non_compliant" && <XCircle className="h-3 w-3 mr-1" />}
                          {check.status === "partial" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {check.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(check.lastChecked).toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{check.evidence || "N/A"}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Logs</CardTitle>
              <CardDescription>Real-time security and access monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="font-mono text-sm">{log.resource}</TableCell>
                      <TableCell>
                        <Badge className={getResultColor(log.result)}>
                          {log.result === "success" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {log.result === "blocked" && <XCircle className="h-3 w-3 mr-1" />}
                          {log.result === "failure" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {log.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell className="text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.details || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
