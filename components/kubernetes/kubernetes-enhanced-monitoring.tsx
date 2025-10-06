"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Network,
  Settings,
  Eye,
  FileText,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Database,
  Download,
  Cpu,
  MemoryStick,
  HardDrive,
  Terminal,
  Play,
  Trash2,
  Copy,
} from "lucide-react"

interface KubernetesResource {
  apiVersion: string
  kind: string
  metadata: {
    name: string
    namespace: string
    labels: Record<string, string>
    annotations: Record<string, string>
    creationTimestamp: string
  }
  spec: Record<string, any>
  status: Record<string, any>
}

interface KubernetesPolicy {
  id: string
  name: string
  type: "NetworkPolicy" | "PodSecurityPolicy" | "ResourceQuota" | "LimitRange" | "RBAC"
  namespace: string
  enabled: boolean
  rules: Array<{
    action: "allow" | "deny"
    resource: string
    conditions: string[]
  }>
  created: string
  lastModified: string
  violations: number
}

interface KubernetesLogEntry {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  source: string
  namespace: string
  pod: string
  container: string
  message: string
}

interface ResourceMetrics {
  cpu: {
    usage: number
    request: number
    limit: number
    unit: string
  }
  memory: {
    usage: number
    request: number
    limit: number
    unit: string
  }
  storage: {
    usage: number
    capacity: number
    unit: string
  }
  network: {
    rxBytes: number
    txBytes: number
    unit: string
  }
}

interface Environment {
  id: string
  name: string
  cluster: string
  namespace: string
  status: "active" | "inactive" | "error"
  deployments: number
  pods: number
  services: number
  lastDeployed: string
  version: string
}

const mockResources: KubernetesResource[] = [
  {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: "nginx-deployment",
      namespace: "production",
      labels: { app: "nginx", version: "1.21" },
      annotations: { "deployment.kubernetes.io/revision": "3" },
      creationTimestamp: "2024-01-10T08:00:00Z",
    },
    spec: { replicas: 3, selector: { matchLabels: { app: "nginx" } } },
    status: { readyReplicas: 3, availableReplicas: 3 },
  },
  {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: "nginx-service",
      namespace: "production",
      labels: { app: "nginx" },
      annotations: {},
      creationTimestamp: "2024-01-10T08:05:00Z",
    },
    spec: { type: "LoadBalancer", ports: [{ port: 80, targetPort: 80 }] },
    status: { loadBalancer: { ingress: [{ ip: "203.0.113.1" }] } },
  },
]

const mockPolicies: KubernetesPolicy[] = [
  {
    id: "policy1",
    name: "default-network-policy",
    type: "NetworkPolicy",
    namespace: "production",
    enabled: true,
    rules: [
      { action: "allow", resource: "ingress", conditions: ["from: same-namespace"] },
      { action: "deny", resource: "egress", conditions: ["to: external"] },
    ],
    created: "2024-01-10T08:00:00Z",
    lastModified: "2024-01-15T14:30:00Z",
    violations: 0,
  },
  {
    id: "policy2",
    name: "resource-quota-prod",
    type: "ResourceQuota",
    namespace: "production",
    enabled: true,
    rules: [
      { action: "allow", resource: "cpu", conditions: ["limit: 10 cores"] },
      { action: "allow", resource: "memory", conditions: ["limit: 20Gi"] },
    ],
    created: "2024-01-08T10:00:00Z",
    lastModified: "2024-01-12T16:45:00Z",
    violations: 2,
  },
]

const mockLogs: KubernetesLogEntry[] = [
  {
    timestamp: "2025-09-21T23:33:00Z",
    level: "info",
    source: "kubelet",
    namespace: "production",
    pod: "nginx-deployment-7d6b8c9f4d-abc123",
    container: "nginx",
    message: "Container started successfully",
  },
  {
    timestamp: "2025-09-21T23:32:45Z",
    level: "warn",
    source: "scheduler",
    namespace: "production",
    pod: "api-server-6c8d9e7f2a-def456",
    container: "api",
    message: "Pod scheduling delayed due to resource constraints",
  },
  {
    timestamp: "2025-09-21T23:32:30Z",
    level: "error",
    source: "controller-manager",
    namespace: "staging",
    pod: "worker-5b7c8d9e1f-ghi789",
    container: "worker",
    message: "Failed to pull image: registry timeout",
  },
]

