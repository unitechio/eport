"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Server,
  Database,
  Shield,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  Lock,
  Unlock,
  Copy,
  Search,
  Filter,
  Package,
  Activity,
  Network,
} from "lucide-react"

interface RegistryConfig {
  id: string
  name: string
  url: string
  type: "docker-hub" | "private" | "gcr" | "ecr" | "acr"
  username: string
  authenticated: boolean
  insecure: boolean
  default: boolean
  status: "connected" | "disconnected" | "error"
  imageCount: number
  lastSync: string
}

interface RegistryImage {
  id: string
  name: string
  tag: string
  registry: string
  size: string
  created: string
  digest: string
  pulls: number
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
  layers: number
  architecture: string
  os: string
}

interface HostInfo {
  hostname: string
  os: string
  osVersion: string
  kernel: string
  architecture: string
  cpuCores: number
  memory: string
  disk: string
  dockerVersion: string
  dockerRootDir: string
  storageDriver: string
  loggingDriver: string
  cgroupDriver: string
  cgroupVersion: string
  runtimes: string[]
  plugins: string[]
  swarmMode: boolean
  nodeRole: string
  uptime: string
  containersRunning: number
  containersPaused: number
  containersStopped: number
  images: number
  serverVersion: string
}

interface HostResource {
  cpu: {
    usage: number
    cores: number
    model: string
  }
  memory: {
    total: string
    used: string
    free: string
    usagePercent: number
  }
  disk: {
    total: string
    used: string
    free: string
    usagePercent: number
  }
  network: {
    rx: string
    tx: string
    interfaces: number
  }
}

