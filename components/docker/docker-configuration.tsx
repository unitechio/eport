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
import { Textarea } from "@/components/ui/textarea"
import {
  Container,
  Settings,
  Network,
  HardDrive,
  Shield,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Database,
  Globe,
  Lock,
  Activity,
} from "lucide-react"

interface DockerDaemonConfig {
  dataRoot: string
  storageDriver: string
  logDriver: string
  logLevel: string
  maxConcurrentDownloads: number
  maxConcurrentUploads: number
  defaultRuntime: string
  runtimes: Record<string, any>
  registryMirrors: string[]
  insecureRegistries: string[]
  dns: string[]
  mtu: number
  ipv6: boolean
  experimental: boolean
  metricsAddr: string
  liveRestore: boolean
}

interface DockerComposeService {
  name: string
  image: string
  ports: string[]
  volumes: string[]
  environment: Record<string, string>
  networks: string[]
  depends_on: string[]
  restart: string
  healthcheck?: {
    test: string
    interval: string
    timeout: string
    retries: number
  }
  resources?: {
    limits: {
      cpus: string
      memory: string
    }
    reservations: {
      cpus: string
      memory: string
    }
  }
}

interface DockerNetwork {
  name: string
  driver: string
  scope: string
  subnet: string
  gateway: string
  ipRange: string
  attachable: boolean
  internal: boolean
  encrypted: boolean
  options: Record<string, string>
}

interface DockerVolume {
  name: string
  driver: string
  mountpoint: string
  scope: string
  size: string
  options: Record<string, string>
  labels: Record<string, string>
}

interface DockerRegistry {
  name: string
  url: string
  username: string
  password: string
  email: string
  secure: boolean
  default: boolean
}

