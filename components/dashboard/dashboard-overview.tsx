"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Server, Cpu, MemoryStick, AlertTriangle, CheckCircle, TrendingUp, Container } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for demonstration
const serverStats = {
  total: 102,
  healthy: 98,
  warning: 3,
  critical: 1,
  offline: 0,
}

const resourceData = [
  { time: "00:00", cpu: 45, memory: 62, disk: 78, network: 23 },
  { time: "04:00", cpu: 52, memory: 58, disk: 79, network: 31 },
  { time: "08:00", cpu: 68, memory: 71, disk: 80, network: 45 },
  { time: "12:00", cpu: 75, memory: 73, disk: 81, network: 52 },
  { time: "16:00", cpu: 82, memory: 76, disk: 82, network: 48 },
  { time: "20:00", cpu: 71, memory: 69, disk: 83, network: 38 },
  { time: "24:00", cpu: 58, memory: 64, disk: 84, network: 29 },
]

const topServers = [
  { name: "web-prod-01", cpu: 89, memory: 76, status: "warning", location: "US-East" },
  { name: "db-primary-02", cpu: 72, memory: 84, status: "healthy", location: "US-West" },
  { name: "api-gateway-03", cpu: 68, memory: 71, status: "healthy", location: "EU-Central" },
  { name: "cache-redis-01", cpu: 45, memory: 92, status: "critical", location: "Asia-Pacific" },
  { name: "worker-queue-05", cpu: 56, memory: 63, status: "healthy", location: "US-East" },
]

const alerts = [
  {
    id: 1,
    type: "critical",
    message: "High memory usage on cache-redis-01",
    time: "2 min ago",
    server: "cache-redis-01",
  },
  {
    id: 2,
    type: "warning",
    message: "CPU threshold exceeded on web-prod-01",
    time: "15 min ago",
    server: "web-prod-01",
  },
  {
    id: 3,
    type: "warning",
    message: "Disk space low on backup-storage-02",
    time: "1 hour ago",
    server: "backup-storage-02",
  },
  {
    id: 4,
    type: "info",
    message: "Scheduled maintenance completed",
    time: "2 hours ago",
    server: "maintenance-window",
  },
]

const containerStats = [
  { name: "Running", value: 245, color: "#10b981" },
  { name: "Stopped", value: 12, color: "#6b7280" },
  { name: "Failed", value: 3, color: "#ef4444" },
]

export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverStats.total}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+2 from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Servers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{serverStats.healthy}</div>
            <div className="text-xs text-muted-foreground">
              {((serverStats.healthy / serverStats.total) * 100).toFixed(1)}% uptime
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Containers</CardTitle>
            <Container className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>12 deployed today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4</div>
            <div className="text-xs text-muted-foreground">1 critical, 3 warnings</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage (24h)</CardTitle>
            <CardDescription>CPU, Memory, Disk, and Network utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#d97706" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#ec4899" strokeWidth={2} name="Memory %" />
                <Line type="monotone" dataKey="disk" stroke="#10b981" strokeWidth={2} name="Disk %" />
                <Line type="monotone" dataKey="network" stroke="#6366f1" strokeWidth={2} name="Network %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Container Status */}
        <Card>
          <CardHeader>
            <CardTitle>Container Status</CardTitle>
            <CardDescription>Current container distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={containerStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {containerStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {containerStats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span className="text-sm">
                    {stat.name}: {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Servers by Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Top Servers by Resource Usage</CardTitle>
            <CardDescription>Servers requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServers.map((server, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        server.status === "healthy"
                          ? "bg-green-500"
                          : server.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{server.name}</p>
                      <p className="text-sm text-muted-foreground">{server.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Cpu className="w-4 h-4" />
                      <span>{server.cpu}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MemoryStick className="w-4 h-4" />
                      <span>{server.memory}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "critical"
                        ? "bg-red-500"
                        : alert.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{alert.server}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
