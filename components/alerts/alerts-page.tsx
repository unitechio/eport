"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Search,
  Settings,
  Zap,
  Server,
  Database,
  Shield,
  Activity,
  Mail,
  Slack,
  Webhook,
  Eye,
} from "lucide-react"

interface Alert {
  id: string
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  status: "active" | "acknowledged" | "resolved"
  timestamp: string
  source: string
  category: "server" | "database" | "security" | "network"
  affectedResources: string[]
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "High CPU Usage",
    description: "Server web-01 CPU usage has exceeded 90% for the last 15 minutes",
    severity: "critical",
    status: "active",
    timestamp: "2024-01-15T10:30:00Z",
    source: "web-01.company.com",
    category: "server",
    affectedResources: ["web-01.company.com"],
  },
  {
    id: "2",
    title: "Database Connection Pool Full",
    description: "PostgreSQL connection pool has reached maximum capacity",
    severity: "warning",
    status: "acknowledged",
    timestamp: "2024-01-15T09:45:00Z",
    source: "db-primary.company.com",
    category: "database",
    affectedResources: ["db-primary.company.com", "api-gateway"],
  },
  {
    id: "3",
    title: "Failed Login Attempts",
    description: "Multiple failed login attempts detected from IP 192.168.1.100",
    severity: "warning",
    status: "active",
    timestamp: "2024-01-15T09:15:00Z",
    source: "auth-service",
    category: "security",
    affectedResources: ["auth-service", "user-portal"],
  },
  {
    id: "4",
    title: "Disk Space Low",
    description: "Storage volume /var/log is 85% full on server app-02",
    severity: "warning",
    status: "resolved",
    timestamp: "2024-01-15T08:30:00Z",
    source: "app-02.company.com",
    category: "server",
    affectedResources: ["app-02.company.com"],
  },
]

const severityConfig = {
  critical: { color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50", icon: AlertTriangle },
  warning: { color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50", icon: AlertTriangle },
  info: { color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", icon: Bell },
}

const statusConfig = {
  active: { color: "bg-red-100 text-red-800", label: "Active" },
  acknowledged: { color: "bg-yellow-100 text-yellow-800", label: "Acknowledged" },
  resolved: { color: "bg-green-100 text-green-800", label: "Resolved" },
}

const categoryIcons = {
  server: Server,
  database: Database,
  security: Shield,
  network: Activity,
}

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus
    const matchesCategory = selectedCategory === "all" || alert.category === selectedCategory

    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory
  })

  const alertCounts = {
    total: alerts.length,
    active: alerts.filter((a) => a.status === "active").length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
  }

  const handleAcknowledge = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "acknowledged" as const } : alert)))
  }

  const handleResolve = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))
  }

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const severityInfo = severityConfig[alert.severity]
    const statusInfo = statusConfig[alert.status]
    const CategoryIcon = categoryIcons[alert.category]
    const SeverityIcon = severityInfo.icon

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${severityInfo.bgColor}`}>
                <SeverityIcon className={`w-4 h-4 ${severityInfo.textColor}`} />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{alert.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                  <Badge variant="outline" className="text-xs">
                    <CategoryIcon className="w-3 h-3 mr-1" />
                    {alert.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {alert.status === "active" && (
                <>
                  <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)} className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Acknowledge
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleResolve(alert.id)} className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolve
                  </Button>
                </>
              )}
              {alert.status === "acknowledged" && (
                <Button size="sm" variant="outline" onClick={() => handleResolve(alert.id)} className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolve
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(alert.timestamp).toLocaleString()}
              </span>
              <span className="flex items-center">
                <Server className="w-3 h-3 mr-1" />
                {alert.source}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs">Affected: {alert.affectedResources.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertCounts.total}</div>
            <p className="text-xs text-muted-foreground">All time alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertCounts.active}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <Zap className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertCounts.critical}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{alertCounts.warning}</div>
            <p className="text-xs text-muted-foreground">Medium priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="network">Network</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Alerts ({filteredAlerts.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({filteredAlerts.filter((a) => a.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="acknowledged">
            Acknowledged ({filteredAlerts.filter((a) => a.status === "acknowledged").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({filteredAlerts.filter((a) => a.status === "resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredAlerts
            .filter((a) => a.status === "active")
            .map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
        </TabsContent>

        <TabsContent value="acknowledged" className="space-y-4">
          {filteredAlerts
            .filter((a) => a.status === "acknowledged")
            .map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {filteredAlerts
            .filter((a) => a.status === "resolved")
            .map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
        </TabsContent>
      </Tabs>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Channels</CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Mail className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">admin@company.com</p>
                <Badge variant="outline" className="mt-1">
                  Active
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Slack className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-medium">Slack</h3>
                <p className="text-sm text-muted-foreground">#alerts-channel</p>
                <Badge variant="outline" className="mt-1">
                  Active
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Webhook className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-medium">Webhook</h3>
                <p className="text-sm text-muted-foreground">Custom endpoint</p>
                <Badge variant="secondary" className="mt-1">
                  Inactive
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