export function ContainerRegistryHost() {
  const [activeTab, setActiveTab] = useState("registries")
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [registries, setRegistries] = useState<RegistryConfig[]>([
    {
      id: "1",
      name: "Docker Hub",
      url: "https://registry-1.docker.io",
      type: "docker-hub",
      username: "mycompany",
      authenticated: true,
      insecure: false,
      default: true,
      status: "connected",
      imageCount: 45,
      lastSync: "2024-01-15T14:30:00Z",
    },
    {
      id: "2",
      name: "Private Registry",
      url: "registry.company.com:5000",
      type: "private",
      username: "admin",
      authenticated: true,
      insecure: false,
      default: false,
      status: "connected",
      imageCount: 128,
      lastSync: "2024-01-15T14:25:00Z",
    },
    {
      id: "3",
      name: "Google Container Registry",
      url: "gcr.io/my-project",
      type: "gcr",
      username: "service-account",
      authenticated: true,
      insecure: false,
      default: false,
      status: "connected",
      imageCount: 67,
      lastSync: "2024-01-15T14:20:00Z",
    },
  ])

  const [registryImages, setRegistryImages] = useState<RegistryImage[]>([
    {
      id: "1",
      name: "nginx",
      tag: "latest",
      registry: "Docker Hub",
      size: "142 MB",
      created: "2024-01-10T10:00:00Z",
      digest: "sha256:abc123...",
      pulls: 1250,
      vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5 },
      layers: 7,
      architecture: "amd64",
      os: "linux",
    },
    {
      id: "2",
      name: "postgres",
      tag: "14-alpine",
      registry: "Docker Hub",
      size: "238 MB",
      created: "2024-01-08T15:30:00Z",
      digest: "sha256:def456...",
      pulls: 850,
      vulnerabilities: { critical: 0, high: 0, medium: 2, low: 4 },
      layers: 9,
      architecture: "amd64",
      os: "linux",
    },
    {
      id: "3",
      name: "myapp/backend",
      tag: "v2.1.0",
      registry: "Private Registry",
      size: "512 MB",
      created: "2024-01-15T09:00:00Z",
      digest: "sha256:ghi789...",
      pulls: 320,
      vulnerabilities: { critical: 1, high: 2, medium: 5, low: 8 },
      layers: 12,
      architecture: "amd64",
      os: "linux",
    },
    {
      id: "4",
      name: "myapp/frontend",
      tag: "v2.1.0",
      registry: "Private Registry",
      size: "385 MB",
      created: "2024-01-15T09:15:00Z",
      digest: "sha256:jkl012...",
      pulls: 280,
      vulnerabilities: { critical: 0, high: 1, medium: 4, low: 6 },
      layers: 10,
      architecture: "amd64",
      os: "linux",
    },
  ])

  const [hostInfo] = useState<HostInfo>({
    hostname: "docker-host-01",
    os: "Ubuntu",
    osVersion: "22.04.3 LTS",
    kernel: "5.15.0-91-generic",
    architecture: "x86_64",
    cpuCores: 16,
    memory: "64 GB",
    disk: "1 TB",
    dockerVersion: "24.0.7",
    dockerRootDir: "/var/lib/docker",
    storageDriver: "overlay2",
    loggingDriver: "json-file",
    cgroupDriver: "systemd",
    cgroupVersion: "2",
    runtimes: ["runc", "nvidia"],
    plugins: ["volume", "network", "log"],
    swarmMode: true,
    nodeRole: "manager",
    uptime: "45 days",
    containersRunning: 28,
    containersPaused: 2,
    containersStopped: 15,
    images: 45,
    serverVersion: "24.0.7",
  })

  const [hostResources] = useState<HostResource>({
    cpu: {
      usage: 45,
      cores: 16,
      model: "Intel Xeon E5-2680 v4",
    },
    memory: {
      total: "64 GB",
      used: "38 GB",
      free: "26 GB",
      usagePercent: 59,
    },
    disk: {
      total: "1 TB",
      used: "650 GB",
      free: "350 GB",
      usagePercent: 65,
    },
    network: {
      rx: "2.5 TB",
      tx: "1.8 TB",
      interfaces: 4,
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "disconnected":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getVulnerabilityColor = (severity: string) => {
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

  const addRegistry = () => {
    const newRegistry: RegistryConfig = {
      id: Date.now().toString(),
      name: "New Registry",
      url: "registry.example.com",
      type: "private",
      username: "",
      authenticated: false,
      insecure: false,
      default: false,
      status: "disconnected",
      imageCount: 0,
      lastSync: new Date().toISOString(),
    }
    setRegistries([...registries, newRegistry])
  }

  const deleteRegistry = (id: string) => {
    setRegistries(registries.filter((reg) => reg.id !== id))
  }

  const filteredImages = registryImages.filter(
    (image) =>
      image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.registry.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Container Registry & Host</h1>
          <p className="text-muted-foreground mt-2">Manage container registries, images, and host configuration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registries">Registries</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="host-info">Host Info</TabsTrigger>
          <TabsTrigger value="host-setup">Host Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="registries" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Container Registries
                  </CardTitle>
                  <CardDescription>Manage container registry connections and authentication</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addRegistry}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Registry
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registries.map((registry) => (
                  <div key={registry.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{registry.name}</h3>
                            {registry.default && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">{registry.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(registry.status)}>{registry.status}</Badge>
                        <Badge variant="outline">{registry.type}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Username:</span>
                        <div className="font-medium">{registry.username || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Images:</span>
                        <div className="font-medium">{registry.imageCount}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Authenticated:</span>
                        <div className="flex items-center gap-1">
                          {registry.authenticated ? (
                            <Lock className="h-4 w-4 text-green-500" />
                          ) : (
                            <Unlock className="h-4 w-4 text-red-500" />
                          )}
                          <span>{registry.authenticated ? "Yes" : "No"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Sync:</span>
                        <div className="font-medium">{new Date(registry.lastSync).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
                      <Button size="sm" variant="outline" disabled={!isEditing}>
                        <Edit className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteRegistry(registry.id)}
                        disabled={!isEditing}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Registry Images
                  </CardTitle>
                  <CardDescription>Browse and manage images from all connected registries</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5" />
                          <div>
                            <h3 className="font-medium font-mono">
                              {image.name}:{image.tag}
                            </h3>
                            <p className="text-sm text-muted-foreground">{image.registry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{image.size}</Badge>
                          <Badge variant="outline">{image.architecture}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <div className="font-medium">{new Date(image.created).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pulls:</span>
                          <div className="font-medium">{image.pulls.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Layers:</span>
                          <div className="font-medium">{image.layers}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">OS:</span>
                          <div className="font-medium">{image.os}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Digest:</span>
                          <div className="font-mono text-xs">{image.digest.substring(0, 20)}...</div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm text-muted-foreground">Vulnerabilities:</span>
                        <div className="flex gap-2 mt-1">
                          {image.vulnerabilities.critical > 0 && (
                            <Badge className={getVulnerabilityColor("critical")}>
                              {image.vulnerabilities.critical} Critical
                            </Badge>
                          )}
                          {image.vulnerabilities.high > 0 && (
                            <Badge className={getVulnerabilityColor("high")}>{image.vulnerabilities.high} High</Badge>
                          )}
                          {image.vulnerabilities.medium > 0 && (
                            <Badge className={getVulnerabilityColor("medium")}>
                              {image.vulnerabilities.medium} Medium
                            </Badge>
                          )}
                          {image.vulnerabilities.low > 0 && (
                            <Badge className={getVulnerabilityColor("low")}>{image.vulnerabilities.low} Low</Badge>
                          )}
                          {Object.values(image.vulnerabilities).every((v) => v === 0) && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              No Vulnerabilities
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Pull
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Inspect
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Tag
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="h-4 w-4 mr-2" />
                          Scan
                        </Button>
                        <Button size="sm" variant="destructive" disabled={!isEditing}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="host-info" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Host Information
                </CardTitle>
                <CardDescription>Docker host system details and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Hostname:</span>
                      <div className="font-medium">{hostInfo.hostname}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">OS:</span>
                      <div className="font-medium">
                        {hostInfo.os} {hostInfo.osVersion}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Kernel:</span>
                      <div className="font-medium font-mono text-xs">{hostInfo.kernel}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Architecture:</span>
                      <div className="font-medium">{hostInfo.architecture}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CPU Cores:</span>
                      <div className="font-medium">{hostInfo.cpuCores}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Memory:</span>
                      <div className="font-medium">{hostInfo.memory}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Disk:</span>
                      <div className="font-medium">{hostInfo.disk}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Uptime:</span>
                      <div className="font-medium">{hostInfo.uptime}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resource Usage
                </CardTitle>
                <CardDescription>Current host resource utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span className="font-medium">{hostResources.cpu.usage}%</span>
                    </div>
                    <Progress value={hostResources.cpu.usage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {hostResources.cpu.cores} cores - {hostResources.cpu.model}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span className="font-medium">
                        {hostResources.memory.used} / {hostResources.memory.total} ({hostResources.memory.usagePercent}
                        %)
                      </span>
                    </div>
                    <Progress value={hostResources.memory.usagePercent} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{hostResources.memory.free} free</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Disk Usage</span>
                      <span className="font-medium">
                        {hostResources.disk.used} / {hostResources.disk.total} ({hostResources.disk.usagePercent}%)
                      </span>
                    </div>
                    <Progress value={hostResources.disk.usagePercent} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{hostResources.disk.free} free</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                    <div>
                      <span className="text-muted-foreground">Network RX:</span>
                      <div className="font-medium">{hostResources.network.rx}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Network TX:</span>
                      <div className="font-medium">{hostResources.network.tx}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Docker Configuration
                </CardTitle>
                <CardDescription>Docker engine settings and drivers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Docker Version:</span>
                      <div className="font-medium">{hostInfo.dockerVersion}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Server Version:</span>
                      <div className="font-medium">{hostInfo.serverVersion}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Storage Driver:</span>
                      <div className="font-medium">{hostInfo.storageDriver}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Logging Driver:</span>
                      <div className="font-medium">{hostInfo.loggingDriver}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cgroup Driver:</span>
                      <div className="font-medium">{hostInfo.cgroupDriver}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cgroup Version:</span>
                      <div className="font-medium">{hostInfo.cgroupVersion}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Docker Root Dir:</span>
                      <div className="font-medium font-mono text-xs">{hostInfo.dockerRootDir}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Runtimes:</span>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {hostInfo.runtimes.map((runtime, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {runtime}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Plugins:</span>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {hostInfo.plugins.map((plugin, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {plugin}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Container Statistics
                </CardTitle>
                <CardDescription>Current container and image counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">{hostInfo.containersRunning}</div>
                      <div className="text-sm text-muted-foreground">Running</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="text-2xl font-bold text-yellow-600">{hostInfo.containersPaused}</div>
                      <div className="text-sm text-muted-foreground">Paused</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-600">{hostInfo.containersStopped}</div>
                      <div className="text-sm text-muted-foreground">Stopped</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{hostInfo.images}</div>
                      <div className="text-sm text-muted-foreground">Images</div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Swarm Mode:</span>
                        <div className="font-medium">{hostInfo.swarmMode ? "Enabled" : "Disabled"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Node Role:</span>
                        <div className="font-medium">{hostInfo.nodeRole}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="host-setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Docker Daemon Configuration
              </CardTitle>
              <CardDescription>Configure Docker daemon settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Storage Driver</Label>
                    <Select value={hostInfo.storageDriver} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overlay2">overlay2</SelectItem>
                        <SelectItem value="aufs">aufs</SelectItem>
                        <SelectItem value="devicemapper">devicemapper</SelectItem>
                        <SelectItem value="btrfs">btrfs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Logging Driver</Label>
                    <Select value={hostInfo.loggingDriver} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json-file">json-file</SelectItem>
                        <SelectItem value="syslog">syslog</SelectItem>
                        <SelectItem value="journald">journald</SelectItem>
                        <SelectItem value="gelf">gelf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cgroup Driver</Label>
                    <Select value={hostInfo.cgroupDriver} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="systemd">systemd</SelectItem>
                        <SelectItem value="cgroupfs">cgroupfs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Docker Root Directory</Label>
                    <Input value={hostInfo.dockerRootDir} disabled={!isEditing} className="font-mono text-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">Enable Swarm Mode</div>
                    <div className="text-sm text-muted-foreground">Enable Docker Swarm orchestration</div>
                  </div>
                  <Switch checked={hostInfo.swarmMode} disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">Enable Live Restore</div>
                    <div className="text-sm text-muted-foreground">Keep containers running during daemon downtime</div>
                  </div>
                  <Switch disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">Enable IPv6</div>
                    <div className="text-sm text-muted-foreground">Enable IPv6 networking</div>
                  </div>
                  <Switch disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">Enable Experimental Features</div>
                    <div className="text-sm text-muted-foreground">Enable experimental Docker features</div>
                  </div>
                  <Switch disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Configuration
              </CardTitle>
              <CardDescription>Configure Docker network settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Default Bridge Network</Label>
                    <Input defaultValue="172.17.0.0/16" disabled={!isEditing} className="font-mono text-sm" />
                  </div>
                  <div>
                    <Label>Default Gateway</Label>
                    <Input defaultValue="172.17.0.1" disabled={!isEditing} className="font-mono text-sm" />
                  </div>
                  <div>
                    <Label>DNS Servers</Label>
                    <Input defaultValue="8.8.8.8, 8.8.4.4" disabled={!isEditing} className="font-mono text-sm" />
                  </div>
                  <div>
                    <Label>MTU</Label>
                    <Input defaultValue="1500" disabled={!isEditing} className="font-mono text-sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>Configure Docker security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">Enable User Namespaces</div>
                    <div className="text-sm text-muted-foreground">Remap container users to host users</div>
                  </div>
                  <Switch disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">Enable Content Trust</div>
                    <div className="text-sm text-muted-foreground">Verify image signatures</div>
                  </div>
                  <Switch disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">Enable SELinux</div>
                    <div className="text-sm text-muted-foreground">Enable SELinux labeling</div>
                  </div>
                  <Switch disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">Enable AppArmor</div>
                    <div className="text-sm text-muted-foreground">Enable AppArmor security profiles</div>
                  </div>
                  <Switch disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
