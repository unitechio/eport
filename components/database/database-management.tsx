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
  Database,
  Search,
  Plus,
  RefreshCw,
  Settings,
  Eye,
  HardDrive,
  Users,
  Play,
  Square,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  BarChart3,
  Zap,
} from "lucide-react"

interface DatabaseInstance {
  id: string
  name: string
  type: "postgresql" | "mysql" | "mongodb" | "redis" | "elasticsearch"
  version: string
  status: "running" | "stopped" | "maintenance" | "error"
  environment: "production" | "staging" | "development"
  host: string
  port: number
  connections: {
    current: number
    max: number
    active: number
    idle: number
  }
  storage: {
    used: string
    total: string
    percentage: number
  }
  performance: {
    cpu: number
    memory: number
    iops: number
    latency: number
  }
  uptime: string
  lastBackup: string
  replication: {
    enabled: boolean
    role: "primary" | "replica" | "standalone"
    lag?: number
  }
}

interface DatabaseBackup {
  id: string
  database: string
  type: "full" | "incremental" | "differential"
  size: string
  created: string
  status: "completed" | "in_progress" | "failed"
  duration: string
  environment: string
}

interface DatabaseQuery {
  id: string
  database: string
  query: string
  duration: number
  rows: number
  timestamp: string
  user: string
  status: "success" | "error"
}

const mockDatabases: DatabaseInstance[] = [
  {
    id: "db1",
    name: "prod-postgres-main",
    type: "postgresql",
    version: "15.3",
    status: "running",
    environment: "production",
    host: "db-prod-01.internal",
    port: 5432,
    connections: { current: 45, max: 100, active: 32, idle: 13 },
    storage: { used: "245GB", total: "500GB", percentage: 49 },
    performance: { cpu: 35.2, memory: 68.5, iops: 1250, latency: 2.3 },
    uptime: "45d 12h 30m",
    lastBackup: "2024-01-15T02:00:00Z",
    replication: { enabled: true, role: "primary", lag: 0 },
  },
  {
    id: "db2",
    name: "prod-postgres-replica",
    type: "postgresql",
    version: "15.3",
    status: "running",
    environment: "production",
    host: "db-prod-02.internal",
    port: 5432,
    connections: { current: 28, max: 100, active: 20, idle: 8 },
    storage: { used: "245GB", total: "500GB", percentage: 49 },
    performance: { cpu: 22.8, memory: 65.2, iops: 850, latency: 2.5 },
    uptime: "45d 12h 28m",
    lastBackup: "2024-01-15T02:00:00Z",
    replication: { enabled: true, role: "replica", lag: 120 },
  },
  {
    id: "db3",
    name: "prod-redis-cache",
    type: "redis",
    version: "7.2",
    status: "running",
    environment: "production",
    host: "cache-prod-01.internal",
    port: 6379,
    connections: { current: 150, max: 10000, active: 145, idle: 5 },
    storage: { used: "8.5GB", total: "16GB", percentage: 53.1 },
    performance: { cpu: 18.5, memory: 55.2, iops: 5200, latency: 0.8 },
    uptime: "30d 8h 15m",
    lastBackup: "2024-01-15T01:00:00Z",
    replication: { enabled: false, role: "standalone" },
  },
  {
    id: "db4",
    name: "staging-mysql-app",
    type: "mysql",
    version: "8.0.35",
    status: "running",
    environment: "staging",
    host: "db-staging-01.internal",
    port: 3306,
    connections: { current: 12, max: 50, active: 8, idle: 4 },
    storage: { used: "45GB", total: "100GB", percentage: 45 },
    performance: { cpu: 12.3, memory: 42.8, iops: 450, latency: 3.2 },
    uptime: "15d 6h 45m",
    lastBackup: "2024-01-14T22:00:00Z",
    replication: { enabled: false, role: "standalone" },
  },
  {
    id: "db5",
    name: "dev-mongodb-test",
    type: "mongodb",
    version: "7.0",
    status: "stopped",
    environment: "development",
    host: "db-dev-01.internal",
    port: 27017,
    connections: { current: 0, max: 100, active: 0, idle: 0 },
    storage: { used: "12GB", total: "50GB", percentage: 24 },
    performance: { cpu: 0, memory: 0, iops: 0, latency: 0 },
    uptime: "0m",
    lastBackup: "2024-01-10T18:00:00Z",
    replication: { enabled: false, role: "standalone" },
  },
]

const mockBackups: DatabaseBackup[] = [
  {
    id: "bk1",
    database: "prod-postgres-main",
    type: "full",
    size: "245GB",
    created: "2024-01-15T02:00:00Z",
    status: "completed",
    duration: "45m 23s",
    environment: "production",
  },
  {
    id: "bk2",
    database: "prod-redis-cache",
    type: "full",
    size: "8.5GB",
    created: "2024-01-15T01:00:00Z",
    status: "completed",
    duration: "5m 12s",
    environment: "production",
  },
  {
    id: "bk3",
    database: "staging-mysql-app",
    type: "incremental",
    size: "2.3GB",
    created: "2024-01-14T22:00:00Z",
    status: "completed",
    duration: "8m 45s",
    environment: "staging",
  },
  {
    id: "bk4",
    database: "prod-postgres-main",
    type: "incremental",
    size: "12GB",
    created: "2024-01-14T14:00:00Z",
    status: "completed",
    duration: "15m 30s",
    environment: "production",
  },
]

