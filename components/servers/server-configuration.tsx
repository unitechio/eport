"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Network,
  Settings,
  FileText,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Eye,
  Terminal,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  User,
  Lock,
  Wifi,
  Activity,
  HardDrive,
  Heart,
  Database,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react"

interface FirewallRule {
  id: string
  name: string
  action: "allow" | "deny" | "reject"
  protocol: "tcp" | "udp" | "icmp" | "all"
  port: string
  source: string
  destination: string
  enabled: boolean
  priority: number
  description: string
}

interface ServiceConfig {
  name: string
  status: "active" | "inactive" | "failed"
  enabled: boolean
  description: string
  configFile: string
  ports: string[]
  dependencies: string[]
  autoRestart: boolean
  restartPolicy: "always" | "on-failure" | "unless-stopped"
}

interface SystemConfig {
  hostname: string
  timezone: string
  locale: string
  keyboardLayout: string
  swapSize: string
  maxOpenFiles: string
  kernelParameters: Record<string, string>
  environmentVariables: Record<string, string>
}

interface NetworkConfig {
  interface: string
  type: "static" | "dhcp"
  ipAddress: string
  netmask: string
  gateway: string
  dns: string[]
  mtu: number
  enabled: boolean
}

interface UserAccount {
  username: string
  uid: number
  gid: number
  groups: string[]
  shell: string
  homeDir: string
  lastLogin: string
  status: "active" | "locked" | "disabled"
  sudoAccess: boolean
  sshKeyCount: number
}

interface ConfigFile {
  path: string
  name: string
  size: string
  modified: string
  owner: string
  permissions: string
  backup: boolean
  syntax: "bash" | "nginx" | "apache" | "json" | "yaml" | "ini" | "plain"
}

interface BackupConfig {
  id: string
  name: string
  type: "full" | "incremental" | "differential"
  schedule: string
  destination: string
  retention: number
  compression: boolean
  encryption: boolean
  lastBackup: string
  nextBackup: string
  status: "active" | "paused" | "failed"
  size: string
}

interface HealthCheck {
  id: string
  name: string
  type: "http" | "tcp" | "ping" | "script"
  target: string
  interval: number
  timeout: number
  retries: number
  enabled: boolean
  status: "healthy" | "unhealthy" | "unknown"
  lastCheck: string
  uptime: string
  responseTime: number
}

interface DiskConfig {
  device: string
  mountPoint: string
  filesystem: string
  size: string
  used: string
  available: string
  usagePercent: number
  inodesUsed: string
  inodesTotal: string
  readOnly: boolean
  autoMount: boolean
  mountOptions: string[]
}

interface PortConfig {
  port: number
  protocol: "tcp" | "udp"
  service: string
  process: string
  pid: number
  state: "listening" | "established" | "closed"
  localAddress: string
  remoteAddress: string
  enabled: boolean
}

