"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Puzzle,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Container,
  Database,
  Cloud,
  Mail,
  Slack,
  Github,
  Activity,
  Zap,
  Shield,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Integration {
  id: string
  name: string
  type: "container" | "database" | "monitoring" | "notification" | "ci_cd" | "security" | "cloud"
  status: "connected" | "disconnected" | "error" | "pending"
  description: string
  icon: any
  version?: string
  lastSync?: string
  endpoint?: string
  config: Record<string, any>
  metrics?: {
    requests: number
    errors: number
    uptime: string
  }
}

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Docker Engine",
    type: "container",
    status: "connected",
    description: "Container runtime and orchestration",
    icon: Container,
    version: "24.0.7",
    lastSync: "2024-01-15T10:30:00Z",
    endpoint: "unix:///var/run/docker.sock",
    config: {
      host: "localhost",
      port: 2376,
      tls: true,
    },
    metrics: {
      requests: 1247,
      errors: 3,
      uptime: "99.8%",
    },
  },
  {
    id: "2",
    name: "Kubernetes",
    type: "container",
    status: "connected",
    description: "Container orchestration platform",
    icon: Puzzle,
    version: "v1.28.4",
    lastSync: "2024-01-15T10:25:00Z",
    endpoint: "https://k8s-api.company.com",
    config: {
      cluster: "production",
      namespace: "default",
      kubeconfig: "/etc/kubernetes/admin.conf",
    },
    metrics: {
      requests: 2156,
      errors: 12,
      uptime: "99.5%",
    },
  },
  {
    id: "3",
    name: "PostgreSQL",
    type: "database",
    status: "connected",
    description: "Primary database cluster",
    icon: Database,
    version: "15.4",
    lastSync: "2024-01-15T10:20:00Z",
    endpoint: "postgresql://db-primary.company.com:5432",
    config: {
      host: "db-primary.company.com",
      port: 5432,
      database: "infrastructure",
      ssl: true,
    },
    metrics: {
      requests: 5432,
      errors: 8,
      uptime: "99.9%",
    },
  },
  {
    id: "4",
    name: "Prometheus",
    type: "monitoring",
    status: "connected",
    description: "Metrics collection and monitoring",
    icon: Activity,
    version: "2.47.2",
    lastSync: "2024-01-15T10:15:00Z",
    endpoint: "http://prometheus.company.com:9090",
    config: {
      retention: "30d",
      scrapeInterval: "15s",
      alertmanager: "http://alertmanager.company.com:9093",
    },
    metrics: {
      requests: 8765,
      errors: 15,
      uptime: "99.7%",
    },
  },
  {
    id: "5",
    name: "Slack",
    type: "notification",
    status: "connected",
    description: "Team communication and alerts",
    icon: Slack,
    lastSync: "2024-01-15T10:10:00Z",
    endpoint: "https://hooks.slack.com/services/...",
    config: {
      channel: "#infrastructure-alerts",
      webhook: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    },
    metrics: {
      requests: 234,
      errors: 1,
      uptime: "100%",
    },
  },
  {
    id: "6",
    name: "GitHub Actions",
    type: "ci_cd",
    status: "error",
    description: "CI/CD pipeline integration",
    icon: Github,
    lastSync: "2024-01-15T09:45:00Z",
    endpoint: "https://api.github.com",
    config: {
      organization: "company",
      repository: "infrastructure",
      token: "ghp_xxxxxxxxxxxxxxxxxxxx",
    },
    metrics: {
      requests: 156,
      errors: 23,
      uptime: "95.2%",
    },
  },
  {
    id: "7",
    name: "AWS CloudWatch",
    type: "cloud",
    status: "pending",
    description: "Cloud monitoring and logging",
    icon: Cloud,
    endpoint: "https://monitoring.us-east-1.amazonaws.com",
    config: {
      region: "us-east-1",
      accessKeyId: "AKIA...",
      logGroups: ["/aws/lambda/infrastructure", "/aws/ec2/instances"],
    },
  },
]

const typeConfig = {
  container: { color: "bg-blue-100 text-blue-800", label: "Container", icon: Container },
  database: { color: "bg-green-100 text-green-800", label: "Database", icon: Database },
  monitoring: { color: "bg-purple-100 text-purple-800", label: "Monitoring", icon: Activity },
  notification: { color: "bg-yellow-100 text-yellow-800", label: "Notification", icon: Mail },
  ci_cd: { color: "bg-orange-100 text-orange-800", label: "CI/CD", icon: Zap },
  security: { color: "bg-red-100 text-red-800", label: "Security", icon: Shield },
  cloud: { color: "bg-indigo-100 text-indigo-800", label: "Cloud", icon: Cloud },
}

