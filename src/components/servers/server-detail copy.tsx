"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Play,
  Square,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  Terminal,
  Container,
  Package,
  Activity,
  Clock,
  Users,
  FileText,
  Eye,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Image,
  GitBranch,
  Tag,
  Upload,
  Shield,
  Bell,
  Filter,
  Calendar,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ServerTerminal } from "./[id]/terminal"

interface ServerDetailProps {
  serverId: string
  onBack: () => void
  onConfigureServer?: (serverId: string) => void
}

interface ContainerInfo {
  id: string
  name: string
  image: string
  tag: string
  status: "running" | "stopped" | "paused" | "restarting"
  created: string
  ports: string[]
  cpu: number
  memory: number
  networks: string[]
  volumes: string[]
  restartPolicy: string
  healthStatus?: "healthy" | "unhealthy" | "starting"
}

interface RegistryImage {
  name: string
  tag: string
  size: string
  created: string
  architecture: string
  layers: number
  vulnerabilities: { critical: number; high: number; medium: number; low: number }
  lastPulled?: string
  downloadCount: number
}

interface EventLog {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "critical"
  category: "system" | "security" | "container" | "network" | "storage"
  source: string
  message: string
  details?: any
  acknowledged: boolean
}

interface ConfigTemplate {
  id: string
  name: string
  description: string
  type: "nginx" | "apache" | "docker-compose" | "kubernetes" | "systemd"
  version: string
  content: string
  variables: Record<string, any>
  tags: string[]
}

