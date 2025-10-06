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
  Container,
  Play,
  Square,
  RotateCcw,
  Trash2,
  Download,
  Settings,
  Eye,
  Terminal,
  FileText,
  Filter,
  Search,
  Plus,
  RefreshCw,
} from "lucide-react"

interface DockerContainer {
  id: string
  name: string
  image: string
  status: "running" | "stopped" | "paused" | "restarting"
  environment: "development" | "staging" | "production"
  ports: string[]
  created: string
  uptime: string
  cpuUsage: number
  memoryUsage: number
  memoryLimit: string
  networkRx: string
  networkTx: string
  volumes: string[]
  labels: Record<string, string>
  healthStatus?: "healthy" | "unhealthy" | "starting"
}

interface DockerImage {
  id: string
  repository: string
  tag: string
  size: string
  created: string
  inUse: boolean
  environment: string
  vulnerabilities: number
}

interface DockerVolume {
  name: string
  driver: string
  mountpoint: string
  size: string
  containers: string[]
  environment: string
}

interface DockerNetwork {
  id: string
  name: string
  driver: string
  scope: string
  containers: number
  environment: string
  subnet: string
  gateway: string
}

const mockContainers: DockerContainer[] = [
  {
    id: "c1a2b3c4d5e6",
    name: "nginx-proxy",
    image: "nginx:1.21-alpine",
    status: "running",
    environment: "production",
    ports: ["80:80", "443:443"],
    created: "2024-01-10T08:30:00Z",
    uptime: "5d 12h 30m",
    cpuUsage: 15.2,
    memoryUsage: 45.8,
    memoryLimit: "512MB",
    networkRx: "1.2GB",
    networkTx: "850MB",
    volumes: ["/etc/nginx/conf.d", "/var/log/nginx"],
    labels: { app: "proxy", tier: "frontend" },
    healthStatus: "healthy",
  },
  {
    id: "f7g8h9i0j1k2",
    name: "api-server",
    image: "node:18-alpine",
    status: "running",
    environment: "production",
    ports: ["3000:3000"],
    created: "2024-01-12T14:15:00Z",
    uptime: "3d 8h 45m",
    cpuUsage: 32.7,
    memoryUsage: 78.3,
    memoryLimit: "1GB",
    networkRx: "2.8GB",
    networkTx: "1.5GB",
    volumes: ["/app/logs", "/app/uploads"],
    labels: { app: "api", tier: "backend" },
    healthStatus: "healthy",
  },
  {
    id: "l3m4n5o6p7q8",
    name: "redis-cache",
    image: "redis:7-alpine",
    status: "running",
    environment: "production",
    ports: ["6379:6379"],
    created: "2024-01-08T10:00:00Z",
    uptime: "7d 14h 0m",
    cpuUsage: 8.1,
    memoryUsage: 25.4,
    memoryLimit: "256MB",
    networkRx: "450MB",
    networkTx: "320MB",
    volumes: ["/data"],
    labels: { app: "cache", tier: "database" },
    healthStatus: "healthy",
  },
  {
    id: "r9s0t1u2v3w4",
    name: "test-api",
    image: "node:18-alpine",
    status: "stopped",
    environment: "development",
    ports: ["3001:3000"],
    created: "2024-01-14T16:20:00Z",
    uptime: "0m",
    cpuUsage: 0,
    memoryUsage: 0,
    memoryLimit: "512MB",
    networkRx: "0B",
    networkTx: "0B",
    volumes: ["/app/logs"],
    labels: { app: "test-api", tier: "backend" },
  },
]

const mockImages: DockerImage[] = [
  {
    id: "img1",
    repository: "nginx",
    tag: "1.21-alpine",
    size: "23.4MB",
    created: "2024-01-10T08:00:00Z",
    inUse: true,
    environment: "production",
    vulnerabilities: 0,
  },
  {
    id: "img2",
    repository: "node",
    tag: "18-alpine",
    size: "165MB",
    created: "2024-01-12T14:00:00Z",
    inUse: true,
    environment: "production",
    vulnerabilities: 2,
  },
  {
    id: "img3",
    repository: "redis",
    tag: "7-alpine",
    size: "32.1MB",
    created: "2024-01-08T09:30:00Z",
    inUse: true,
    environment: "production",
    vulnerabilities: 0,
  },
]

const mockVolumes: DockerVolume[] = [
  {
    name: "nginx_conf",
    driver: "local",
    mountpoint: "/var/lib/docker/volumes/nginx_conf/_data",
    size: "1.2MB",
    containers: ["nginx-proxy"],
    environment: "production",
  },
  {
    name: "api_logs",
    driver: "local",
    mountpoint: "/var/lib/docker/volumes/api_logs/_data",
    size: "45.8MB",
    containers: ["api-server"],
    environment: "production",
  },
  {
    name: "redis_data",
    driver: "local",
    mountpoint: "/var/lib/docker/volumes/redis_data/_data",
    size: "128MB",
    containers: ["redis-cache"],
    environment: "production",
  },
]

const mockNetworks: DockerNetwork[] = [
  {
    id: "net1",
    name: "frontend",
    driver: "bridge",
    scope: "local",
    containers: 2,
    environment: "production",
    subnet: "172.18.0.0/16",
    gateway: "172.18.0.1",
  },
  {
    id: "net2",
    name: "backend",
    driver: "bridge",
    scope: "local",
    containers: 3,
    environment: "production",
    subnet: "172.19.0.0/16",
    gateway: "172.19.0.1",
  },
]

