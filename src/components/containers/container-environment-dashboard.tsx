"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Container,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  Settings,
  Eye,
  Plus,
  RefreshCw,
  Filter,
  Search,
  Layers,
  Box,
  Database,
} from "lucide-react"

interface ContainerEnvironment {
  id: string
  name: string
  platform: "Docker" | "Kubernetes" | "Podman"
  connectionType: "local" | "remote" | "socket" | "tcp"
  status: "Up" | "Down" | "Connecting" | "Error"
  lastConnected: string
  agentVersion: string
  endpoint: string
  group: string
  tags: string[]
  stats: {
    stacks: number
    containers: number
    runningContainers: number
    stoppedContainers: number
    pausedContainers: number
    errorContainers: number
    volumes: number
    images: number
    cpu: number
    memory: string
    networks: number
  }
  resources: {
    cpuCores: number
    totalMemory: string
    usedMemory: string
    diskSpace: string
    networkInterfaces: number
  }
}

interface ContainerStack {
  id: string
  name: string
  environment: string
  status: "running" | "stopped" | "error"
  services: number
  containers: number
  created: string
  updated: string
  composeFile: string
}

interface ContainerEvent {
  id: string
  timestamp: string
  type: "container" | "image" | "volume" | "network" | "stack"
  action: "create" | "start" | "stop" | "destroy" | "pull" | "push" | "mount" | "unmount"
  resource: string
  environment: string
  status: "success" | "error" | "warning"
  message: string
  details?: Record<string, any>
}

const mockEnvironments: ContainerEnvironment[] = [
  {
    id: "env1",
    name: "docker environment",
    platform: "Docker",
    connectionType: "local",
    status: "Up",
    lastConnected: "2025-09-21 23:33:00",
    agentVersion: "28.3.3",
    endpoint: "/var/run/docker.sock",
    group: "Unassigned",
    tags: [],
    stats: {
      stacks: 2,
      containers: 8,
      runningContainers: 6,
      stoppedContainers: 2,
      pausedContainers: 0,
      errorContainers: 0,
      volumes: 20,
      images: 12,
      cpu: 12,
      memory: "33.2 GB RAM",
      networks: 5,
    },
    resources: {
      cpuCores: 12,
      totalMemory: "33.2 GB",
      usedMemory: "18.7 GB",
      diskSpace: "500 GB",
      networkInterfaces: 3,
    },
  },
  {
    id: "env2",
    name: "k8s-production",
    platform: "Kubernetes",
    connectionType: "remote",
    status: "Up",
    lastConnected: "2025-09-21 23:30:15",
    agentVersion: "1.28.2",
    endpoint: "https://k8s-prod.company.com:6443",
    group: "Production",
    tags: ["production", "critical"],
    stats: {
      stacks: 15,
      containers: 45,
      runningContainers: 42,
      stoppedContainers: 2,
      pausedContainers: 0,
      errorContainers: 1,
      volumes: 35,
      images: 28,
      cpu: 24,
      memory: "128 GB RAM",
      networks: 8,
    },
    resources: {
      cpuCores: 24,
      totalMemory: "128 GB",
      usedMemory: "89.3 GB",
      diskSpace: "2 TB",
      networkInterfaces: 4,
    },
  },
  {
    id: "env3",
    name: "staging-cluster",
    platform: "Kubernetes",
    connectionType: "remote",
    status: "Up",
    lastConnected: "2025-09-21 23:25:42",
    agentVersion: "1.28.2",
    endpoint: "https://k8s-staging.company.com:6443",
    group: "Staging",
    tags: ["staging", "testing"],
    stats: {
      stacks: 8,
      containers: 24,
      runningContainers: 20,
      stoppedContainers: 4,
      pausedContainers: 0,
      errorContainers: 0,
      volumes: 18,
      images: 15,
      cpu: 8,
      memory: "64 GB RAM",
      networks: 6,
    },
    resources: {
      cpuCores: 8,
      totalMemory: "64 GB",
      usedMemory: "32.1 GB",
      diskSpace: "1 TB",
      networkInterfaces: 2,
    },
  },
]

