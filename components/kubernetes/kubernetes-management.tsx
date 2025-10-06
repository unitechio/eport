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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Network,
  RotateCcw,
  Trash2,
  Settings,
  Eye,
  Terminal,
  FileText,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Layers,
  Box,
  Globe,
  Shield,
  Activity,
} from "lucide-react"

interface KubernetesPod {
  name: string
  namespace: string
  status: "Running" | "Pending" | "Failed" | "Succeeded" | "Unknown"
  ready: string
  restarts: number
  age: string
  node: string
  cpuUsage: number
  memoryUsage: number
  cpuRequest: string
  memoryRequest: string
  cpuLimit: string
  memoryLimit: string
  environment: "development" | "staging" | "production"
  labels: Record<string, string>
  containers: Array<{
    name: string
    image: string
    status: string
    restartCount: number
  }>
}

interface KubernetesDeployment {
  name: string
  namespace: string
  ready: string
  upToDate: number
  available: number
  age: string
  strategy: string
  environment: "development" | "staging" | "production"
  replicas: {
    desired: number
    current: number
    ready: number
    updated: number
  }
  conditions: Array<{
    type: string
    status: string
    reason: string
    message: string
  }>
}

interface KubernetesService {
  name: string
  namespace: string
  type: "ClusterIP" | "NodePort" | "LoadBalancer" | "ExternalName"
  clusterIP: string
  externalIP: string
  ports: string[]
  age: string
  environment: "development" | "staging" | "production"
  selector: Record<string, string>
  endpoints: number
}

interface KubernetesNode {
  name: string
  status: "Ready" | "NotReady" | "Unknown"
  roles: string[]
  age: string
  version: string
  internalIP: string
  externalIP: string
  osImage: string
  kernelVersion: string
  containerRuntime: string
  cpuCapacity: string
  memoryCapacity: string
  cpuAllocatable: string
  memoryAllocatable: string
  cpuUsage: number
  memoryUsage: number
  podCount: number
  podCapacity: number
  conditions: Array<{
    type: string
    status: string
    reason: string
    message: string
  }>
}

interface KubernetesNamespace {
  name: string
  status: "Active" | "Terminating"
  age: string
  environment: "development" | "staging" | "production"
  resourceQuota: {
    cpuLimit: string
    memoryLimit: string
    podLimit: string
    used: {
      cpu: string
      memory: string
      pods: number
    }
  }
  labels: Record<string, string>
}

const mockPods: KubernetesPod[] = [
  {
    name: "nginx-deployment-7d8c6c8d4f-abc12",
    namespace: "production",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "2d",
    node: "worker-node-1",
    cpuUsage: 15.2,
    memoryUsage: 45.8,
    cpuRequest: "100m",
    memoryRequest: "128Mi",
    cpuLimit: "500m",
    memoryLimit: "512Mi",
    environment: "production",
    labels: { app: "nginx", version: "v1.21" },
    containers: [
      {
        name: "nginx",
        image: "nginx:1.21-alpine",
        status: "Running",
        restartCount: 0,
      },
    ],
  },
  {
    name: "api-server-6b8f9c7d5e-def34",
    namespace: "production",
    status: "Running",
    ready: "1/1",
    restarts: 1,
    age: "1d",
    node: "worker-node-2",
    cpuUsage: 32.7,
    memoryUsage: 78.3,
    cpuRequest: "200m",
    memoryRequest: "256Mi",
    cpuLimit: "1000m",
    memoryLimit: "1Gi",
    environment: "production",
    labels: { app: "api-server", tier: "backend" },
    containers: [
      {
        name: "api-server",
        image: "node:18-alpine",
        status: "Running",
        restartCount: 1,
      },
    ],
  },
  {
    name: "redis-master-5c4d3e2f1g-ghi56",
    namespace: "production",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "5d",
    node: "worker-node-1",
    cpuUsage: 8.1,
    memoryUsage: 25.4,
    cpuRequest: "50m",
    memoryRequest: "64Mi",
    cpuLimit: "200m",
    memoryLimit: "256Mi",
    environment: "production",
    labels: { app: "redis", role: "master" },
    containers: [
      {
        name: "redis",
        image: "redis:7-alpine",
        status: "Running",
        restartCount: 0,
      },
    ],
  },
]