export function DockerConfiguration() {
  const [activeTab, setActiveTab] = useState("daemon")
  const [isEditing, setIsEditing] = useState(false)

  const [daemonConfig, setDaemonConfig] = useState<DockerDaemonConfig>({
    dataRoot: "/var/lib/docker",
    storageDriver: "overlay2",
    logDriver: "json-file",
    logLevel: "info",
    maxConcurrentDownloads: 3,
    maxConcurrentUploads: 5,
    defaultRuntime: "runc",
    runtimes: {
      runc: {
        path: "runc",
      },
    },
    registryMirrors: ["https://mirror.gcr.io"],
    insecureRegistries: ["localhost:5000"],
    dns: ["8.8.8.8", "8.8.4.4"],
    mtu: 1500,
    ipv6: false,
    experimental: false,
    metricsAddr: "127.0.0.1:9323",
    liveRestore: true,
  })

  const [composeServices, setComposeServices] = useState<DockerComposeService[]>([
    {
      name: "web",
      image: "nginx:alpine",
      ports: ["80:80", "443:443"],
      volumes: ["./nginx.conf:/etc/nginx/nginx.conf", "web-data:/var/www/html"],
      environment: {
        NGINX_HOST: "localhost",
        NGINX_PORT: "80",
      },
      networks: ["frontend"],
      depends_on: ["api"],
      restart: "unless-stopped",
      healthcheck: {
        test: "curl -f http://localhost || exit 1",
        interval: "30s",
        timeout: "10s",
        retries: 3,
      },
      resources: {
        limits: {
          cpus: "0.5",
          memory: "512M",
        },
        reservations: {
          cpus: "0.25",
          memory: "256M",
        },
      },
    },
    {
      name: "api",
      image: "node:18-alpine",
      ports: ["3000:3000"],
      volumes: ["./app:/usr/src/app", "node_modules:/usr/src/app/node_modules"],
      environment: {
        NODE_ENV: "production",
        PORT: "3000",
        DATABASE_URL: "postgresql://user:pass@db:5432/myapp",
      },
      networks: ["frontend", "backend"],
      depends_on: ["db", "redis"],
      restart: "unless-stopped",
      resources: {
        limits: {
          cpus: "1.0",
          memory: "1G",
        },
        reservations: {
          cpus: "0.5",
          memory: "512M",
        },
      },
    },
    {
      name: "db",
      image: "postgres:15-alpine",
      ports: ["5432:5432"],
      volumes: ["postgres-data:/var/lib/postgresql/data"],
      environment: {
        POSTGRES_DB: "myapp",
        POSTGRES_USER: "user",
        POSTGRES_PASSWORD: "password",
      },
      networks: ["backend"],
      depends_on: [],
      restart: "unless-stopped",
      healthcheck: {
        test: "pg_isready -U user -d myapp",
        interval: "10s",
        timeout: "5s",
        retries: 5,
      },
    },
  ])

  const [dockerNetworks, setDockerNetworks] = useState<DockerNetwork[]>([
    {
      name: "frontend",
      driver: "bridge",
      scope: "local",
      subnet: "172.20.0.0/16",
      gateway: "172.20.0.1",
      ipRange: "172.20.240.0/20",
      attachable: true,
      internal: false,
      encrypted: false,
      options: {
        "com.docker.network.bridge.name": "docker-frontend",
        "com.docker.network.driver.mtu": "1500",
      },
    },
    {
      name: "backend",
      driver: "bridge",
      scope: "local",
      subnet: "172.21.0.0/16",
      gateway: "172.21.0.1",
      ipRange: "172.21.240.0/20",
      attachable: false,
      internal: true,
      encrypted: true,
      options: {
        "com.docker.network.bridge.name": "docker-backend",
        "com.docker.network.driver.mtu": "1500",
      },
    },
  ])

  const [dockerVolumes, setDockerVolumes] = useState<DockerVolume[]>([
    {
      name: "postgres-data",
      driver: "local",
      mountpoint: "/var/lib/docker/volumes/postgres-data/_data",
      scope: "local",
      size: "2.1 GB",
      options: {
        type: "none",
        device: "/opt/docker/postgres",
        o: "bind",
      },
      labels: {
        "com.example.description": "Database volume for PostgreSQL",
        "com.example.department": "IT",
      },
    },
    {
      name: "web-data",
      driver: "local",
      mountpoint: "/var/lib/docker/volumes/web-data/_data",
      scope: "local",
      size: "512 MB",
      options: {},
      labels: {
        "com.example.description": "Web content volume",
        "com.example.department": "IT",
      },
    },
    {
      name: "node_modules",
      driver: "local",
      mountpoint: "/var/lib/docker/volumes/node_modules/_data",
      scope: "local",
      size: "1.8 GB",
      options: {},
      labels: {
        "com.example.description": "Node.js dependencies volume",
        "com.example.department": "Development",
      },
    },
  ])

  const [dockerRegistries, setDockerRegistries] = useState<DockerRegistry[]>([
    {
      name: "Docker Hub",
      url: "https://index.docker.io/v1/",
      username: "myuser",
      password: "********",
      email: "user@example.com",
      secure: true,
      default: true,
    },
    {
      name: "Private Registry",
      url: "https://registry.company.com",
      username: "admin",
      password: "********",
      email: "admin@company.com",
      secure: true,
      default: false,
    },
    {
      name: "Local Registry",
      url: "localhost:5000",
      username: "",
      password: "",
      email: "",
      secure: false,
      default: false,
    },
  ])

  const handleSaveConfig = () => {
    console.log("[v0] Saving Docker configuration...")
    setIsEditing(false)
  }

  const handleResetConfig = () => {
    console.log("[v0] Resetting Docker configuration...")
    setIsEditing(false)
  }

  const addComposeService = () => {
    const newService: DockerComposeService = {
      name: "new-service",
      image: "alpine:latest",
      ports: [],
      volumes: [],
      environment: {},
      networks: [],
      depends_on: [],
      restart: "unless-stopped",
    }
    setComposeServices([...composeServices, newService])
  }

  const deleteComposeService = (index: number) => {
    setComposeServices(composeServices.filter((_, i) => i !== index))
  }

  const addDockerNetwork = () => {
    const newNetwork: DockerNetwork = {
      name: "new-network",
      driver: "bridge",
      scope: "local",
      subnet: "172.22.0.0/16",
      gateway: "172.22.0.1",
      ipRange: "172.22.240.0/20",
      attachable: true,
      internal: false,
      encrypted: false,
      options: {},
    }
    setDockerNetworks([...dockerNetworks, newNetwork])
  }

  const deleteDockerNetwork = (index: number) => {
    setDockerNetworks(dockerNetworks.filter((_, i) => i !== index))
  }

  const addDockerVolume = () => {
    const newVolume: DockerVolume = {
      name: "new-volume",
      driver: "local",
      mountpoint: "/var/lib/docker/volumes/new-volume/_data",
      scope: "local",
      size: "0 B",
      options: {},
      labels: {},
    }
    setDockerVolumes([...dockerVolumes, newVolume])
  }

  const deleteDockerVolume = (index: number) => {
    setDockerVolumes(dockerVolumes.filter((_, i) => i !== index))
  }

  const addDockerRegistry = () => {
    const newRegistry: DockerRegistry = {
      name: "New Registry",
      url: "https://registry.example.com",
      username: "",
      password: "",
      email: "",
      secure: true,
      default: false,
    }
    setDockerRegistries([...dockerRegistries, newRegistry])
  }

  const deleteDockerRegistry = (index: number) => {
    setDockerRegistries(dockerRegistries.filter((_, i) => i !== index))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Docker Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage Docker daemon, compose services, networks, volumes, and registries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <>
              <Button variant="outline" size="sm" onClick={handleResetConfig}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSaveConfig}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="daemon">Daemon</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="registries">Registries</TabsTrigger>
        </TabsList>

        <TabsContent value="daemon" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Docker Daemon Configuration
                </CardTitle>
                <CardDescription>Configure Docker daemon settings and runtime options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data Root</Label>
                    <Input
                      value={daemonConfig.dataRoot}
                      disabled={!isEditing}
                      className="font-mono"
                      onChange={(e) => setDaemonConfig({ ...daemonConfig, dataRoot: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Storage Driver</Label>
                    <Select value={daemonConfig.storageDriver} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overlay2">overlay2</SelectItem>
                        <SelectItem value="aufs">aufs</SelectItem>
                        <SelectItem value="devicemapper">devicemapper</SelectItem>
                        <SelectItem value="btrfs">btrfs</SelectItem>
                        <SelectItem value="zfs">zfs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Log Driver</Label>
                    <Select value={daemonConfig.logDriver} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json-file">json-file</SelectItem>
                        <SelectItem value="syslog">syslog</SelectItem>
                        <SelectItem value="journald">journald</SelectItem>
                        <SelectItem value="gelf">gelf</SelectItem>
                        <SelectItem value="fluentd">fluentd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Log Level</Label>
                    <Select value={daemonConfig.logLevel} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">debug</SelectItem>
                        <SelectItem value="info">info</SelectItem>
                        <SelectItem value="warn">warn</SelectItem>
                        <SelectItem value="error">error</SelectItem>
                        <SelectItem value="fatal">fatal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Max Concurrent Downloads</Label>
                    <Input
                      type="number"
                      value={daemonConfig.maxConcurrentDownloads}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setDaemonConfig({ ...daemonConfig, maxConcurrentDownloads: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Max Concurrent Uploads</Label>
                    <Input
                      type="number"
                      value={daemonConfig.maxConcurrentUploads}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setDaemonConfig({ ...daemonConfig, maxConcurrentUploads: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>MTU</Label>
                    <Input
                      type="number"
                      value={daemonConfig.mtu}
                      disabled={!isEditing}
                      onChange={(e) => setDaemonConfig({ ...daemonConfig, mtu: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Metrics Address</Label>
                    <Input
                      value={daemonConfig.metricsAddr}
                      disabled={!isEditing}
                      className="font-mono"
                      onChange={(e) => setDaemonConfig({ ...daemonConfig, metricsAddr: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label>Registry Mirrors</Label>
                    <Textarea
                      value={daemonConfig.registryMirrors.join("\n")}
                      disabled={!isEditing}
                      className="font-mono"
                      placeholder="One registry mirror per line"
                      onChange={(e) =>
                        setDaemonConfig({
                          ...daemonConfig,
                          registryMirrors: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Insecure Registries</Label>
                    <Textarea
                      value={daemonConfig.insecureRegistries.join("\n")}
                      disabled={!isEditing}
                      className="font-mono"
                      placeholder="One insecure registry per line"
                      onChange={(e) =>
                        setDaemonConfig({
                          ...daemonConfig,
                          insecureRegistries: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>DNS Servers</Label>
                    <Textarea
                      value={daemonConfig.dns.join("\n")}
                      disabled={!isEditing}
                      className="font-mono"
                      placeholder="One DNS server per line"
                      onChange={(e) =>
                        setDaemonConfig({ ...daemonConfig, dns: e.target.value.split("\n").filter(Boolean) })
                      }
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={daemonConfig.ipv6}
                      disabled={!isEditing}
                      onCheckedChange={(checked) => setDaemonConfig({ ...daemonConfig, ipv6: checked })}
                    />
                    <Label>Enable IPv6</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={daemonConfig.experimental}
                      disabled={!isEditing}
                      onCheckedChange={(checked) => setDaemonConfig({ ...daemonConfig, experimental: checked })}
                    />
                    <Label>Experimental Features</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={daemonConfig.liveRestore}
                      disabled={!isEditing}
                      onCheckedChange={(checked) => setDaemonConfig({ ...daemonConfig, liveRestore: checked })}
                    />
                    <Label>Live Restore</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Container className="h-5 w-5" />
                    Docker Compose Services
                  </CardTitle>
                  <CardDescription>Configure Docker Compose service definitions</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addComposeService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {composeServices.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5" />
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-muted-foreground font-mono">{service.image}</p>
                          </div>
                        </div>
                        {isEditing && (
                          <Button size="sm" variant="destructive" onClick={() => deleteComposeService(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm">Service Name</Label>
                          <Input value={service.name} disabled={!isEditing} />
                        </div>
                        <div>
                          <Label className="text-sm">Image</Label>
                          <Input value={service.image} disabled={!isEditing} className="font-mono" />
                        </div>
                        <div>
                          <Label className="text-sm">Restart Policy</Label>
                          <Select value={service.restart} disabled={!isEditing}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no">no</SelectItem>
                              <SelectItem value="always">always</SelectItem>
                              <SelectItem value="on-failure">on-failure</SelectItem>
                              <SelectItem value="unless-stopped">unless-stopped</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Networks</Label>
                          <Input
                            value={service.networks.join(", ")}
                            disabled={!isEditing}
                            placeholder="network1, network2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm">Ports</Label>
                          <Textarea
                            value={service.ports.join("\n")}
                            disabled={!isEditing}
                            className="font-mono text-sm"
                            placeholder="8080:80&#10;8443:443"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Volumes</Label>
                          <Textarea
                            value={service.volumes.join("\n")}
                            disabled={!isEditing}
                            className="font-mono text-sm"
                            placeholder="./data:/app/data&#10;logs:/var/log"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label className="text-sm">Environment Variables</Label>
                        <Textarea
                          value={Object.entries(service.environment)
                            .map(([k, v]) => `${k}=${v}`)
                            .join("\n")}
                          disabled={!isEditing}
                          className="font-mono text-sm"
                          placeholder="NODE_ENV=production&#10;PORT=3000"
                          rows={3}
                        />
                      </div>

                      {service.resources && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm">Resource Limits</Label>
                            <div className="text-sm space-y-1">
                              <div>CPU: {service.resources.limits.cpus}</div>
                              <div>Memory: {service.resources.limits.memory}</div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">Resource Reservations</Label>
                            <div className="text-sm space-y-1">
                              <div>CPU: {service.resources.reservations.cpus}</div>
                              <div>Memory: {service.resources.reservations.memory}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {service.healthcheck && (
                        <div className="mt-4 p-3 bg-muted rounded">
                          <Label className="text-sm font-medium">Health Check</Label>
                          <div className="text-sm space-y-1 mt-2">
                            <div>
                              <span className="font-medium">Test:</span> {service.healthcheck.test}
                            </div>
                            <div>
                              <span className="font-medium">Interval:</span> {service.healthcheck.interval}
                            </div>
                            <div>
                              <span className="font-medium">Timeout:</span> {service.healthcheck.timeout}
                            </div>
                            <div>
                              <span className="font-medium">Retries:</span> {service.healthcheck.retries}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Docker Networks
                  </CardTitle>
                  <CardDescription>Configure Docker network settings and drivers</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addDockerNetwork}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Network
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dockerNetworks.map((network, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{network.name}</h3>
                          <p className="text-sm text-muted-foreground">{network.driver} driver</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {network.internal && <Badge variant="secondary">Internal</Badge>}
                        {network.encrypted && <Badge variant="secondary">Encrypted</Badge>}
                        {isEditing && (
                          <Button size="sm" variant="destructive" onClick={() => deleteDockerNetwork(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">Network Name</Label>
                        <Input value={network.name} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label className="text-sm">Driver</Label>
                        <Select value={network.driver} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bridge">bridge</SelectItem>
                            <SelectItem value="host">host</SelectItem>
                            <SelectItem value="overlay">overlay</SelectItem>
                            <SelectItem value="macvlan">macvlan</SelectItem>
                            <SelectItem value="none">none</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Scope</Label>
                        <Input value={network.scope} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label className="text-sm">Subnet</Label>
                        <Input value={network.subnet} disabled={!isEditing} className="font-mono" />
                      </div>
                      <div>
                        <Label className="text-sm">Gateway</Label>
                        <Input value={network.gateway} disabled={!isEditing} className="font-mono" />
                      </div>
                      <div>
                        <Label className="text-sm">IP Range</Label>
                        <Input value={network.ipRange} disabled={!isEditing} className="font-mono" />
                      </div>
                    </div>
                    <div className="flex gap-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <Switch checked={network.attachable} disabled={!isEditing} />
                        <Label className="text-sm">Attachable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={network.internal} disabled={!isEditing} />
                        <Label className="text-sm">Internal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={network.encrypted} disabled={!isEditing} />
                        <Label className="text-sm">Encrypted</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volumes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Docker Volumes
                  </CardTitle>
                  <CardDescription>Manage Docker volume configurations and drivers</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addDockerVolume}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Volume
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dockerVolumes.map((volume, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{volume.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {volume.driver} driver • {volume.size}
                          </p>
                        </div>
                      </div>
                      {isEditing && (
                        <Button size="sm" variant="destructive" onClick={() => deleteDockerVolume(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm">Volume Name</Label>
                        <Input value={volume.name} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label className="text-sm">Driver</Label>
                        <Select value={volume.driver} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">local</SelectItem>
                            <SelectItem value="nfs">nfs</SelectItem>
                            <SelectItem value="cifs">cifs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">Mountpoint</Label>
                        <Input value={volume.mountpoint} disabled={!isEditing} className="font-mono" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Driver Options</Label>
                        <Textarea
                          value={Object.entries(volume.options)
                            .map(([k, v]) => `${k}=${v}`)
                            .join("\n")}
                          disabled={!isEditing}
                          className="font-mono text-sm"
                          placeholder="type=bind&#10;device=/host/path"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Labels</Label>
                        <Textarea
                          value={Object.entries(volume.labels)
                            .map(([k, v]) => `${k}=${v}`)
                            .join("\n")}
                          disabled={!isEditing}
                          className="font-mono text-sm"
                          placeholder="com.example.description=My volume&#10;com.example.department=IT"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registries" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Docker Registries
                  </CardTitle>
                  <CardDescription>Configure Docker registry authentication and settings</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addDockerRegistry}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Registry
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dockerRegistries.map((registry, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{registry.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{registry.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {registry.default && <Badge>Default</Badge>}
                        {registry.secure ? (
                          <Badge className="bg-green-100 text-green-800">Secure</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Insecure</Badge>
                        )}
                        {isEditing && (
                          <Button size="sm" variant="destructive" onClick={() => deleteDockerRegistry(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Registry Name</Label>
                        <Input value={registry.name} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label className="text-sm">Registry URL</Label>
                        <Input value={registry.url} disabled={!isEditing} className="font-mono" />
                      </div>
                      <div>
                        <Label className="text-sm">Username</Label>
                        <Input value={registry.username} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label className="text-sm">Password</Label>
                        <Input
                          type="password"
                          value={registry.password}
                          disabled={!isEditing}
                          placeholder="Enter password"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Email</Label>
                        <Input value={registry.email} disabled={!isEditing} type="email" />
                      </div>
                      <div className="flex items-center gap-4 pt-6">
                        <div className="flex items-center space-x-2">
                          <Switch checked={registry.secure} disabled={!isEditing} />
                          <Label className="text-sm">Secure (HTTPS)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={registry.default} disabled={!isEditing} />
                          <Label className="text-sm">Default Registry</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