const mockMetrics: Record<string, ResourceMetrics> = {
  "nginx-deployment": {
    cpu: { usage: 250, request: 100, limit: 500, unit: "m" },
    memory: { usage: 512, request: 256, limit: 1024, unit: "Mi" },
    storage: { usage: 2.5, capacity: 10, unit: "Gi" },
    network: { rxBytes: 1024000, txBytes: 512000, unit: "bytes" },
  },
  "api-server": {
    cpu: { usage: 800, request: 500, limit: 1000, unit: "m" },
    memory: { usage: 1536, request: 1024, limit: 2048, unit: "Mi" },
    storage: { usage: 5.2, capacity: 20, unit: "Gi" },
    network: { rxBytes: 5120000, txBytes: 2560000, unit: "bytes" },
  },
}

const mockEnvironments: Environment[] = [
  {
    id: "env1",
    name: "Production",
    cluster: "prod-cluster-01",
    namespace: "production",
    status: "active",
    deployments: 15,
    pods: 45,
    services: 20,
    lastDeployed: "2025-09-21T10:30:00Z",
    version: "v2.5.1",
  },
  {
    id: "env2",
    name: "Staging",
    cluster: "staging-cluster-01",
    namespace: "staging",
    status: "active",
    deployments: 12,
    pods: 36,
    services: 18,
    lastDeployed: "2025-09-21T14:15:00Z",
    version: "v2.6.0-rc1",
  },
  {
    id: "env3",
    name: "Development",
    cluster: "dev-cluster-01",
    namespace: "development",
    status: "active",
    deployments: 8,
    pods: 24,
    services: 12,
    lastDeployed: "2025-09-21T16:45:00Z",
    version: "v2.6.0-dev",
  },
]