export function ServerConfiguration() {
  const [activeTab, setActiveTab] = useState("firewall")
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([
    {
      id: "1",
      name: "SSH Access",
      action: "allow",
      protocol: "tcp",
      port: "22",
      source: "0.0.0.0/0",
      destination: "any",
      enabled: true,
      priority: 1,
      description: "Allow SSH access from anywhere",
    },
    {
      id: "2",
      name: "HTTP Traffic",
      action: "allow",
      protocol: "tcp",
      port: "80",
      source: "0.0.0.0/0",
      destination: "any",
      enabled: true,
      priority: 2,
      description: "Allow HTTP web traffic",
    },
    {
      id: "3",
      name: "HTTPS Traffic",
      action: "allow",
      protocol: "tcp",
      port: "443",
      source: "0.0.0.0/0",
      destination: "any",
      enabled: true,
      priority: 3,
      description: "Allow HTTPS web traffic",
    },
    {
      id: "4",
      name: "Block Telnet",
      action: "deny",
      protocol: "tcp",
      port: "23",
      source: "0.0.0.0/0",
      destination: "any",
      enabled: true,
      priority: 4,
      description: "Block insecure Telnet protocol",
    },
  ])

  const [services, setServices] = useState<ServiceConfig[]>([
    {
      name: "nginx",
      status: "active",
      enabled: true,
      description: "HTTP and reverse proxy server",
      configFile: "/etc/nginx/nginx.conf",
      ports: ["80", "443"],
      dependencies: ["network.target"],
      autoRestart: true,
      restartPolicy: "always",
    },
    {
      name: "postgresql",
      status: "active",
      enabled: true,
      description: "PostgreSQL database server",
      configFile: "/etc/postgresql/14/main/postgresql.conf",
      ports: ["5432"],
      dependencies: ["network.target"],
      autoRestart: true,
      restartPolicy: "always",
    },
    {
      name: "redis",
      status: "active",
      enabled: true,
      description: "In-memory data structure store",
      configFile: "/etc/redis/redis.conf",
      ports: ["6379"],
      dependencies: ["network.target"],
      autoRestart: true,
      restartPolicy: "on-failure",
    },
    {
      name: "fail2ban",
      status: "active",
      enabled: true,
      description: "Intrusion prevention system",
      configFile: "/etc/fail2ban/jail.conf",
      ports: [],
      dependencies: ["network.target"],
      autoRestart: true,
      restartPolicy: "always",
    },
  ])

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    hostname: "server-001",
    timezone: "UTC",
    locale: "en_US.UTF-8",
    keyboardLayout: "us",
    swapSize: "2G",
    maxOpenFiles: "65536",
    kernelParameters: {
      "vm.swappiness": "10",
      "net.core.rmem_max": "16777216",
      "net.core.wmem_max": "16777216",
    },
    environmentVariables: {
      PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      LANG: "en_US.UTF-8",
      TZ: "UTC",
    },
  })

  const [networkConfigs, setNetworkConfigs] = useState<NetworkConfig[]>([
    {
      interface: "eth0",
      type: "static",
      ipAddress: "192.168.1.100",
      netmask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: ["8.8.8.8", "8.8.4.4"],
      mtu: 1500,
      enabled: true,
    },
    {
      interface: "eth1",
      type: "static",
      ipAddress: "10.0.0.100",
      netmask: "255.255.255.0",
      gateway: "10.0.0.1",
      dns: ["1.1.1.1", "1.0.0.1"],
      mtu: 1500,
      enabled: true,
    },
  ])

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([
    {
      username: "root",
      uid: 0,
      gid: 0,
      groups: ["root"],
      shell: "/bin/bash",
      homeDir: "/root",
      lastLogin: "2024-01-15T10:30:00Z",
      status: "active",
      sudoAccess: true,
      sshKeyCount: 2,
    },
    {
      username: "admin",
      uid: 1000,
      gid: 1000,
      groups: ["admin", "sudo", "docker"],
      shell: "/bin/bash",
      homeDir: "/home/admin",
      lastLogin: "2024-01-15T09:15:00Z",
      status: "active",
      sudoAccess: true,
      sshKeyCount: 1,
    },
    {
      username: "deploy",
      uid: 1001,
      gid: 1001,
      groups: ["deploy", "docker"],
      shell: "/bin/bash",
      homeDir: "/home/deploy",
      lastLogin: "2024-01-14T16:20:00Z",
      status: "active",
      sudoAccess: false,
      sshKeyCount: 3,
    },
  ])

  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([
    {
      path: "/etc/nginx/nginx.conf",
      name: "nginx.conf",
      size: "2.4 KB",
      modified: "2024-01-15T08:30:00Z",
      owner: "root:root",
      permissions: "644",
      backup: true,
      syntax: "nginx",
    },
    {
      path: "/etc/postgresql/14/main/postgresql.conf",
      name: "postgresql.conf",
      size: "28.5 KB",
      modified: "2024-01-12T14:15:00Z",
      owner: "postgres:postgres",
      permissions: "644",
      backup: true,
      syntax: "ini",
    },
    {
      path: "/etc/ssh/sshd_config",
      name: "sshd_config",
      size: "3.2 KB",
      modified: "2024-01-10T10:00:00Z",
      owner: "root:root",
      permissions: "644",
      backup: true,
      syntax: "plain",
    },
    {
      path: "/etc/fail2ban/jail.conf",
      name: "jail.conf",
      size: "15.8 KB",
      modified: "2024-01-08T16:45:00Z",
      owner: "root:root",
      permissions: "644",
      backup: true,
      syntax: "ini",
    },
  ])

  const [backupConfigs, setBackupConfigs] = useState<BackupConfig[]>([
    {
      id: "1",
      name: "Daily Full Backup",
      type: "full",
      schedule: "0 2 * * *",
      destination: "/backup/daily",
      retention: 7,
      compression: true,
      encryption: true,
      lastBackup: "2024-01-15T02:00:00Z",
      nextBackup: "2024-01-16T02:00:00Z",
      status: "active",
      size: "45.2 GB",
    },
    {
      id: "2",
      name: "Hourly Incremental",
      type: "incremental",
      schedule: "0 * * * *",
      destination: "/backup/hourly",
      retention: 24,
      compression: true,
      encryption: false,
      lastBackup: "2024-01-15T14:00:00Z",
      nextBackup: "2024-01-15T15:00:00Z",
      status: "active",
      size: "2.8 GB",
    },
    {
      id: "3",
      name: "Weekly Archive",
      type: "full",
      schedule: "0 3 * * 0",
      destination: "s3://backup-bucket/weekly",
      retention: 4,
      compression: true,
      encryption: true,
      lastBackup: "2024-01-14T03:00:00Z",
      nextBackup: "2024-01-21T03:00:00Z",
      status: "active",
      size: "52.1 GB",
    },
  ])

  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    {
      id: "1",
      name: "Web Server Health",
      type: "http",
      target: "http://localhost:80/health",
      interval: 30,
      timeout: 5,
      retries: 3,
      enabled: true,
      status: "healthy",
      lastCheck: "2024-01-15T14:30:00Z",
      uptime: "99.98%",
      responseTime: 45,
    },
    {
      id: "2",
      name: "Database Connection",
      type: "tcp",
      target: "localhost:5432",
      interval: 60,
      timeout: 10,
      retries: 3,
      enabled: true,
      status: "healthy",
      lastCheck: "2024-01-15T14:29:00Z",
      uptime: "99.95%",
      responseTime: 12,
    },
    {
      id: "3",
      name: "Network Connectivity",
      type: "ping",
      target: "8.8.8.8",
      interval: 30,
      timeout: 5,
      retries: 3,
      enabled: true,
      status: "healthy",
      lastCheck: "2024-01-15T14:30:15Z",
      uptime: "100%",
      responseTime: 8,
    },
    {
      id: "4",
      name: "Disk Space Check",
      type: "script",
      target: "/usr/local/bin/check-disk.sh",
      interval: 300,
      timeout: 30,
      retries: 1,
      enabled: true,
      status: "healthy",
      lastCheck: "2024-01-15T14:25:00Z",
      uptime: "99.99%",
      responseTime: 150,
    },
  ])

  const [diskConfigs, setDiskConfigs] = useState<DiskConfig[]>([
    {
      device: "/dev/sda1",
      mountPoint: "/",
      filesystem: "ext4",
      size: "100 GB",
      used: "45 GB",
      available: "55 GB",
      usagePercent: 45,
      inodesUsed: "1.2M",
      inodesTotal: "6.4M",
      readOnly: false,
      autoMount: true,
      mountOptions: ["rw", "relatime", "errors=remount-ro"],
    },
    {
      device: "/dev/sdb1",
      mountPoint: "/data",
      filesystem: "xfs",
      size: "500 GB",
      used: "320 GB",
      available: "180 GB",
      usagePercent: 64,
      inodesUsed: "8.5M",
      inodesTotal: "32M",
      readOnly: false,
      autoMount: true,
      mountOptions: ["rw", "noatime", "nodiratime"],
    },
    {
      device: "/dev/sdc1",
      mountPoint: "/backup",
      filesystem: "ext4",
      size: "1 TB",
      used: "650 GB",
      available: "350 GB",
      usagePercent: 65,
      inodesUsed: "15M",
      inodesTotal: "64M",
      readOnly: false,
      autoMount: true,
      mountOptions: ["rw", "relatime"],
    },
  ])

  const [portConfigs, setPortConfigs] = useState<PortConfig[]>([
    {
      port: 22,
      protocol: "tcp",
      service: "ssh",
      process: "sshd",
      pid: 1234,
      state: "listening",
      localAddress: "0.0.0.0:22",
      remoteAddress: "*:*",
      enabled: true,
    },
    {
      port: 80,
      protocol: "tcp",
      service: "http",
      process: "nginx",
      pid: 5678,
      state: "listening",
      localAddress: "0.0.0.0:80",
      remoteAddress: "*:*",
      enabled: true,
    },
    {
      port: 443,
      protocol: "tcp",
      service: "https",
      process: "nginx",
      pid: 5678,
      state: "listening",
      localAddress: "0.0.0.0:443",
      remoteAddress: "*:*",
      enabled: true,
    },
    {
      port: 5432,
      protocol: "tcp",
      service: "postgresql",
      process: "postgres",
      pid: 9012,
      state: "listening",
      localAddress: "127.0.0.1:5432",
      remoteAddress: "*:*",
      enabled: true,
    },
    {
      port: 6379,
      protocol: "tcp",
      service: "redis",
      process: "redis-server",
      pid: 3456,
      state: "listening",
      localAddress: "127.0.0.1:6379",
      remoteAddress: "*:*",
      enabled: true,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "allow":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
      case "disabled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "failed":
      case "deny":
      case "reject":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "locked":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "unhealthy":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "unknown":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleSaveConfig = () => {
    console.log("[v0] Saving configuration changes...")
    setIsEditing(false)
  }

  const handleResetConfig = () => {
    console.log("[v0] Resetting configuration to defaults...")
    setIsEditing(false)
  }

  const addFirewallRule = () => {
    const newRule: FirewallRule = {
      id: Date.now().toString(),
      name: "New Rule",
      action: "allow",
      protocol: "tcp",
      port: "80",
      source: "0.0.0.0/0",
      destination: "any",
      enabled: true,
      priority: firewallRules.length + 1,
      description: "New firewall rule",
    }
    setFirewallRules([...firewallRules, newRule])
  }

  const deleteFirewallRule = (id: string) => {
    setFirewallRules(firewallRules.filter((rule) => rule.id !== id))
  }

  const toggleFirewallRule = (id: string) => {
    setFirewallRules(firewallRules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Server Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage firewall, services, network, users, backup, health checks, and system configuration
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
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="firewall">Firewall</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="ports">Ports</TabsTrigger>
          <TabsTrigger value="disk">Disk</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="firewall" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Firewall Rules
                  </CardTitle>
                  <CardDescription>Configure iptables firewall rules and policies</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addFirewallRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Port</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firewallRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{rule.priority}</TableCell>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(rule.action)}>{rule.action.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell className="uppercase">{rule.protocol}</TableCell>
                        <TableCell className="font-mono">{rule.port}</TableCell>
                        <TableCell className="font-mono text-sm">{rule.source}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => toggleFirewallRule(rule.id)}
                              disabled={!isEditing}
                            />
                            <span className="text-sm">{rule.enabled ? "Enabled" : "Disabled"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" disabled={!isEditing}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteFirewallRule(rule.id)}
                              disabled={!isEditing}
                            >
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

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Services
              </CardTitle>
              <CardDescription>Manage systemd services and their configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        <Switch checked={service.enabled} disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Config File:</span>
                        <div className="font-mono text-xs">{service.configFile}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ports:</span>
                        <div className="flex gap-1">
                          {service.ports.map((port, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {port}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Auto Restart:</span>
                        <div>{service.autoRestart ? "Yes" : "No"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Restart Policy:</span>
                        <div>{service.restartPolicy}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Terminal className="h-4 w-4 mr-2" />
                        Logs
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restart
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Configuration
              </CardTitle>
              <CardDescription>Configure network interfaces and routing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networkConfigs.map((config, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{config.interface}</h3>
                          <p className="text-sm text-muted-foreground">{config.type.toUpperCase()} Configuration</p>
                        </div>
                      </div>
                      <Switch checked={config.enabled} disabled={!isEditing} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">IP Address</Label>
                        <Input value={config.ipAddress} disabled={!isEditing} className="font-mono text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Netmask</Label>
                        <Input value={config.netmask} disabled={!isEditing} className="font-mono text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Gateway</Label>
                        <Input value={config.gateway} disabled={!isEditing} className="font-mono text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">DNS Servers</Label>
                        <Input value={config.dns.join(", ")} disabled={!isEditing} className="font-mono text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">MTU</Label>
                        <Input value={config.mtu.toString()} disabled={!isEditing} className="font-mono text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Type</Label>
                        <Select value={config.type} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="static">Static</SelectItem>
                            <SelectItem value="dhcp">DHCP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Port Configuration
              </CardTitle>
              <CardDescription>Monitor and manage open ports and listening services</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Port</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Process</TableHead>
                      <TableHead>PID</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Local Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portConfigs.map((port, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-bold">{port.port}</TableCell>
                        <TableCell className="uppercase">{port.protocol}</TableCell>
                        <TableCell className="font-medium">{port.service}</TableCell>
                        <TableCell className="font-mono text-sm">{port.process}</TableCell>
                        <TableCell className="font-mono">{port.pid}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(port.state === "listening" ? "active" : "inactive")}>
                            {port.state}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{port.localAddress}</TableCell>
                        <TableCell>
                          <Switch checked={port.enabled} disabled={!isEditing} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Terminal className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" disabled={!isEditing}>
                              <Edit className="h-4 w-4" />
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

        <TabsContent value="disk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Disk Configuration
              </CardTitle>
              <CardDescription>Manage disk partitions, mount points, and filesystem settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diskConfigs.map((disk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium font-mono">{disk.device}</h3>
                          <p className="text-sm text-muted-foreground">{disk.mountPoint}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{disk.filesystem}</Badge>
                        <Switch checked={disk.autoMount} disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Disk Usage</span>
                          <span className="font-medium">
                            {disk.used} / {disk.size} ({disk.usagePercent}%)
                          </span>
                        </div>
                        <Progress value={disk.usagePercent} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Available:</span>
                          <div className="font-medium">{disk.available}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Inodes:</span>
                          <div className="font-medium">
                            {disk.inodesUsed} / {disk.inodesTotal}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Read Only:</span>
                          <div className="font-medium">{disk.readOnly ? "Yes" : "No"}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Auto Mount:</span>
                          <div className="font-medium">{disk.autoMount ? "Yes" : "No"}</div>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Mount Options:</span>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {disk.mountOptions.map((option, i) => (
                            <Badge key={i} variant="outline" className="text-xs font-mono">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Terminal className="h-4 w-4 mr-2" />
                        Check
                      </Button>
                      <Button size="sm" variant="outline" disabled={!isEditing}>
                        <Edit className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline">
                        <Activity className="h-4 w-4 mr-2" />
                        Monitor
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Backup Configuration
                  </CardTitle>
                  <CardDescription>Manage backup schedules, retention, and destinations</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Backup
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupConfigs.map((backup) => (
                  <div key={backup.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{backup.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{backup.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(backup.status)}>{backup.status}</Badge>
                        <Badge variant="outline">{backup.type}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Destination:</span>
                        <div className="font-mono text-xs">{backup.destination}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retention:</span>
                        <div className="font-medium">{backup.retention} backups</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Backup:</span>
                        <div className="font-medium">{new Date(backup.lastBackup).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Backup:</span>
                        <div className="font-medium">{new Date(backup.nextBackup).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <div className="font-medium">{backup.size}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Compression:</span>
                        <div className="font-medium">{backup.compression ? "Enabled" : "Disabled"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Encryption:</span>
                        <div className="font-medium">{backup.encryption ? "Enabled" : "Disabled"}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Run Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline">
                        <Terminal className="h-4 w-4 mr-2" />
                        Logs
                      </Button>
                      <Button size="sm" variant="outline" disabled={!isEditing}>
                        <Edit className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="destructive" disabled={!isEditing}>
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

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Health Checks
                  </CardTitle>
                  <CardDescription>Monitor service health and availability</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Check
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthChecks.map((check) => (
                  <div key={check.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{check.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{check.target}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            check.status === "healthy"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : check.status === "unhealthy"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          }
                        >
                          {check.status}
                        </Badge>
                        <Badge variant="outline">{check.type}</Badge>
                        <Switch checked={check.enabled} disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Interval:</span>
                        <div className="font-medium">{check.interval}s</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeout:</span>
                        <div className="font-medium">{check.timeout}s</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retries:</span>
                        <div className="font-medium">{check.retries}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Uptime:</span>
                        <div className="font-medium text-green-600">{check.uptime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>
                        <div className="font-medium">{check.responseTime}ms</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Last Check:</span>
                        <div className="font-medium">{new Date(check.lastCheck).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Test Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Terminal className="h-4 w-4 mr-2" />
                        History
                      </Button>
                      <Button size="sm" variant="outline" disabled={!isEditing}>
                        <Edit className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="destructive" disabled={!isEditing}>
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

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Accounts
              </CardTitle>
              <CardDescription>Manage system user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>UID</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead>Shell</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sudo</TableHead>
                      <TableHead>SSH Keys</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAccounts.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell className="font-mono">{user.uid}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.groups.map((group, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{user.shell}</TableCell>
                        <TableCell className="text-sm">{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.sudoAccess ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.sshKeyCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" disabled={!isEditing}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" disabled={!isEditing}>
                              <Lock className="h-4 w-4" />
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

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>Basic system settings and parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hostname</Label>
                    <Input
                      value={systemConfig.hostname}
                      disabled={!isEditing}
                      onChange={(e) => setSystemConfig({ ...systemConfig, hostname: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Select value={systemConfig.timezone} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Locale</Label>
                    <Input
                      value={systemConfig.locale}
                      disabled={!isEditing}
                      onChange={(e) => setSystemConfig({ ...systemConfig, locale: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Keyboard Layout</Label>
                    <Input
                      value={systemConfig.keyboardLayout}
                      disabled={!isEditing}
                      onChange={(e) => setSystemConfig({ ...systemConfig, keyboardLayout: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Swap Size</Label>
                    <Input
                      value={systemConfig.swapSize}
                      disabled={!isEditing}
                      onChange={(e) => setSystemConfig({ ...systemConfig, swapSize: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Max Open Files</Label>
                    <Input
                      value={systemConfig.maxOpenFiles}
                      disabled={!isEditing}
                      onChange={(e) => setSystemConfig({ ...systemConfig, maxOpenFiles: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kernel Parameters</CardTitle>
                <CardDescription>System kernel tuning parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(systemConfig.kernelParameters).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label className="font-mono text-sm">{key}</Label>
                      </div>
                      <div className="flex-1">
                        <Input value={value} disabled={!isEditing} className="font-mono text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>System-wide environment variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(systemConfig.environmentVariables).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label className="font-mono text-sm">{key}</Label>
                      </div>
                      <div className="flex-1">
                        <Input value={value} disabled={!isEditing} className="font-mono text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configuration Files
              </CardTitle>
              <CardDescription>Manage system and application configuration files</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Modified</TableHead>
                      <TableHead>Backup</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configFiles.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell className="font-mono text-sm">{file.path}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell className="font-mono text-sm">{file.owner}</TableCell>
                        <TableCell className="font-mono text-sm">{file.permissions}</TableCell>
                        <TableCell className="text-sm">{new Date(file.modified).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {file.backup ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" disabled={!isEditing}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Upload className="h-4 w-4" />
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
      </Tabs>
    </div>
  )
}
