"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Server,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Container,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
} from "recharts"
import { cn } from "@/lib/utils"

// Mock data for charts
const serverPerformanceData = [
  { name: "00:00", cpu: 45, memory: 62, disk: 78, network: 34 },
  { name: "04:00", cpu: 52, memory: 58, disk: 82, network: 28 },
  { name: "08:00", cpu: 78, memory: 74, disk: 85, network: 65 },
  { name: "12:00", cpu: 85, memory: 82, disk: 88, network: 72 },
  { name: "16:00", cpu: 92, memory: 88, disk: 90, network: 85 },
  { name: "20:00", cpu: 68, memory: 72, disk: 86, network: 58 },
]

const alertTrendsData = [
  { name: "Mon", critical: 12, warning: 28, info: 45 },
  { name: "Tue", critical: 8, warning: 32, info: 52 },
  { name: "Wed", critical: 15, warning: 25, info: 38 },
  { name: "Thu", critical: 6, warning: 35, info: 48 },
  { name: "Fri", critical: 18, warning: 22, info: 42 },
  { name: "Sat", critical: 4, warning: 18, info: 35 },
  { name: "Sun", critical: 2, warning: 15, info: 28 },
]

const resourceUtilizationData = [
  { name: "CPU", value: 78, color: "#3b82f6" },
  { name: "Memory", value: 65, color: "#10b981" },
  { name: "Disk", value: 82, color: "#f59e0b" },
  { name: "Network", value: 45, color: "#8b5cf6" },
]

const uptimeData = [
  { name: "Jan", uptime: 99.9, downtime: 0.1 },
  { name: "Feb", uptime: 99.8, downtime: 0.2 },
  { name: "Mar", uptime: 99.95, downtime: 0.05 },
  { name: "Apr", uptime: 99.7, downtime: 0.3 },
  { name: "May", uptime: 99.85, downtime: 0.15 },
  { name: "Jun", uptime: 99.92, downtime: 0.08 },
]

const topServersData = [
  { name: "web-01.company.com", cpu: 92, memory: 88, alerts: 15, status: "warning" },
  { name: "db-primary.company.com", cpu: 78, memory: 82, alerts: 8, status: "healthy" },
  { name: "api-gateway.company.com", cpu: 85, memory: 75, alerts: 12, status: "warning" },
  { name: "cache-redis.company.com", cpu: 45, memory: 68, alerts: 3, status: "healthy" },
  { name: "worker-01.company.com", cpu: 72, memory: 78, alerts: 6, status: "healthy" },
]

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  const kpiData = [
    {
      title: "Total Servers",
      value: "102",
      change: "+5",
      changeType: "increase" as const,
      icon: Server,
      description: "Active servers",
    },
    {
      title: "Average Uptime",
      value: "99.8%",
      change: "+0.2%",
      changeType: "increase" as const,
      icon: TrendingUp,
      description: "Last 30 days",
    },
    {
      title: "Critical Alerts",
      value: "23",
      change: "-8",
      changeType: "decrease" as const,
      icon: AlertTriangle,
      description: "This week",
    },
    {
      title: "Response Time",
      value: "145ms",
      change: "-12ms",
      changeType: "decrease" as const,
      icon: Zap,
      description: "Average response",
    },
  ]

  const reportTemplates = [
    {
      name: "Infrastructure Health Report",
      description: "Comprehensive overview of system health and performance",
      icon: Activity,
      frequency: "Daily",
      lastGenerated: "2024-01-15T10:30:00Z",
    },
    {
      name: "Security Compliance Report",
      description: "Security posture and compliance status",
      icon: Shield,
      frequency: "Weekly",
      lastGenerated: "2024-01-14T09:00:00Z",
    },
    {
      name: "Resource Utilization Report",
      description: "CPU, memory, disk, and network usage analysis",
      icon: BarChart3,
      frequency: "Weekly",
      lastGenerated: "2024-01-14T08:30:00Z",
    },
    {
      name: "Container Performance Report",
      description: "Docker and Kubernetes performance metrics",
      icon: Container,
      frequency: "Daily",
      lastGenerated: "2024-01-15T07:45:00Z",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Infrastructure insights and performance analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          const isIncrease = kpi.changeType === "increase"
          const TrendIcon = isIncrease ? TrendingUp : TrendingDown
          const trendColor = isIncrease ? "text-green-600" : "text-red-600"

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <TrendIcon className={cn("h-3 w-3", trendColor)} />
                  <span className={trendColor}>{kpi.change}</span>
                  <span>{kpi.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="uptime">Uptime</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Server Performance Trends</CardTitle>
                <CardDescription>CPU, Memory, Disk, and Network usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={serverPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#10b981" name="Memory %" />
                    <Line type="monotone" dataKey="disk" stroke="#f59e0b" name="Disk %" />
                    <Line type="monotone" dataKey="network" stroke="#8b5cf6" name="Network %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current resource usage distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={resourceUtilizationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {resourceUtilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Trends</CardTitle>
              <CardDescription>Critical, warning, and info alerts over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={alertTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                  <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
                  <Bar dataKey="info" stackId="a" fill="#3b82f6" name="Info" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Resource Consumers</CardTitle>
              <CardDescription>Servers with highest resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServersData.map((server, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">{server.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {server.alerts} alerts • {server.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{server.cpu}%</div>
                        <div className="text-muted-foreground">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{server.memory}%</div>
                        <div className="text-muted-foreground">Memory</div>
                      </div>
                      <Badge variant={server.status === "healthy" ? "default" : "destructive"}>{server.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uptime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uptime Analysis</CardTitle>
              <CardDescription>System availability over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={uptimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[99, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="uptime"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Uptime %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Pre-configured reports for different stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template, index) => {
              const Icon = template.icon
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{template.frequency}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Last: {new Date(template.lastGenerated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Generate
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Clock className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