export function KubernetesEnhancedMonitoring() {
  const [resources, setResources] = useState<KubernetesResource[]>(mockResources)
  const [policies, setPolicies] = useState<KubernetesPolicy[]>(mockPolicies)
  const [logs, setLogs] = useState<KubernetesLogEntry[]>(mockLogs)
  const [metrics, setMetrics] = useState<Record<string, ResourceMetrics>>(mockMetrics)
  const [environments, setEnvironments] = useState<Environment[]>(mockEnvironments)
  const [selectedNamespace, setSelectedNamespace] = useState("all")
  const [selectedResource, setSelectedResource] = useState<KubernetesResource | null>(null)
  const [logFilter, setLogFilter] = useState("")
  const [logLevel, setLogLevel] = useState("all")
  const [realTimeLogsEnabled, setRealTimeLogsEnabled] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all")
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to Kubernetes Terminal",
    "Type 'help' for available commands",
  ])
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [selectedPodForLogs, setSelectedPodForLogs] = useState<string>("")
  const [podLogs, setPodLogs] = useState<string[]>([])

  // Simulate real-time log updates
  useEffect(() => {
    if (!realTimeLogsEnabled) return

    const interval = setInterval(() => {
      const newLog: KubernetesLogEntry = {
        timestamp: new Date().toISOString(),
        level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as any,
        source: ["kubelet", "scheduler", "controller-manager", "api-server"][Math.floor(Math.random() * 4)],
        namespace: ["production", "staging", "development"][Math.floor(Math.random() * 3)],
        pod: `pod-${Math.random().toString(36).substr(2, 9)}`,
        container: `container-${Math.random().toString(36).substr(2, 5)}`,
        message: `Real-time log message ${Math.random().toString(36).substr(2, 9)}`,
      }
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]) // Keep last 100 logs
    }, 2000)

    return () => clearInterval(interval)
  }, [realTimeLogsEnabled])

  const executeTerminalCommand = (command: string) => {
    if (!command.trim()) return

    setTerminalHistory((prev) => [command, ...prev])
    setHistoryIndex(-1)
    setTerminalOutput((prev) => [...prev, `$ ${command}`])

    // Simulate command execution
    setTimeout(() => {
      let output = ""
      const cmd = command.trim().toLowerCase()

      if (cmd === "help") {
        output = `Available commands:
  kubectl get pods [-n namespace]
  kubectl get deployments [-n namespace]
  kubectl get services [-n namespace]
  kubectl describe pod <pod-name>
  kubectl logs <pod-name> [-f]
  kubectl exec -it <pod-name> -- /bin/bash
  clear - Clear terminal
  help - Show this help message`
      } else if (cmd.startsWith("kubectl get pods")) {
        output = `NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7d6b8c9f4d-abc123  1/1     Running   0          5d
api-server-6c8d9e7f2a-def456        1/1     Running   0          3d
worker-5b7c8d9e1f-ghi789            1/1     Running   1          2d`
      } else if (cmd.startsWith("kubectl get deployments")) {
        output = `NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           5d
api-server         2/2     2            2           3d
worker             1/1     1            1           2d`
      } else if (cmd.startsWith("kubectl get services")) {
        output = `NAME            TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
nginx-service   LoadBalancer   10.96.0.1       203.0.113.1     80:30080/TCP   5d
api-service     ClusterIP      10.96.0.2       <none>          8080/TCP       3d`
      } else if (cmd === "clear") {
        setTerminalOutput([])
        return
      } else {
        output = `Command executed: ${command}\nOutput: Success`
      }

      setTerminalOutput((prev) => [...prev, output])
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 500)

    setTerminalInput("")
  }

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeTerminalCommand(terminalInput)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < terminalHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setTerminalInput(terminalHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setTerminalInput(terminalHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setTerminalInput("")
      }
    }
  }

  useEffect(() => {
    if (!selectedPodForLogs) return

    const interval = setInterval(() => {
      const newLog = `[${new Date().toISOString()}] ${["INFO", "WARN", "ERROR", "DEBUG"][Math.floor(Math.random() * 4)]}: ${["Request processed", "Cache miss", "Database query executed", "API call completed"][Math.floor(Math.random() * 4)]}`
      setPodLogs((prev) => [...prev, newLog].slice(-100))
    }, 1000)

    return () => clearInterval(interval)
  }, [selectedPodForLogs])

  const filteredResources = resources.filter((resource) => {
    const matchesNamespace = selectedNamespace === "all" || resource.metadata.namespace === selectedNamespace
    return matchesNamespace
  })

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = logLevel === "all" || log.level === logLevel
    const matchesFilter =
      logFilter === "" ||
      log.message.toLowerCase().includes(logFilter.toLowerCase()) ||
      log.pod.toLowerCase().includes(logFilter.toLowerCase()) ||
      log.container.toLowerCase().includes(logFilter.toLowerCase())
    return matchesLevel && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
      case "Ready":
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Failed":
      case "Error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "text-blue-600"
      case "warn":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      case "debug":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enhanced Kubernetes Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Advanced resource monitoring, policy management, and real-time logging
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto-refresh" />
            <label htmlFor="auto-refresh" className="text-sm">
              Auto Refresh
            </label>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Deploy Resource
          </Button>
        </div>
      </div>

      <Tabs defaultValue="environments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="environments">Environments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="terminal">Terminal</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
        </TabsList>

        <TabsContent value="environments" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Deployment Environments</h2>
              <p className="text-muted-foreground">Manage and monitor all deployment environments</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Environment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {environments.map((env) => (
              <Card key={env.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {env.name}
                        <Badge
                          className={
                            env.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {env.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{env.cluster}</CardDescription>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{env.deployments}</div>
                      <div className="text-xs text-muted-foreground">Deployments</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{env.pods}</div>
                      <div className="text-xs text-muted-foreground">Pods</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{env.services}</div>
                      <div className="text-xs text-muted-foreground">Services</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Namespace:</span>
                      <span className="font-medium">{env.namespace}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <Badge variant="outline">{env.version}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Deployed:</span>
                      <span>{new Date(env.lastDeployed).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Activity className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Environment Comparison</CardTitle>
              <CardDescription>Compare resource usage across environments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Environment</TableHead>
                    <TableHead>CPU Usage</TableHead>
                    <TableHead>Memory Usage</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Network I/O</TableHead>
                    <TableHead>Health</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {environments.map((env) => (
                    <TableRow key={env.id}>
                      <TableCell className="font-medium">{env.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={65} className="w-20 h-2" />
                          <span className="text-sm">65%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={72} className="w-20 h-2" />
                          <span className="text-sm">72%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={45} className="w-20 h-2" />
                          <span className="text-sm">45%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">1.2 GB/s</span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Healthy
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          {/* Namespace Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Resource Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedNamespace} onValueChange={setSelectedNamespace}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Namespace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Namespaces</SelectItem>
                    <SelectItem value="production">production</SelectItem>
                    <SelectItem value="staging">staging</SelectItem>
                    <SelectItem value="development">development</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="pods">Pods</SelectItem>
                    <SelectItem value="deployments">Deployments</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="configmaps">ConfigMaps</SelectItem>
                    <SelectItem value="secrets">Secrets</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Healthy: {filteredResources.length}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    Issues: 0
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource List */}
          <Card>
            <CardHeader>
              <CardTitle>Kubernetes Resources</CardTitle>
              <CardDescription>View and manage all cluster resources</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kind</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Namespace</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Labels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{resource.kind}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{resource.metadata.name}</TableCell>
                      <TableCell>{resource.metadata.namespace}</TableCell>
                      <TableCell>
                        {Math.floor(
                          (Date.now() - new Date(resource.metadata.creationTimestamp).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                        d
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(resource.metadata.labels)
                            .slice(0, 2)
                            .map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}:{value}
                              </Badge>
                            ))}
                          {Object.keys(resource.metadata.labels).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{Object.keys(resource.metadata.labels).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor("Ready")}>Ready</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => setSelectedResource(resource)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
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

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(metrics).map(([resourceName, metric]) => (
              <Card key={resourceName}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {resourceName}
                  </CardTitle>
                  <CardDescription>Resource utilization metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        <span className="text-sm font-medium">CPU</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {metric.cpu.usage}
                        {metric.cpu.unit} / {metric.cpu.limit}
                        {metric.cpu.unit}
                      </span>
                    </div>
                    <Progress value={(metric.cpu.usage / metric.cpu.limit) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="h-4 w-4" />
                        <span className="text-sm font-medium">Memory</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {metric.memory.usage}
                        {metric.memory.unit} / {metric.memory.limit}
                        {metric.memory.unit}
                      </span>
                    </div>
                    <Progress value={(metric.memory.usage / metric.memory.limit) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        <span className="text-sm font-medium">Storage</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {metric.storage.usage}
                        {metric.storage.unit} / {metric.storage.capacity}
                        {metric.storage.unit}
                      </span>
                    </div>
                    <Progress value={(metric.storage.usage / metric.storage.capacity) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        <span className="text-sm font-medium">Network</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RX:</span>
                        <span>{formatBytes(metric.network.rxBytes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TX:</span>
                        <span>{formatBytes(metric.network.txBytes)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Resource Policies
              </CardTitle>
              <CardDescription>Manage cluster policies and compliance rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <Card key={policy.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${policy.enabled ? "bg-green-500" : "bg-red-500"}`} />
                          <div>
                            <CardTitle className="text-lg">{policy.name}</CardTitle>
                            <CardDescription>
                              {policy.type} • {policy.namespace}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {policy.violations > 0 && <Badge variant="destructive">{policy.violations} violations</Badge>}
                          <Switch checked={policy.enabled} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Policy Rules</h4>
                          <div className="space-y-1">
                            {policy.rules.map((rule, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Badge
                                  variant={rule.action === "allow" ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  {rule.action}
                                </Badge>
                                <span>{rule.resource}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{rule.conditions.join(", ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Edit Policy
                          </Button>
                          <Button size="sm" variant="outline">
                            <Activity className="h-4 w-4 mr-2" />
                            View Violations
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Real-time Pod Logs
              </CardTitle>
              <CardDescription>Stream logs from running pods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedPodForLogs} onValueChange={setSelectedPodForLogs}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select Pod" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nginx-deployment-7d6b8c9f4d-abc123">
                        nginx-deployment-7d6b8c9f4d-abc123
                      </SelectItem>
                      <SelectItem value="api-server-6c8d9e7f2a-def456">api-server-6c8d9e7f2a-def456</SelectItem>
                      <SelectItem value="worker-5b7c8d9e1f-ghi789">worker-5b7c8d9e1f-ghi789</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={realTimeLogsEnabled}
                      onCheckedChange={setRealTimeLogsEnabled}
                      id="real-time-logs"
                    />
                    <label htmlFor="real-time-logs" className="text-sm">
                      Follow Logs
                    </label>
                  </div>
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => setPodLogs([])} disabled={!selectedPodForLogs}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button size="sm" variant="outline" disabled={!selectedPodForLogs}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                {selectedPodForLogs ? (
                  <ScrollArea className="h-[500px] border rounded-lg p-4 bg-black text-green-400">
                    <div className="space-y-1 font-mono text-xs">
                      {podLogs.map((log, index) => (
                        <div key={index}>{log}</div>
                      ))}
                      {podLogs.length === 0 && <div className="text-muted-foreground">Waiting for logs...</div>}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[500px] border rounded-lg flex items-center justify-center text-muted-foreground">
                    Select a pod to view logs
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Cluster Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter events..."
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  <div className="space-y-2 font-mono text-sm">
                    {filteredLogs.map((log, index) => (
                      <div key={index} className="flex items-start gap-3 py-1">
                        <span className="text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <Badge variant="outline" className={`text-xs ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{log.source}</span>
                        <span className="text-muted-foreground text-xs">
                          {log.namespace}/{log.pod}
                        </span>
                        <span className="flex-1">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terminal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Kubernetes Terminal
              </CardTitle>
              <CardDescription>Execute kubectl commands directly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Select defaultValue="production">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production Cluster</SelectItem>
                      <SelectItem value="staging">Staging Cluster</SelectItem>
                      <SelectItem value="development">Development Cluster</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTerminalOutput(["Welcome to Kubernetes Terminal", "Type 'help' for available commands"])
                      setTerminalHistory([])
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Output
                  </Button>
                </div>

                <div
                  ref={terminalRef}
                  className="h-[500px] border rounded-lg p-4 bg-black text-green-400 overflow-auto font-mono text-sm"
                >
                  <div className="space-y-1">
                    {terminalOutput.map((line, index) => (
                      <div key={index} className="whitespace-pre-wrap">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-mono">$</span>
                  <Input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalKeyDown}
                    placeholder="Enter kubectl command..."
                    className="flex-1 font-mono bg-black text-green-400 border-green-400/30"
                  />
                  <Button onClick={() => executeTerminalCommand(terminalInput)}>
                    <Play className="h-4 w-4 mr-2" />
                    Execute
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Press ↑/↓ to navigate command history • Press Enter to execute</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cluster Configuration
                </CardTitle>
                <CardDescription>Manage cluster-wide settings and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">API Server Endpoint</label>
                  <Input value="https://k8s-cluster.company.com:6443" readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Cluster Version</label>
                  <Input value="v1.28.2" readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Default Namespace</label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">default</SelectItem>
                      <SelectItem value="production">production</SelectItem>
                      <SelectItem value="staging">staging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enable RBAC</label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Pod Security Standards</label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Resource Quotas
                </CardTitle>
                <CardDescription>Configure default resource limits and quotas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Default CPU Limit</label>
                  <Input placeholder="500m" />
                </div>
                <div>
                  <label className="text-sm font-medium">Default Memory Limit</label>
                  <Input placeholder="1Gi" />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Pods per Node</label>
                  <Input placeholder="110" />
                </div>
                <div>
                  <label className="text-sm font-medium">Storage Class</label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">standard</SelectItem>
                      <SelectItem value="fast-ssd">fast-ssd</SelectItem>
                      <SelectItem value="slow-hdd">slow-hdd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Apply Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>Resource Details: {selectedResource.metadata.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedResource(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Metadata</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kind:</span>
                      <span>{selectedResource.kind}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">API Version:</span>
                      <span>{selectedResource.apiVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Namespace:</span>
                      <span>{selectedResource.metadata.namespace}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(selectedResource.metadata.creationTimestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Labels</h4>
                  <div className="space-y-1">
                    {Object.entries(selectedResource.metadata.labels).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="mr-2">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">YAML Specification</h4>
                <Textarea
                  value={JSON.stringify(selectedResource, null, 2)}
                  readOnly
                  className="font-mono text-xs h-64"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