const mockDeployments: KubernetesDeployment[] = [
  {
    name: "nginx-deployment",
    namespace: "production",
    ready: "3/3",
    upToDate: 3,
    available: 3,
    age: "2d",
    strategy: "RollingUpdate",
    environment: "production",
    replicas: {
      desired: 3,
      current: 3,
      ready: 3,
      updated: 3,
    },
    conditions: [
      {
        type: "Progressing",
        status: "True",
        reason: "NewReplicaSetAvailable",
        message: "ReplicaSet has successfully progressed.",
      },
    ],
  },
  {
    name: "api-server",
    namespace: "production",
    ready: "2/2",
    upToDate: 2,
    available: 2,
    age: "1d",
    strategy: "RollingUpdate",
    environment: "production",
    replicas: {
      desired: 2,
      current: 2,
      ready: 2,
      updated: 2,
    },
    conditions: [
      {
        type: "Available",
        status: "True",
        reason: "MinimumReplicasAvailable",
        message: "Deployment has minimum availability.",
      },
    ],
  },
]

const mockServices: KubernetesService[] = [
  {
    name: "nginx-service",
    namespace: "production",
    type: "LoadBalancer",
    clusterIP: "10.96.0.10",
    externalIP: "203.0.113.10",
    ports: ["80:30080/TCP", "443:30443/TCP"],
    age: "2d",
    environment: "production",
    selector: { app: "nginx" },
    endpoints: 3,
  },
  {
    name: "api-service",
    namespace: "production",
    type: "ClusterIP",
    clusterIP: "10.96.0.20",
    externalIP: "<none>",
    ports: ["3000:3000/TCP"],
    age: "1d",
    environment: "production",
    selector: { app: "api-server" },
    endpoints: 2,
  },
  {
    name: "redis-service",
    namespace: "production",
    type: "ClusterIP",
    clusterIP: "10.96.0.30",
    externalIP: "<none>",
    ports: ["6379:6379/TCP"],
    age: "5d",
    environment: "production",
    selector: { app: "redis" },
    endpoints: 1,
  },
]

const mockNodes: KubernetesNode[] = [
  {
    name: "master-node",
    status: "Ready",
    roles: ["control-plane", "master"],
    age: "30d",
    version: "v1.28.0",
    internalIP: "192.168.1.10",
    externalIP: "203.0.113.10",
    osImage: "Ubuntu 22.04.3 LTS",
    kernelVersion: "5.15.0-78-generic",
    containerRuntime: "containerd://1.7.2",
    cpuCapacity: "4",
    memoryCapacity: "8Gi",
    cpuAllocatable: "3900m",
    memoryAllocatable: "7.5Gi",
    cpuUsage: 25.3,
    memoryUsage: 45.2,
    podCount: 15,
    podCapacity: 110,
    conditions: [
      {
        type: "Ready",
        status: "True",
        reason: "KubeletReady",
        message: "kubelet is posting ready status",
      },
    ],
  },
  {
    name: "worker-node-1",
    status: "Ready",
    roles: ["worker"],
    age: "25d",
    version: "v1.28.0",
    internalIP: "192.168.1.11",
    externalIP: "203.0.113.11",
    osImage: "Ubuntu 22.04.3 LTS",
    kernelVersion: "5.15.0-78-generic",
    containerRuntime: "containerd://1.7.2",
    cpuCapacity: "8",
    memoryCapacity: "16Gi",
    cpuAllocatable: "7800m",
    memoryAllocatable: "15Gi",
    cpuUsage: 42.7,
    memoryUsage: 68.3,
    podCount: 28,
    podCapacity: 110,
    conditions: [
      {
        type: "Ready",
        status: "True",
        reason: "KubeletReady",
        message: "kubelet is posting ready status",
      },
    ],
  },
  {
    name: "worker-node-2",
    status: "Ready",
    roles: ["worker"],
    age: "25d",
    version: "v1.28.0",
    internalIP: "192.168.1.12",
    externalIP: "203.0.113.12",
    osImage: "Ubuntu 22.04.3 LTS",
    kernelVersion: "5.15.0-78-generic",
    containerRuntime: "containerd://1.7.2",
    cpuCapacity: "8",
    memoryCapacity: "16Gi",
    cpuAllocatable: "7800m",
    memoryAllocatable: "15Gi",
    cpuUsage: 38.1,
    memoryUsage: 52.7,
    podCount: 22,
    podCapacity: 110,
    conditions: [
      {
        type: "Ready",
        status: "True",
        reason: "KubeletReady",
        message: "kubelet is posting ready status",
      },
    ],
  },
]

const mockNamespaces: KubernetesNamespace[] = [
  {
    name: "production",
    status: "Active",
    age: "30d",
    environment: "production",
    resourceQuota: {
      cpuLimit: "10",
      memoryLimit: "20Gi",
      podLimit: "50",
      used: {
        cpu: "2.5",
        memory: "8Gi",
        pods: 15,
      },
    },
    labels: { environment: "production", team: "platform" },
  },
  {
    name: "staging",
    status: "Active",
    age: "25d",
    environment: "staging",
    resourceQuota: {
      cpuLimit: "5",
      memoryLimit: "10Gi",
      podLimit: "25",
      used: {
        cpu: "1.2",
        memory: "3Gi",
        pods: 8,
      },
    },
    labels: { environment: "staging", team: "platform" },
  },
  {
    name: "development",
    status: "Active",
    age: "20d",
    environment: "development",
    resourceQuota: {
      cpuLimit: "2",
      memoryLimit: "4Gi",
      podLimit: "10",
      used: {
        cpu: "0.5",
        memory: "1Gi",
        pods: 3,
      },
    },
    labels: { environment: "development", team: "platform" },
  },
]

