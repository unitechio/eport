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
            Manage firewall, services, network, users, and system configuration
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="firewall">Firewall</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="files">Config Files</TabsTrigger>
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