export function DockerManagement() {
  const [containers, setContainers] = useState<DockerContainer[]>(mockContainers)
  const [images, setImages] = useState<DockerImage[]>(mockImages)
  const [volumes, setVolumes] = useState<DockerVolume[]>(mockVolumes)
  const [networks, setNetworks] = useState<DockerNetwork[]>(mockNetworks)
  const [selectedEnvironment, setSelectedEnvironment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContainer, setSelectedContainer] = useState<DockerContainer | null>(null)

  const filteredContainers = containers.filter((container) => {
    const matchesEnv = selectedEnvironment === "all" || container.environment === selectedEnvironment
    const matchesSearch =
      container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      container.image.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesEnv && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "stopped":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "restarting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "staging":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "development":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getHealthColor = (health?: string) => {
    switch (health) {
      case "healthy":
        return "text-green-500"
      case "unhealthy":
        return "text-red-500"
      case "starting":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  const handleContainerAction = (containerId: string, action: string) => {
    console.log(`[v0] Container action: ${action} on ${containerId}`)
    // Simulate action
    setContainers((prev) =>
      prev.map((c) =>
        c.id === containerId
          ? { ...c, status: action === "start" ? "running" : action === "stop" ? "stopped" : c.status }
          : c,
      ),
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Docker Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage containers, images, volumes, and networks across environments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Deploy Container
          </Button>
        </div>
      </div>

      {/* Environment Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Environment & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
              <SelectTrigger>
                <SelectValue placeholder="Select Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search containers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Running: {containers.filter((c) => c.status === "running").length}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Stopped: {containers.filter((c) => c.status === "stopped").length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="containers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
        </TabsList>

        <TabsContent value="containers" className="space-y-6">
          <div className="grid gap-4">
            {filteredContainers.map((container) => (
              <Card key={container.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Container className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{container.name}</CardTitle>
                        <CardDescription>{container.image}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getEnvironmentColor(container.environment)}>{container.environment}</Badge>
                      <Badge className={getStatusColor(container.status)}>{container.status}</Badge>
                      {container.healthStatus && (
                        <div className={`w-2 h-2 rounded-full ${getHealthColor(container.healthStatus)}`} />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Resource Usage</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>CPU</span>
                            <span>{container.cpuUsage}%</span>
                          </div>
                          <Progress value={container.cpuUsage} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Memory</span>
                            <span>{container.memoryUsage}%</span>
                          </div>
                          <Progress value={container.memoryUsage} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Network</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>RX:</span>
                          <span>{container.networkRx}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TX:</span>
                          <span>{container.networkTx}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Ports</h4>
                      <div className="space-y-1">
                        {container.ports.map((port, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {port}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Uptime</h4>
                      <p className="text-sm font-mono">{container.uptime}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(container.created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {container.status === "running" ? (
                      <Button size="sm" variant="outline" onClick={() => handleContainerAction(container.id, "stop")}>
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleContainerAction(container.id, "start")}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart
                    </Button>
                    <Button size="sm" variant="outline">
                      <Terminal className="h-4 w-4 mr-2" />
                      Exec
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedContainer(container)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Docker Images</CardTitle>
              <CardDescription>Manage container images across environments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {images.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell className="font-medium">{image.repository}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{image.tag}</Badge>
                      </TableCell>
                      <TableCell>{image.size}</TableCell>
                      <TableCell>
                        <Badge className={getEnvironmentColor(image.environment)}>{image.environment}</Badge>
                      </TableCell>
                      <TableCell>
                        {image.vulnerabilities > 0 ? (
                          <Badge variant="destructive">{image.vulnerabilities} issues</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">Clean</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(image.created).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={image.inUse ? "default" : "secondary"}>
                          {image.inUse ? "In Use" : "Unused"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="volumes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Docker Volumes</CardTitle>
              <CardDescription>Persistent storage management</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Containers</TableHead>
                    <TableHead>Mountpoint</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volumes.map((volume) => (
                    <TableRow key={volume.name}>
                      <TableCell className="font-medium">{volume.name}</TableCell>
                      <TableCell>{volume.driver}</TableCell>
                      <TableCell>{volume.size}</TableCell>
                      <TableCell>
                        <Badge className={getEnvironmentColor(volume.environment)}>{volume.environment}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {volume.containers.map((container, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {container}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{volume.mountpoint}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="networks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Docker Networks</CardTitle>
              <CardDescription>Network configuration and management</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Subnet</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Containers</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networks.map((network) => (
                    <TableRow key={network.id}>
                      <TableCell className="font-medium">{network.name}</TableCell>
                      <TableCell>{network.driver}</TableCell>
                      <TableCell>{network.scope}</TableCell>
                      <TableCell>
                        <Badge className={getEnvironmentColor(network.environment)}>{network.environment}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{network.subnet}</TableCell>
                      <TableCell className="font-mono text-sm">{network.gateway}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{network.containers} containers</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
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
      </Tabs>

      {/* Container Detail Modal */}
      {selectedContainer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>Container Details: {selectedContainer.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedContainer(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{selectedContainer.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Image:</span>
                      <span>{selectedContainer.image}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedContainer.status)}>{selectedContainer.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Environment:</span>
                      <Badge className={getEnvironmentColor(selectedContainer.environment)}>
                        {selectedContainer.environment}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Resource Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Memory Limit:</span>
                      <span>{selectedContainer.memoryLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPU Usage:</span>
                      <span>{selectedContainer.cpuUsage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Memory Usage:</span>
                      <span>{selectedContainer.memoryUsage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Volumes</h4>
                <div className="space-y-1">
                  {selectedContainer.volumes.map((volume, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {volume}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Labels</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedContainer.labels).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
