"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Play,
  Pause,
  Download,
  Search,
  RefreshCw,
  Clock,
  Server,
  Package,
  Network,
  Database,
  Shield,
  Settings,
} from "lucide-react"

interface SystemEvent {
  id: string
  timestamp: string
  type: "container" | "image" | "network" | "volume" | "service" | "node" | "config" | "secret"
  action: string
  resource: string
  status: "success" | "error" | "warning" | "info"
  message: string
  details: Record<string, any>
  source: string
}

export function RealtimeEvents() {
  const [events, setEvents] = useState<SystemEvent[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [autoScroll, setAutoScroll] = useState(true)

  // Simulate real-time events
  useEffect(() => {
    if (!isMonitoring) return

    const eventTypes: SystemEvent["type"][] = [
      "container",
      "image",
      "network",
      "volume",
      "service",
      "node",
      "config",
      "secret",
    ]
    const actions = [
      "create",
      "start",
      "stop",
      "restart",
      "remove",
      "pull",
      "push",
      "connect",
      "disconnect",
      "mount",
      "unmount",
      "update",
      "scale",
    ]
    const statuses: SystemEvent["status"][] = ["success", "error", "warning", "info"]
    const sources = ["docker-host-01", "docker-host-02", "k8s-master-01", "k8s-worker-01", "k8s-worker-02"]

    const interval = setInterval(() => {
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const randomSource = sources[Math.floor(Math.random() * sources.length)]

      const newEvent: SystemEvent = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date().toISOString(),
        type: randomType,
        action: randomAction,
        resource: `${randomType}-${Math.floor(Math.random() * 100)}`,
        status: randomStatus,
        message: `${randomAction} ${randomType} ${randomStatus}`,
        details: {
          user: "admin",
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          duration: `${Math.floor(Math.random() * 5000)}ms`,
        },
        source: randomSource,
      }

      setEvents((prev) => [newEvent, ...prev].slice(0, 500)) // Keep last 500 events
    }, 2000) // New event every 2 seconds

    return () => clearInterval(interval)
  }, [isMonitoring])

  const getStatusIcon = (status: SystemEvent["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: SystemEvent["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  const getTypeIcon = (type: SystemEvent["type"]) => {
    switch (type) {
      case "container":
        return <Package className="h-4 w-4" />
      case "image":
        return <Database className="h-4 w-4" />
      case "network":
        return <Network className="h-4 w-4" />
      case "volume":
        return <Database className="h-4 w-4" />
      case "service":
        return <Activity className="h-4 w-4" />
      case "node":
        return <Server className="h-4 w-4" />
      case "config":
        return <Settings className="h-4 w-4" />
      case "secret":
        return <Shield className="h-4 w-4" />
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesType = filterType === "all" || event.type === filterType
    const matchesStatus = filterStatus === "all" || event.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      event.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesType && matchesStatus && matchesSearch
  })

  const eventStats = {
    total: events.length,
    success: events.filter((e) => e.status === "success").length,
    error: events.filter((e) => e.status === "error").length,
    warning: events.filter((e) => e.status === "warning").length,
    info: events.filter((e) => e.status === "info").length,
  }

  const exportEvents = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `events-${new Date().toISOString()}.json`
    link.click()
  }

  const clearEvents = () => {
    setEvents([])
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Real-time Event Monitoring</h1>
          <p className="text-muted-foreground mt-2">Monitor system events across all infrastructure components</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsMonitoring(!isMonitoring)}>
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={exportEvents}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearEvents}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{eventStats.success}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{eventStats.error}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{eventStats.warning}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{eventStats.info}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Event Stream
                {isMonitoring && (
                  <Badge variant="outline" className="ml-2">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Real-time system events and activities</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="node">Node</SelectItem>
                  <SelectItem value="config">Config</SelectItem>
                  <SelectItem value="secret">Secret</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No events to display</p>
                  <p className="text-sm">
                    {isMonitoring ? "Waiting for events..." : "Click Resume to start monitoring"}
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">{getStatusIcon(event.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              {getTypeIcon(event.type)}
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.action}
                            </Badge>
                            <Badge className={`${getStatusColor(event.status)} text-xs`}>{event.status}</Badge>
                          </div>
                          <div className="font-medium font-mono text-sm mb-1">{event.resource}</div>
                          <div className="text-sm text-muted-foreground mb-2">{event.message}</div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Server className="h-3 w-3" />
                              {event.source}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.timestamp).toLocaleString()}
                            </div>
                            {event.details.user && (
                              <div className="flex items-center gap-1">
                                <span>User:</span>
                                <span className="font-mono">{event.details.user}</span>
                              </div>
                            )}
                            {event.details.duration && (
                              <div className="flex items-center gap-1">
                                <span>Duration:</span>
                                <span className="font-mono">{event.details.duration}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