const mockStacks: ContainerStack[] = [
  {
    id: "stack1",
    name: "web-application",
    environment: "docker environment",
    status: "running",
    services: 4,
    containers: 4,
    created: "2024-01-10T08:00:00Z",
    updated: "2024-01-15T14:30:00Z",
    composeFile: "docker-compose.yml",
  },
  {
    id: "stack2",
    name: "monitoring-stack",
    environment: "docker environment",
    status: "running",
    services: 6,
    containers: 6,
    created: "2024-01-08T10:00:00Z",
    updated: "2024-01-12T16:45:00Z",
    composeFile: "monitoring-compose.yml",
  },
]

const mockEvents: ContainerEvent[] = [
  {
    id: "event1",
    timestamp: "2025-09-21T23:33:00Z",
    type: "container",
    action: "start",
    resource: "nginx-proxy",
    environment: "docker environment",
    status: "success",
    message: "Container nginx-proxy started successfully",
  },
  {
    id: "event2",
    timestamp: "2025-09-21T23:30:15Z",
    type: "image",
    action: "pull",
    resource: "nginx:1.21-alpine",
    environment: "docker environment",
    status: "success",
    message: "Image nginx:1.21-alpine pulled successfully",
  },
  {
    id: "event3",
    timestamp: "2025-09-21T23:25:42Z",
    type: "stack",
    action: "create",
    resource: "web-application",
    environment: "docker environment",
    status: "success",
    message: "Stack web-application deployed successfully",
  },
]

export function ContainerEnvironmentDashboard() {
  const [environments] = useState<ContainerEnvironment[]>(mockEnvironments)
  const [] = useState<ContainerStack[]>(mockStacks)
  const [] = useState<ContainerEvent[]>(mockEvents)
  const [] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredEnvironments = environments.filter((env) => {
    const matchesSearch =
      env.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      env.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      env.group.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Up":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Down":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Connecting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Docker":
        return <Container className="h-4 w-4" />
      case "Kubernetes":
        return <Box className="h-4 w-4" />
      case "Podman":
        return <Server className="h-4 w-4" />
      default:
        return <Container className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Container Environments</h1>
          <p className="text-muted-foreground mt-2">
            Click on an environment to manage containers, stacks, and resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Environment
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
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
                placeholder="Search environments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="platform">Platform</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="lastConnected">Last Connected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Connected: {environments.filter((e) => e.status === "Up").length}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Offline: {environments.filter((e) => e.status === "Down").length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment List */}
      <Card>
        <CardHeader>
          <CardTitle>Environments</CardTitle>
          <CardDescription>Manage your container environments and platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Connection Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead>Agent Version</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnvironments.map((env) => (
                <TableRow key={env.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(env.platform)}
                      <div>
                        <p className="font-medium">{env.name}</p>
                        <p className="text-sm text-muted-foreground">{env.platform}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{env.connectionType}</p>
                      <p className="text-xs text-muted-foreground font-mono">{env.endpoint}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getStatusColor(env.status)}>{env.status}</Badge>
                      <p className="text-xs text-muted-foreground">{env.lastConnected}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {env.tags.length > 0 ? (
                        env.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No tags</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">Group: {env.group}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-mono">{env.agentVersion}</p>
                  </TableCell>
                  <TableCell>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        <span>{env.stats.stacks} stacks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Container className="h-3 w-3" />
                        <span>{env.stats.containers} containers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{env.stats.runningContainers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>{env.stats.stoppedContainers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>{env.stats.pausedContainers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span>{env.stats.errorContainers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        <span>{env.stats.volumes} volumes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        <span>{env.stats.images} images</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        <span>{env.stats.cpu} CPU</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MemoryStick className="h-3 w-3" />
                        <span>{env.stats.memory}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stacks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Container Stacks
            </CardTitle>
            <CardDescription>Docker Compose and Kubernetes deployments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStacks.map((stack) => (
                <div key={stack.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        stack.status === "running"
                          ? "bg-green-500"
                          : stack.status === "stopped"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{stack.name}</p>
                      <p className="text-sm text-muted-foreground">{stack.environment}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      <span>{stack.services} services</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Container className="w-4 h-4" />
                      <span>{stack.containers} containers</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Events
            </CardTitle>
            <CardDescription>Latest container and infrastructure events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      event.status === "success"
                        ? "bg-green-500"
                        : event.status === "error"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.action}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{event.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{event.resource}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Events
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