export function KubernetesManagement() {
  const [pods, setPods] = useState<KubernetesPod[]>(mockPods)
  const [deployments, setDeployments] = useState<KubernetesDeployment[]>(mockDeployments)
  const [services, setServices] = useState<KubernetesService[]>(mockServices)
  const [nodes, setNodes] = useState<KubernetesNode[]>(mockNodes)
  const [namespaces, setNamespaces] = useState<KubernetesNamespace[]>(mockNamespaces)
  const [selectedNamespace, setSelectedNamespace] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPod, setSelectedPod] = useState<KubernetesPod | null>(null)

  const filteredPods = pods.filter((pod) => {
    const matchesNamespace = selectedNamespace === "all" || pod.namespace === selectedNamespace
    const matchesSearch =
      pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pod.namespace.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesNamespace && matchesSearch
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
      case "NotReady":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Succeeded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Terminating":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
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

  const handlePodAction = (podName: string, action: string) => {
    console.log(`[v0] Pod action: ${action} on ${podName}`)
    // Simulate action
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kubernetes Management</h1>
          <p className="text-muted-foreground mt-2">Manage Kubernetes resources across clusters and namespaces</p>
        </div>
        <div className="flex gap-2">
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

      {/* Cluster Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodes.length}</div>
            <p className="text-xs text-muted-foreground">{nodes.filter((n) => n.status === "Ready").length} ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Pods</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pods.filter((p) => p.status === "Running").length}</div>
            <p className="text-xs text-muted-foreground">{pods.length} total pods</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployments.length}</div>
            <p className="text-xs text-muted-foreground">
              {deployments.filter((d) => d.ready.split("/")[0] === d.ready.split("/")[1]).length} healthy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              {services.filter((s) => s.type === "LoadBalancer").length} external
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Namespace Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Namespace & Filters
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
                <SelectItem value="kube-system">kube-system</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Running: {pods.filter((p) => p.status === "Running").length}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Pending: {pods.filter((p) => p.status === "Pending").length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pods" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pods">Pods</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="namespaces">Namespaces</TabsTrigger>
        </TabsList>

        <TabsContent value="pods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pods</CardTitle>
              <CardDescription>
                Showing {filteredPods.length} of {pods.length} pods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Namespace</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ready</TableHead>
                      <TableHead>Restarts</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Node</TableHead>
                      <TableHead>CPU</TableHead>
                      <TableHead>Memory</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPods.map((pod) => (
                      <TableRow key={pod.name}>
                        <TableCell className="font-medium">{pod.name}</TableCell>
                        <TableCell>
                          <Badge className={getEnvironmentColor(pod.environment)}>{pod.namespace}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pod.status)}>{pod.status}</Badge>
                        </TableCell>
                        <TableCell>{pod.ready}</TableCell>
                        <TableCell>{pod.restarts}</TableCell>
                        <TableCell>{pod.age}</TableCell>
                        <TableCell>{pod.node}</TableCell>
                        <TableCell>
                          <div className="w-16">
                            <div className="text-xs mb-1">{pod.cpuUsage}%</div>
                            <Progress value={pod.cpuUsage} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-16">
                            <div className="text-xs mb-1">{pod.memoryUsage}%</div>
                            <Progress value={pod.memoryUsage} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => setSelectedPod(pod)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Terminal className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4" />
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
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployments</CardTitle>
              <CardDescription>Manage application deployments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Namespace</TableHead>
                    <TableHead>Ready</TableHead>
                    <TableHead>Up-to-date</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Strategy</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deployments.map((deployment) => (
                    <TableRow key={deployment.name}>
                      <TableCell className="font-medium">{deployment.name}</TableCell>
                      <TableCell>
                        <Badge className={getEnvironmentColor(deployment.environment)}>{deployment.namespace}</Badge>
                      </TableCell>
                      <TableCell>{deployment.ready}</TableCell>
                      <TableCell>{deployment.upToDate}</TableCell>
                      <TableCell>{deployment.available}</TableCell>
                      <TableCell>{deployment.age}</TableCell>
                      <TableCell>{deployment.strategy}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <RotateCcw className="h-4 w-4" />
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

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Network services and load balancing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Namespace</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Cluster IP</TableHead>
                    <TableHead>External IP</TableHead>
                    <TableHead>Ports</TableHead>
                    <TableHead>Endpoints</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <Badge className={getEnvironmentColor(service.environment)}>{service.namespace}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{service.clusterIP}</TableCell>
                      <TableCell className="font-mono text-sm">{service.externalIP}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {service.ports.map((port, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {port}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{service.endpoints}</TableCell>
                      <TableCell>{service.age}</TableCell>
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

        <TabsContent value="nodes" className="space-y-6">
          <div className="grid gap-4">
            {nodes.map((node) => (
              <Card key={node.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Network className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{node.name}</CardTitle>
                        <CardDescription>
                          {node.roles.join(", ")} • {node.version}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(node.status)}>{node.status}</Badge>
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
                            <span>{node.cpuUsage}%</span>
                          </div>
                          <Progress value={node.cpuUsage} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Memory</span>
                            <span>{node.memoryUsage}%</span>
                          </div>
                          <Progress value={node.memoryUsage} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Capacity</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>CPU:</span>
                          <span>{node.cpuCapacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span>{node.memoryCapacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pods:</span>
                          <span>
                            {node.podCount}/{node.podCapacity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Network</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Internal:</span>
                          <span className="font-mono">{node.internalIP}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>External:</span>
                          <span className="font-mono">{node.externalIP}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">System Info</h4>
                      <div className="space-y-1 text-xs">
                        <div>OS: {node.osImage}</div>
                        <div>Kernel: {node.kernelVersion}</div>
                        <div>Runtime: {node.containerRuntime}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Terminal className="h-4 w-4 mr-2" />
                      SSH
                    </Button>
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Metrics
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="namespaces" className="space-y-6">
          <div className="grid gap-4">
            {namespaces.map((namespace) => (
              <Card key={namespace.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{namespace.name}</CardTitle>
                        <CardDescription>Age: {namespace.age}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getEnvironmentColor(namespace.environment)}>{namespace.environment}</Badge>
                      <Badge className={getStatusColor(namespace.status)}>{namespace.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Resource Quota</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>CPU</span>
                            <span>
                              {namespace.resourceQuota.used.cpu}/{namespace.resourceQuota.cpuLimit}
                            </span>
                          </div>
                          <Progress
                            value={
                              (Number.parseFloat(namespace.resourceQuota.used.cpu) /
                                Number.parseFloat(namespace.resourceQuota.cpuLimit)) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Memory</span>
                            <span>
                              {namespace.resourceQuota.used.memory}/{namespace.resourceQuota.memoryLimit}
                            </span>
                          </div>
                          <Progress
                            value={
                              (Number.parseFloat(namespace.resourceQuota.used.memory.replace("Gi", "")) /
                                Number.parseFloat(namespace.resourceQuota.memoryLimit.replace("Gi", ""))) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Pods</span>
                            <span>
                              {namespace.resourceQuota.used.pods}/{namespace.resourceQuota.podLimit}
                            </span>
                          </div>
                          <Progress
                            value={
                              (namespace.resourceQuota.used.pods / Number.parseInt(namespace.resourceQuota.podLimit)) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Labels</h4>
                      <div className="space-y-1">
                        {Object.entries(namespace.labels).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Statistics</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Pods:</span>
                          <span>{namespace.resourceQuota.used.pods}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CPU Usage:</span>
                          <span>{namespace.resourceQuota.used.cpu}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory Usage:</span>
                          <span>{namespace.resourceQuota.used.memory}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Resources
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Policies
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pod Detail Modal */}
      {selectedPod && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>Pod Details: {selectedPod.name}</CardTitle>
              <Button variant="ghost" size="sm" className="absolute top-4 right-4" onClick={() => setSelectedPod(null)}>
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Namespace:</span>
                      <span>{selectedPod.namespace}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedPod.status)}>{selectedPod.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Node:</span>
                      <span>{selectedPod.node}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span>{selectedPod.age}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Resource Requests/Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPU Request:</span>
                      <span>{selectedPod.cpuRequest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPU Limit:</span>
                      <span>{selectedPod.cpuLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Memory Request:</span>
                      <span>{selectedPod.memoryRequest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Memory Limit:</span>
                      <span>{selectedPod.memoryLimit}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Containers</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Restart Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPod.containers.map((container, index) => (
                      <TableRow key={index}>
                        <TableCell>{container.name}</TableCell>
                        <TableCell>{container.image}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(container.status)}>{container.status}</Badge>
                        </TableCell>
                        <TableCell>{container.restartCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Labels</h4>
                <div className="space-y-1">
                  {Object.entries(selectedPod.labels).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="mr-2">
                      {key}: {value}
                    </Badge>
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