const statusConfig = {
  connected: { color: "bg-green-100 text-green-800", label: "Connected", icon: CheckCircle },
  disconnected: { color: "bg-gray-100 text-gray-800", label: "Disconnected", icon: XCircle },
  error: { color: "bg-red-100 text-red-800", label: "Error", icon: AlertTriangle },
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending", icon: Clock },
}

export function IntegrationManagement() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAddIntegrationOpen, setIsAddIntegrationOpen] = useState(false)

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesType = selectedType === "all" || integration.type === selectedType
    const matchesStatus = selectedStatus === "all" || integration.status === selectedStatus
    return matchesType && matchesStatus
  })

  const integrationCounts = {
    total: integrations.length,
    connected: integrations.filter((i) => i.status === "connected").length,
    error: integrations.filter((i) => i.status === "error").length,
    pending: integrations.filter((i) => i.status === "pending").length,
  }

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              status: integration.status === "connected" ? ("disconnected" as const) : ("connected" as const),
            }
          : integration,
      ),
    )
  }

  const handleRefreshIntegration = (integrationId: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === integrationId
          ? { ...integration, lastSync: new Date().toISOString(), status: "connected" as const }
          : integration,
      ),
    )
  }

  const IntegrationCard = ({ integration }: { integration: Integration }) => {
    const typeInfo = typeConfig[integration.type]
    const statusInfo = statusConfig[integration.status]
    const Icon = integration.icon
    const StatusIcon = statusInfo.icon

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-muted">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{integration.name}</CardTitle>
                <CardDescription className="mt-1">{integration.description}</CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                  <Badge variant="outline" className={typeInfo.color}>
                    {typeInfo.label}
                  </Badge>
                  {integration.version && <Badge variant="secondary">v{integration.version}</Badge>}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleRefreshIntegration(integration.id)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Configure
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Logs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleToggleIntegration(integration.id)}>
                  {integration.status === "connected" ? (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Connect
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integration.endpoint && (
              <div className="text-sm">
                <span className="font-medium">Endpoint: </span>
                <span className="text-muted-foreground font-mono text-xs">{integration.endpoint}</span>
              </div>
            )}
            {integration.lastSync && (
              <div className="text-sm">
                <span className="font-medium">Last Sync: </span>
                <span className="text-muted-foreground">{new Date(integration.lastSync).toLocaleString()}</span>
              </div>
            )}
            {integration.metrics && (
              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold">{integration.metrics.requests.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">{integration.metrics.errors}</div>
                  <div className="text-xs text-muted-foreground">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{integration.metrics.uptime}</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
            )}
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
          <h1 className="text-3xl font-bold tracking-tight">Integration Management</h1>
          <p className="text-muted-foreground">Manage Docker, Kubernetes, and third-party integrations</p>
        </div>
        <Dialog open={isAddIntegrationOpen} onOpenChange={setIsAddIntegrationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Integration</DialogTitle>
              <DialogDescription>Connect a new service or platform to your infrastructure</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Integration Name</Label>
                  <Input id="name" placeholder="e.g., Production Docker" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" placeholder="e.g., container, database" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endpoint">Endpoint URL</Label>
                <Input id="endpoint" placeholder="e.g., https://api.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description of the integration" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddIntegrationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddIntegrationOpen(false)}>Add Integration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Puzzle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationCounts.total}</div>
            <p className="text-xs text-muted-foreground">All configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{integrationCounts.connected}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{integrationCounts.error}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{integrationCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Being configured</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedType("all")}>
            All ({integrations.length})
          </TabsTrigger>
          <TabsTrigger value="container" onClick={() => setSelectedType("container")}>
            Container ({integrations.filter((i) => i.type === "container").length})
          </TabsTrigger>
          <TabsTrigger value="database" onClick={() => setSelectedType("database")}>
            Database ({integrations.filter((i) => i.type === "database").length})
          </TabsTrigger>
          <TabsTrigger value="monitoring" onClick={() => setSelectedType("monitoring")}>
            Monitoring ({integrations.filter((i) => i.type === "monitoring").length})
          </TabsTrigger>
          <TabsTrigger value="notification" onClick={() => setSelectedType("notification")}>
            Notification ({integrations.filter((i) => i.type === "notification").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="container" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations
              .filter((i) => i.type === "container")
              .map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations
              .filter((i) => i.type === "database")
              .map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations
              .filter((i) => i.type === "monitoring")
              .map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="notification" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations
              .filter((i) => i.type === "notification")
              .map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Setup</CardTitle>
          <CardDescription>Popular integrations you can set up quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <Container className="w-6 h-6" />
              <span className="text-sm">Docker</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <Puzzle className="w-6 h-6" />
              <span className="text-sm">Kubernetes</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <Activity className="w-6 h-6" />
              <span className="text-sm">Prometheus</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <Slack className="w-6 h-6" />
              <span className="text-sm">Slack</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