export function ServerDetail({ serverId, onBack,onConfigureServer }: ServerDetailProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null)
  const [eventFilter, setEventFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showTerminal, setShowTerminal] = useState(false)

  const handleProcessAction = async (pid: number, serviceName: string, action: string) => {
    setIsLoading(true)
    console.log(`[v0] Process ${action} for ${serviceName} (PID: ${pid})`)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const server = {
    id: serverId,
    hostname: `server-${serverId}`,
    ip: "192.168.1.100",
    status: "online",
    location: "Data Center A",
    os: "Ubuntu 22.04 LTS",
    kernel: "5.15.0-78-generic",
    architecture: "x86_64",
    uptime: "45 days, 12 hours",
    bootTime: "2023-12-01T08:30:00Z",
    timezone: "UTC",
    cpu: {
      usage: 45,
      cores: 16,
      threads: 32,
      model: "Intel Xeon E5-2686 v4",
      frequency: "2.3 GHz",
      cache: "45 MB",
      temperature: 65,
      loadAverage: [1.2, 1.5, 1.8]
    },
    memory: {
      usage: 68,
      total: 64,
      used: 43.5,
      available: 20.5,
      buffers: 2.1,
      cached: 15.2,
      swap: { total: 8, used: 0.5, free: 7.5 }
    },
    disk: {
      usage: 72,
      total: 1000,
      used: 720,
      available: 280,
      inodes: { used: 1250000, total: 2000000 }
    },
    network: {
      in: 125.5,
      out: 89.2,
      connections: 1247,
      listening: 15
    },
    power: {
      consumption: 285,
      efficiency: 92,
      temperature: 42
    }
  }

  const mockContainers: ContainerInfo[] = [
    {
      id: "c1a2b3c4",
      name: "nginx-proxy",
      image: "nginx",
      tag: "1.24-alpine",
      status: "running",
      created: "2024-01-10T08:30:00Z",
      ports: ["80:80", "443:443"],
      cpu: 5.2,
      memory: 128,
      networks: ["bridge", "proxy-net"],
      volumes: ["/etc/nginx/conf.d", "/var/log/nginx"],
      restartPolicy: "always",
      healthStatus: "healthy"
    },
    {
      id: "d5e6f7g8",
      name: "api-server",
      image: "node",
      tag: "18-alpine",
      status: "running",
      created: "2024-01-08T14:20:00Z",
      ports: ["3000:3000"],
      cpu: 15.8,
      memory: 512,
      networks: ["bridge", "api-net"],
      volumes: ["/app/data", "/app/logs"],
      restartPolicy: "unless-stopped",
      healthStatus: "healthy"
    },
    {
      id: "h9i0j1k2",
      name: "redis-cache",
      image: "redis",
      tag: "7-alpine",
      status: "running",
      created: "2024-01-05T10:15:00Z",
      ports: ["6379:6379"],
      cpu: 2.1,
      memory: 64,
      networks: ["bridge"],
      volumes: ["/data"],
      restartPolicy: "always",
      healthStatus: "healthy"
    },
    {
      id: "l3m4n5o6",
      name: "postgres-db",
      image: "postgres",
      tag: "15-alpine",
      status: "stopped",
      created: "2024-01-03T16:45:00Z",
      ports: ["5432:5432"],
      cpu: 0,
      memory: 0,
      networks: ["bridge", "db-net"],
      volumes: ["/var/lib/postgresql/data"],
      restartPolicy: "unless-stopped"
    }
  ]

  const mockImages: RegistryImage[] = [
    {
      name: "nginx",
      tag: "1.24-alpine",
      size: "23.5 MB",
      created: "2024-01-15T10:00:00Z",
      architecture: "amd64",
      layers: 6,
      vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5 },
      lastPulled: "2024-01-10T08:30:00Z",
      downloadCount: 1250000
    },
    {
      name: "node",
      tag: "18-alpine",
      size: "120.8 MB",
      created: "2024-01-12T14:30:00Z",
      architecture: "amd64",
      layers: 8,
      vulnerabilities: { critical: 1, high: 2, medium: 8, low: 12 },
      lastPulled: "2024-01-08T14:20:00Z",
      downloadCount: 890000
    },
    {
      name: "redis",
      tag: "7-alpine",
      size: "28.9 MB",
      created: "2024-01-14T09:15:00Z",
      architecture: "amd64",
      layers: 5,
      vulnerabilities: { critical: 0, high: 0, medium: 2, low: 4 },
      lastPulled: "2024-01-05T10:15:00Z",
      downloadCount: 2100000
    },
    {
      name: "postgres",
      tag: "15-alpine",
      size: "215.4 MB",
      created: "2024-01-11T16:20:00Z",
      architecture: "amd64",
      layers: 12,
      vulnerabilities: { critical: 0, high: 1, medium: 5, low: 8 },
      lastPulled: "2024-01-03T16:45:00Z",
      downloadCount: 670000
    }
  ]



  const mockEvents: EventLog[] = [
    {
      id: "evt_001",
      timestamp: "2024-01-15T10:45:00Z",
      level: "info",
      category: "container",
      source: "Docker",
      message: "Container nginx-proxy started successfully",
      details: { containerId: "c1a2b3c4", action: "start" },
      acknowledged: false
    },
    {
      id: "evt_002",
      timestamp: "2024-01-15T10:42:00Z",
      level: "warning",
      category: "system",
      source: "System Monitor",
      message: "High CPU usage detected (85%)",
      details: { threshold: 80, current: 85, duration: "5 minutes" },
      acknowledged: false
    },
    {
      id: "evt_003",
      timestamp: "2024-01-15T10:30:00Z",
      level: "error",
      category: "security",
      source: "SSH",
      message: "Failed login attempt from 192.168.1.50",
      details: { ip: "192.168.1.50", user: "root", attempts: 3 },
      acknowledged: true
    },
    {
      id: "evt_004",
      timestamp: "2024-01-15T10:15:00Z",
      level: "critical",
      category: "storage",
      source: "File System",
      message: "Disk usage critical on /var partition (95%)",
      details: { partition: "/var", usage: 95, threshold: 90 },
      acknowledged: false
    },
    {
      id: "evt_005",
      timestamp: "2024-01-15T09:58:00Z",
      level: "info",
      category: "network",
      source: "Network Monitor",
      message: "Network interface eth0 link up",
      details: { interface: "eth0", speed: "1000 Mbps" },
      acknowledged: true
    }
  ]

  const mockConfigTemplates: ConfigTemplate[] = [
    {
      id: "tpl_001",
      name: "Nginx Reverse Proxy",
      description: "Standard nginx reverse proxy configuration",
      type: "nginx",
      version: "1.0.0",
      content: `server {
    listen 80;
    server_name {{domain}};
    
    location / {
        proxy_pass http://{{upstream_host}}:{{upstream_port}};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
      variables: {
        domain: "example.com",
        upstream_host: "localhost",
        upstream_port: "3000"
      },
      tags: ["nginx", "proxy", "web"]
    },
    {
      id: "tpl_002",
      name: "Docker Compose Stack",
      description: "Multi-service docker compose configuration",
      type: "docker-compose",
      version: "2.1.0",
      content: `version: '3.8'
services:
  app:
    image: {{app_image}}:{{app_version}}
    ports:
      - "{{app_port}}:3000"
    environment:
      - NODE_ENV={{environment}}
  
  db:
    image: postgres:{{db_version}}
    environment:
      - POSTGRES_DB={{db_name}}
      - POSTGRES_USER={{db_user}}`,
      variables: {
        app_image: "node",
        app_version: "18-alpine",
        app_port: "3000",
        environment: "production",
        db_version: "15-alpine",
        db_name: "myapp",
        db_user: "postgres"
      },
      tags: ["docker", "compose", "stack"]
    }
  ]

  const handleAction = async (action: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    console.log(`[v0] Server action: ${action}`)
  }

  const handleContainerAction = async (containerId: string, action: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log(`[v0] Container ${containerId} action: ${action}`)
  }

  const acknowledgeEvent = (eventId: string) => {
    console.log(`[v0] Acknowledging event: ${eventId}`)
  }

  const deployTemplate = (templateId: string) => {
    console.log(`[v0] Deploying template: ${templateId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "running":
      case "active":
      case "up":
      case "healthy":
        return "bg-green-500"
      case "offline":
      case "stopped":
      case "down":
      case "unhealthy":
        return "bg-red-500"
      case "warning":
      case "paused":
      case "starting":
        return "bg-yellow-500"
      case "restarting":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
      case "running":
      case "active":
      case "up":
      case "healthy":
        return <CheckCircle className="h-4 w-4" />
      case "offline":
      case "stopped":
      case "down":
      case "unhealthy":
        return <XCircle className="h-4 w-4" />
      case "warning":
      case "paused":
      case "starting":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-3 w-3 text-red-500" />
    if (current < previous) return <TrendingDown className="h-3 w-3 text-green-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 80) return "text-red-500"
    if (temp > 70) return "text-yellow-500"
    return "text-green-500"
  }

  const getEventLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "error":
        return "bg-red-50 text-red-700 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getVulnerabilityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const filteredEvents = mockEvents.filter(event => {
    const matchesFilter = eventFilter === "all" || event.level === eventFilter
    const matchesSearch = event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.source.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Servers
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{server.hostname}</h1>
            <p className="text-muted-foreground">
              {server.ip} • {server.location} • {server.os}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getStatusColor(server.status)} text-white border-0`}>
            {getStatusIcon(server.status)}
            <span className="ml-1 capitalize">{server.status}</span>
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleAction("restart")} disabled={isLoading}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction("stop")} disabled={isLoading}>
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction("start")} disabled={isLoading}>
          <Play className="h-4 w-4 mr-2" />
          Start
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction("update")} disabled={isLoading}>
          <Download className="h-4 w-4 mr-2" />
          Update
        </Button>
        <Button variant="outline" size="sm" onClick={() =>   setShowTerminal(true) } disabled={isLoading}>
          <Terminal className="h-4 w-4 mr-2" />
          Terminal
        </Button>
        <Button variant="outline" size="sm" onClick={() => onConfigureServer?.(serverId)} disabled={isLoading}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="registry">Registry</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Resource Usage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <div className="flex items-center gap-2">
                  <Thermometer className={`h-4 w-4 ${getTemperatureColor(server.cpu.temperature)}`} />
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {server.cpu.usage}%
                  {getTrendIcon(server.cpu.usage, 40)}
                </div>
                <Progress value={server.cpu.usage} className="mt-2" />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {server.cpu.cores} cores • {server.cpu.threads} threads
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {server.cpu.temperature}°C • Load: {server.cpu.loadAverage.join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory</CardTitle>
                <MemoryStick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {server.memory.usage}%
                  {getTrendIcon(server.memory.usage, 65)}
                </div>
                <Progress value={server.memory.usage} className="mt-2" />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {server.memory.used}GB / {server.memory.total}GB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cached: {server.memory.cached}GB • Swap: {server.memory.swap.used}GB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {server.disk.usage}%
                  {getTrendIcon(server.disk.usage, 70)}
                </div>
                <Progress value={server.disk.usage} className="mt-2" />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {server.disk.used}GB / {server.disk.total}GB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Inodes: {((server.disk.inodes.used / server.disk.inodes.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {server.network.in} MB/s
                  {getTrendIcon(server.network.in, 120)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Out: {server.network.out} MB/s
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Connections: {server.network.connections}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Listening: {server.network.listening} ports
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Hostname</Label>
                  <p className="text-sm text-muted-foreground">{server.hostname}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Kernel</Label>
                  <p className="text-sm text-muted-foreground">{server.kernel}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Architecture</Label>
                  <p className="text-sm text-muted-foreground">{server.architecture}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Uptime</Label>
                  <p className="text-sm text-muted-foreground">{server.uptime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="containers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Container Management</h3>
              <p className="text-sm text-muted-foreground">Manage Docker containers and their lifecycle</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Deploy Container
            </Button>
          </div>

          <div className="grid gap-4">
            {mockContainers.map((container) => (
              <Card key={container.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Container className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">{container.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {container.image}:{container.tag}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(container.status)} text-white border-0`}>
                        {getStatusIcon(container.status)}
                        <span className="ml-1 capitalize">{container.status}</span>
                      </Badge>
                      {container.healthStatus && (
                        <Badge variant="outline" className={getStatusColor(container.healthStatus)}>
                          {container.healthStatus}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">CPU Usage</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={container.cpu} className="flex-1" />
                        <span className="text-sm font-medium">{container.cpu}%</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Memory</Label>
                      <p className="text-sm font-medium">{container.memory} MB</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Ports</Label>
                      <div className="flex gap-1">
                        {container.ports.map((port, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {port}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Created</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(container.created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContainerAction(container.id, "start")}
                      disabled={container.status === "running"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContainerAction(container.id, "stop")}
                      disabled={container.status === "stopped"}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContainerAction(container.id, "restart")}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart
                    </Button>
                    <Button size="sm" variant="outline">
                      <Terminal className="h-4 w-4 mr-2" />
                      Shell
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registry" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Container Registry</h3>
              <p className="text-sm text-muted-foreground">Manage container images and security scanning</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Push Image
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Scan All
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Container Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Image</th>
                      <th className="text-left p-2 font-medium">Tag</th>
                      <th className="text-left p-2 font-medium">Size</th>
                      <th className="text-left p-2 font-medium">Architecture</th>
                      <th className="text-left p-2 font-medium">Vulnerabilities</th>
                      <th className="text-left p-2 font-medium">Last Pulled</th>
                      <th className="text-left p-2 font-medium">Downloads</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockImages.map((image, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            <span className="font-medium">{image.name}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">{image.tag}</Badge>
                        </td>
                        <td className="p-2 text-sm">{image.size}</td>
                        <td className="p-2 text-sm">{image.architecture}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            {image.vulnerabilities.critical > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                C: {image.vulnerabilities.critical}
                              </Badge>
                            )}
                            {image.vulnerabilities.high > 0 && (
                              <Badge className="bg-orange-500 text-white text-xs">
                                H: {image.vulnerabilities.high}
                              </Badge>
                            )}
                            {image.vulnerabilities.medium > 0 && (
                              <Badge className="bg-yellow-500 text-white text-xs">
                                M: {image.vulnerabilities.medium}
                              </Badge>
                            )}
                            {image.vulnerabilities.low > 0 && (
                              <Badge className="bg-green-500 text-white text-xs">
                                L: {image.vulnerabilities.low}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-2 text-sm">
                          {image.lastPulled ? new Date(image.lastPulled).toLocaleDateString() : "Never"}
                        </td>
                        <td className="p-2 text-sm">{image.downloadCount.toLocaleString()}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Real-time Event Monitoring</h3>
              <p className="text-sm text-muted-foreground">Monitor system events and alerts in real-time</p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Event Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border ${getEventLevelColor(event.level)} ${event.acknowledged ? 'opacity-60' : ''
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(event.level)} text-white border-0 text-xs`}>
                            {event.level.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                          <span className="text-sm font-medium">{event.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                          {!event.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acknowledgeEvent(event.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mb-2">{event.message}</p>
                      {event.details && (
                        <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                          <pre>{JSON.stringify(event.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Configuration Management</h3>
              <p className="text-sm text-muted-foreground">Deploy and manage server configuration templates</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid gap-4">
            {mockConfigTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{template.type}</Badge>
                      <Badge variant="outline">v{template.version}</Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex gap-1 mt-1">
                      {template.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-sm font-medium">Configuration Preview</Label>
                    <div className="bg-gray-50 p-3 rounded mt-1 text-xs font-mono">
                      <pre className="overflow-x-auto">{template.content.substring(0, 200)}...</pre>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => deployTemplate(template.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Deploy
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Performance Monitoring</h3>
              <p className="text-sm text-muted-foreground">Real-time system performance metrics and trends</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Time Range
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">CPU Load Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">1 min</span>
                    <span className="text-sm font-medium">{server.cpu.loadAverage[0]}</span>
                  </div>
                  <Progress value={server.cpu.loadAverage[0] * 10} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">5 min</span>
                    <span className="text-sm font-medium">{server.cpu.loadAverage[1]}</span>
                  </div>
                  <Progress value={server.cpu.loadAverage[1] * 10} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">15 min</span>
                    <span className="text-sm font-medium">{server.cpu.loadAverage[2]}</span>
                  </div>
                  <Progress value={server.cpu.loadAverage[2] * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Memory Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Used</span>
                    <span className="text-sm font-medium">{server.memory.used}GB</span>
                  </div>
                  <Progress value={(server.memory.used / server.memory.total) * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Cached</span>
                    <span className="text-sm font-medium">{server.memory.cached}GB</span>
                  </div>
                  <Progress value={(server.memory.cached / server.memory.total) * 100} className="h-2 bg-blue-200" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Swap</span>
                    <span className="text-sm font-medium">{server.memory.swap.used}GB</span>
                  </div>
                  <Progress value={(server.memory.swap.used / server.memory.swap.total) * 100} className="h-2 bg-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Network Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Incoming</span>
                    <span className="text-sm font-medium">{server.network.in} MB/s</span>
                  </div>
                  <Progress value={server.network.in / 2} className="h-2 bg-green-200" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Outgoing</span>
                    <span className="text-sm font-medium">{server.network.out} MB/s</span>
                  </div>
                  <Progress value={server.network.out / 2} className="h-2 bg-blue-200" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Connections</span>
                    <span className="text-sm font-medium">{server.network.connections}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Running Processes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">PID</th>
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">User</th>
                      <th className="text-left p-2 font-medium">CPU %</th>
                      <th className="text-left p-2 font-medium">Memory %</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Command</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { pid: 1234, name: "dockerd", user: "root", cpu: 3.2, memory: 2.1, status: "running", command: "/usr/bin/dockerd" },
                      { pid: 5678, name: "nginx", user: "www-data", cpu: 1.5, memory: 0.8, status: "running", command: "nginx: master process" },
                      { pid: 9012, name: "postgres", user: "postgres", cpu: 8.7, memory: 5.2, status: "running", command: "/usr/lib/postgresql/14/bin/postgres" },
                      { pid: 3456, name: "sshd", user: "root", cpu: 0.1, memory: 0.2, status: "running", command: "/usr/sbin/sshd -D" },
                      { pid: 7890, name: "systemd", user: "root", cpu: 0.3, memory: 0.5, status: "running", command: "/lib/systemd/systemd" }
                    ].map((process) => (
                      <tr key={process.pid} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-sm">{process.pid}</td>
                        <td className="p-2 font-medium">{process.name}</td>
                        <td className="p-2 text-sm">{process.user}</td>
                        <td className="p-2 text-sm">{process.cpu}%</td>
                        <td className="p-2 text-sm">{process.memory}%</td>
                        <td className="p-2">
                          <Badge className={`${getStatusColor(process.status)} text-white border-0 text-xs`}>
                            {process.status}
                          </Badge>
                        </td>
                        <td className="p-2 font-mono text-xs truncate max-w-xs">
                          {process.command}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProcessAction(process.pid, process.name, "restart")}
                              className="h-6 px-2 text-xs"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Restart
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleProcessAction(process.pid, process.name, "kill")}
                              className="h-6 px-2 text-xs"
                            >
                              <Square className="h-3 w-3 mr-1" />
                              Kill
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Terminal Modal */}
      <ServerTerminal
        serverId={serverId}
        serverHostname={server.hostname}
        serverIp={server.ip}
        isOpen={showTerminal}
        onClose={() => setShowTerminal(false)}
      />
    </div>
  )
}