const mockQueries: DatabaseQuery[] = [
  {
    id: "q1",
    database: "prod-postgres-main",
    query: "SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'",
    duration: 245,
    rows: 1250,
    timestamp: "2024-01-15T10:30:15Z",
    user: "api_service",
    status: "success",
  },
  {
    id: "q2",
    database: "prod-postgres-main",
    query: "UPDATE orders SET status = 'completed' WHERE id IN (...)",
    duration: 1850,
    rows: 45,
    timestamp: "2024-01-15T10:28:42Z",
    user: "order_processor",
    status: "success",
  },
  {
    id: "q3",
    database: "staging-mysql-app",
    query: "SELECT COUNT(*) FROM products WHERE category = 'electronics'",
    duration: 125,
    rows: 1,
    timestamp: "2024-01-15T10:25:30Z",
    user: "test_user",
    status: "success",
  },
  {
    id: "q4",
    database: "prod-postgres-main",
    query: "DELETE FROM sessions WHERE expires_at < NOW()",
    duration: 3200,
    rows: 850,
    timestamp: "2024-01-15T10:20:00Z",
    user: "cleanup_job",
    status: "success",
  },
]

export function DatabaseManagement() {
  const [databases, setDatabases] = useState<DatabaseInstance[]>(mockDatabases)
  const [backups, setBackups] = useState<DatabaseBackup[]>(mockBackups)
  const [queries, setQueries] = useState<DatabaseQuery[]>(mockQueries)
  const [selectedEnvironment, setSelectedEnvironment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDatabases = databases.filter((db) => {
    const matchesEnv = selectedEnvironment === "all" || db.environment === selectedEnvironment
    const matchesSearch =
      db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.host.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesEnv && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "stopped":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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

  const getTypeIcon = (type: string) => {
    return <Database className="h-5 w-5" />
  }

  const getReplicationBadge = (replication: DatabaseInstance["replication"]) => {
    if (!replication.enabled) {
      return <Badge variant="outline">Standalone</Badge>
    }
    if (replication.role === "primary") {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Primary</Badge>
    }
    return (
      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
        Replica {replication.lag ? `(${replication.lag}ms lag)` : ""}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Database Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage database instances, backups, and performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Database
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Databases</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{databases.length}</div>
            <p className="text-xs text-muted-foreground">
              {databases.filter((db) => db.status === "running").length} running
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{databases.reduce((sum, db) => sum + db.connections.current, 0)}</div>
            <p className="text-xs text-muted-foreground">
              {databases.reduce((sum, db) => sum + db.connections.active, 0)} active queries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">555GB</div>
            <p className="text-xs text-muted-foreground">of 1.16TB total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Backups</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.filter((b) => b.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
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
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search databases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="instances" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="instances">Instances</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="queries">Query Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="instances" className="space-y-6">
          <div className="grid gap-4">
            {filteredDatabases.map((db) => (
              <Card key={db.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(db.type)}
                      <div>
                        <CardTitle className="text-lg">{db.name}</CardTitle>
                        <CardDescription>
                          {db.type} {db.version} • {db.host}:{db.port}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getEnvironmentColor(db.environment)}>{db.environment}</Badge>
                      <Badge className={getStatusColor(db.status)}>{db.status}</Badge>
                      {getReplicationBadge(db.replication)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Connections</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>
                            {db.connections.current} / {db.connections.max}
                          </span>
                          <span>{Math.round((db.connections.current / db.connections.max) * 100)}%</span>
                        </div>
                        <Progress value={(db.connections.current / db.connections.max) * 100} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Active: {db.connections.active} • Idle: {db.connections.idle}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Storage</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{db.storage.used}</span>
                          <span>{db.storage.total}</span>
                        </div>
                        <Progress value={db.storage.percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">{db.storage.percentage.toFixed(1)}% used</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Performance</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>CPU:</span>
                          <span>{db.performance.cpu}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span>{db.performance.memory}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IOPS:</span>
                          <span>{db.performance.iops}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Latency:</span>
                          <span>{db.performance.latency}ms</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Status</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Uptime:</span>
                          <span>{db.uptime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Backup:</span>
                          <span>{new Date(db.lastBackup).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {db.status === "running" ? (
                      <Button size="sm" variant="outline">
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Backup
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Metrics
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
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

        <TabsContent value="backups" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Database Backups</CardTitle>
                  <CardDescription>Manage and restore database backups</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Database</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.database}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{backup.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEnvironmentColor(backup.environment)}>{backup.environment}</Badge>
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>{backup.duration}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            backup.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : backup.status === "in_progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {backup.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {backup.status === "in_progress" && <Clock className="h-3 w-3 mr-1 animate-spin" />}
                          {backup.status === "failed" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {backup.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(backup.created).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4" />
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

        <TabsContent value="queries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Query Monitor</CardTitle>
              <CardDescription>Real-time database query performance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Database</TableHead>
                    <TableHead>Query</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="font-medium">{query.database}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{query.query.substring(0, 50)}...</code>
                      </TableCell>
                      <TableCell>{query.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {query.duration > 1000 && <Zap className="h-3 w-3 text-orange-500" />}
                          {query.duration}ms
                        </div>
                      </TableCell>
                      <TableCell>{query.rows.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            query.status === "success"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {query.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(query.timestamp).toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
