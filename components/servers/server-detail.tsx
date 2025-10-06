"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Play,
  Square,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ServerDetailProps {
  serverId: string
  onBack: () => void
}

interface ProcessInfo {
  pid: number
  name: string
  user: string
  cpu: number
  memory: number
  status: string
  command: string
}

interface DiskInfo {
  device: string
  mountpoint: string
  filesystem: string
  size: string
  used: string
  available: string
  usePercent: number
  inodesUsed: number
  inodesTotal: number
}

interface NetworkInterface {
  name: string
  type: string
  status: "up" | "down"
  ipAddress: string
  macAddress: string
  speed: string
  rxBytes: string
  txBytes: string
  rxPackets: number
  txPackets: number
  rxErrors: number
  txErrors: number
}

interface SystemMetric {
  timestamp: string
  cpu: number
  memory: number
  disk: number
  network: { in: number; out: number }
  temperature: number
  loadAverage: number[]
}

export function ServerDetail({ serverId, onBack }: ServerDetailProps) {
  const [isLoading, setIsLoading] = useState(false)

  const server = {
    id: serverId,
    hostname: `server-${serverId}`,
    ip: "192.168.1.100",
    status: "online",
    location: "Data Center A",
    os: "Ubuntu 22.04 LTS",
    kernel: "5.15.0-78-generic",
    architecture: "x86_64",
    uptime: "45 days, 12 hours",
    bootTime: "2023-12-01T08:30:00Z",
    timezone: "UTC",
    cpu: {
      usage: 45,
      cores: 16,
      threads: 32,
      model: "Intel Xeon E5-2686 v4",
      frequency: "2.3 GHz",
      cache: "45 MB",
      temperature: 65,
      loadAverage: [1.2, 1.5, 1.8],
    },
    memory: {
      usage: 68,
      total: 64,
      used: 43.5,
      available: 20.5,
      buffers: 2.1,
      cached: 15.2,
      swap: { total: 8, used: 0.5, free: 7.5 },
    },
    disk: {
      usage: 72,
      total: 1000,
      used: 720,
      available: 280,
      inodes: { used: 1250000, total: 2000000 },
    },
    network: {
      in: 125.5,
      out: 89.2,
      connections: 1247,
      listening: 15,
    },
    power: {
      consumption: 285,
      efficiency: 92,
      temperature: 42,
    },
    containers: [
      { name: "nginx-proxy", status: "running", image: "nginx:latest", ports: "80:80, 443:443", cpu: 5.2, memory: 128 },
      { name: "api-server", status: "running", image: "node:18-alpine", ports: "3000:3000", cpu: 15.8, memory: 512 },
      { name: "redis-cache", status: "running", image: "redis:7-alpine", ports: "6379:6379", cpu: 2.1, memory: 64 },
    ],
    services: [
      { name: "docker", status: "active", description: "Docker Engine", pid: 1234, memory: 256, cpu: 3.2 },
      { name: "nginx", status: "active", description: "Web Server", pid: 5678, memory: 128, cpu: 1.5 },
      { name: "postgresql", status: "active", description: "Database Server", pid: 9012, memory: 1024, cpu: 8.7 },
      { name: "ssh", status: "active", description: "SSH Daemon", pid: 3456, memory: 32, cpu: 0.1 },
    ],
  }

  const mockProcesses: ProcessInfo[] = [
    { pid: 1234, name: "dockerd", user: "root", cpu: 3.2, memory: 2.1, status: "running", command: "/usr/bin/dockerd" },
    {
      pid: 5678,
      name: "nginx",
      user: "www-data",
      cpu: 1.5,
      memory: 0.8,
      status: "running",
      command: "nginx: master process",
    },
    {
      pid: 9012,
      name: "postgres",
      user: "postgres",
      cpu: 8.7,
      memory: 5.2,
      status: "running",
      command: "/usr/lib/postgresql/14/bin/postgres",
    },
    { pid: 3456, name: "sshd", user: "root", cpu: 0.1, memory: 0.2, status: "running", command: "/usr/sbin/sshd -D" },
    {
      pid: 7890,
      name: "systemd",
      user: "root",
      cpu: 0.3,
      memory: 0.5,
      status: "running",
      command: "/lib/systemd/systemd",
    },
  ]

  const mockDisks: DiskInfo[] = [
    {
      device: "/dev/sda1",
      mountpoint: "/",
      filesystem: "ext4",
      size: "500G",
      used: "360G",
      available: "140G",
      usePercent: 72,
      inodesUsed: 1250000,
      inodesTotal: 2000000,
    },
    {
      device: "/dev/sda2",
      mountpoint: "/var",
      filesystem: "ext4",
      size: "300G",
      used: "180G",
      available: "120G",
      usePercent: 60,
      inodesUsed: 850000,
      inodesTotal: 1500000,
    },
    {
      device: "/dev/sda3",
      mountpoint: "/home",
      filesystem: "ext4",
      size: "200G",
      used: "50G",
      available: "150G",
      usePercent: 25,
      inodesUsed: 250000,
      inodesTotal: 1000000,
    },
  ]

  const mockNetworkInterfaces: NetworkInterface[] = [
    {
      name: "eth0",
      type: "ethernet",
      status: "up",
      ipAddress: "192.168.1.100",
      macAddress: "00:1B:44:11:3A:B7",
      speed: "1000 Mbps",
      rxBytes: "2.5 TB",
      txBytes: "1.8 TB",
      rxPackets: 15420000,
      txPackets: 12350000,
      rxErrors: 0,
      txErrors: 0,
    },
    {
      name: "eth1",
      type: "ethernet",
      status: "up",
      ipAddress: "10.0.0.100",
      macAddress: "00:1B:44:11:3A:B8",
      speed: "1000 Mbps",
      rxBytes: "850 GB",
      txBytes: "1.2 TB",
      rxPackets: 8520000,
      txPackets: 9850000,
      rxErrors: 2,
      txErrors: 1,
    },
    {
      name: "lo",
      type: "loopback",
      status: "up",
      ipAddress: "127.0.0.1",
      macAddress: "00:00:00:00:00:00",
      speed: "N/A",
      rxBytes: "45 GB",
      txBytes: "45 GB",
      rxPackets: 2500000,
      txPackets: 2500000,
      rxErrors: 0,
      txErrors: 0,
    },
  ]

  const mockMetrics: SystemMetric[] = [
    {
      timestamp: "10:00",
      cpu: 35,
      memory: 62,
      disk: 70,
      network: { in: 120, out: 85 },
      temperature: 63,
      loadAverage: [1.1, 1.3, 1.6],
    },
    {
      timestamp: "10:05",
      cpu: 42,
      memory: 65,
      disk: 71,
      network: { in: 135, out: 92 },
      temperature: 65,
      loadAverage: [1.2, 1.4, 1.7],
    },
    {
      timestamp: "10:10",
      cpu: 38,
      memory: 67,
      disk: 71,
      network: { in: 128, out: 88 },
      temperature: 64,
      loadAverage: [1.0, 1.2, 1.5],
    },
    {
      timestamp: "10:15",
      cpu: 45,
      memory: 68,
      disk: 72,
      network: { in: 125, out: 89 },
      temperature: 65,
      loadAverage: [1.2, 1.5, 1.8],
    },
  ]

  const handleAction = async (action: string) => {
    console.log(`[v0] Server action: ${action}`)

    if (action === "configure") {
      // Trigger parent to show configuration
      if (onBack) {
        // Signal to parent that we want to show configuration
        window.dispatchEvent(new CustomEvent("showServerConfig", { detail: { serverId } }))
      }
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "running":
      case "active":
      case "up":
        return "bg-green-500"
      case "offline":
      case "stopped":
      case "down":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
      case "running":
      case "active":
      case "up":
        return <CheckCircle className="h-4 w-4" />
      case "offline":
      case "stopped":
      case "down":
        return <XCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-3 w-3 text-red-500" />
    if (current < previous) return <TrendingDown className="h-3 w-3 text-green-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 80) return "text-red-500"
    if (temp > 70) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Servers
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{server.hostname}</h1>
            <p className="text-muted-foreground">
              {server.ip} • {server.location} • {server.os}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getStatusColor(server.status)} text-white border-0`}>
            {getStatusIcon(server.status)}
            <span className="ml-1 capitalize">{server.status}</span>
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleAction("restart")} disabled={isLoading}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction("stop")} disabled={isLoading}>
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction("start")} disabled={isLoading}>
          <Play className="h-4 w-4 mr-2" />
          Start
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction("update")} disabled={isLoading}>
          <Download className="h-4 w-4 mr-2" />
          Update
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction("terminal")} disabled={isLoading}>
          <Terminal className="h-4 w-4 mr-2" />
          Terminal
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction("configure")} disabled={isLoading}>
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>

      {/* Enhanced Resource Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <div className="flex items-center gap-2">
              <Thermometer className={`h-4 w-4 ${getTemperatureColor(server.cpu.temperature)}`} />
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {server.cpu.usage}%{getTrendIcon(server.cpu.usage, 40)}
            </div>
            <Progress value={server.cpu.usage} className="mt-2" />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                {server.cpu.cores} cores • {server.cpu.threads} threads
              </p>
              <p className="text-xs text-muted-foreground">
                {server.cpu.temperature}°C • Load: {server.cpu.loadAverage.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {server.memory.usage}%{getTrendIcon(server.memory.usage, 65)}
            </div>
            <Progress value={server.memory.usage} className="mt-2" />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                {server.memory.used}GB / {server.memory.total}GB
              </p>
              <p className="text-xs text-muted-foreground">
                Cached: {server.memory.cached}GB • Swap: {server.memory.swap.used}GB
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {server.disk.usage}%{getTrendIcon(server.disk.usage, 70)}
            </div>
            <Progress value={server.disk.usage} className="mt-2" />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                {server.disk.used}GB / {server.disk.total}GB
              </p>
              <p className="text-xs text-muted-foreground">
                Inodes: {((server.disk.inodes.used / server.disk.inodes.total) * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{/* Network I/O content */}</CardContent>
        </Card>
      </div>
    </div>
  )
}
