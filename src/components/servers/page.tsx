"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  MoreHorizontal, 
  MapPin, 
  Eye, 
  Power, 
  RotateCcw, 
  Settings,
  Terminal,
  Activity,
  Filter,
  RefreshCw
} from "lucide-react"
import { AdvancedFilters, ActiveFilters, type FilterState } from "./advanced-filters"

interface ServerListProps {
  onServerSelect: (serverId: string) => void
  onConfigureServer: (serverId: string) => void
}

// Mock server data
const servers = [
  {
    id: "srv-001",
    hostname: "web-prod-01",
    ip: "192.168.1.101",
    status: "healthy",
    location: "US-East-1",
    os: "Ubuntu 22.04 LTS",
    tags: ["production", "web", "nginx"],
    cpu: 68,
    memory: 74,
    disk: 45,
    network: 23,
    uptime: "45d 12h",
    lastSeen: "2 min ago",
    containers: 8,
  },
  {
    id: "srv-002",
    hostname: "db-primary-02",
    ip: "192.168.1.102",
    status: "healthy",
    location: "US-West-2",
    os: "CentOS 8",
    tags: ["production", "database", "mysql"],
    cpu: 45,
    memory: 82,
    disk: 67,
    network: 15,
    uptime: "89d 6h",
    lastSeen: "1 min ago",
    containers: 3,
  },
  {
    id: "srv-003",
    hostname: "api-gateway-03",
    ip: "192.168.1.103",
    status: "warning",
    location: "EU-Central-1",
    os: "Ubuntu 20.04 LTS",
    tags: ["production", "api", "gateway"],
    cpu: 89,
    memory: 76,
    disk: 34,
    network: 45,
    uptime: "23d 18h",
    lastSeen: "3 min ago",
    containers: 12,
  },
  {
    id: "srv-004",
    hostname: "cache-redis-01",
    ip: "192.168.1.104",
    status: "critical",
    location: "Asia-Pacific-1",
    os: "Alpine Linux",
    tags: ["production", "cache", "redis"],
    cpu: 34,
    memory: 95,
    disk: 23,
    network: 8,
    uptime: "12d 4h",
    lastSeen: "1 min ago",
    containers: 2,
  },
  {
    id: "srv-005",
    hostname: "worker-queue-05",
    ip: "192.168.1.105",
    status: "healthy",
    location: "US-East-1",
    os: "Ubuntu 22.04 LTS",
    tags: ["production", "worker", "queue"],
    cpu: 56,
    memory: 63,
    disk: 78,
    network: 12,
    uptime: "67d 2h",
    lastSeen: "4 min ago",
    containers: 6,
  },
  {
    id: "srv-006",
    hostname: "backup-storage-02",
    ip: "192.168.1.106",
    status: "warning",
    location: "US-West-2",
    os: "Ubuntu 22.04 LTS",
    tags: ["backup", "storage", "archive"],
    cpu: 12,
    memory: 34,
    disk: 89,
    network: 5,
    uptime: "156d 8h",
    lastSeen: "2 min ago",
    containers: 1,
  },
  {
    id: "srv-007",
    hostname: "monitoring-stack",
    ip: "192.168.1.107",
    status: "healthy",
    location: "US-East-1",
    os: "Ubuntu 22.04 LTS",
    tags: ["monitoring", "prometheus", "grafana"],
    cpu: 35,
    memory: 58,
    disk: 42,
    network: 18,
    uptime: "78d 15h",
    lastSeen: "1 min ago",
    containers: 5,
  },
  {
    id: "srv-008",
    hostname: "mail-server-01",
    ip: "192.168.1.108",
    status: "healthy",
    location: "EU-Central-1",
    os: "CentOS 8",
    tags: ["production", "mail", "postfix"],
    cpu: 22,
    memory: 48,
    disk: 55,
    network: 12,
    uptime: "125d 3h",
    lastSeen: "2 min ago",
    containers: 4,
  },
  {
    id: "srv-009",
    hostname: "test-environment",
    ip: "192.168.1.109",
    status: "offline",
    location: "US-West-2",
    os: "Ubuntu 20.04 LTS",
    tags: ["testing", "development", "staging"],
    cpu: 0,
    memory: 0,
    disk: 25,
    network: 0,
    uptime: "0d 0h",
    lastSeen: "2h ago",
    containers: 0,
  },
  {
    id: "srv-010",
    hostname: "analytics-cluster",
    ip: "192.168.1.110",
    status: "critical",
    location: "Asia-Pacific-1",
    os: "Alpine Linux",
    tags: ["analytics", "elasticsearch", "kibana"],
    cpu: 95,
    memory: 92,
    disk: 88,
    network: 65,
    uptime: "15d 8h",
    lastSeen: "30 sec ago",
    containers: 15,
  },
]

const statusColors = {
  healthy: "bg-green-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
  offline: "bg-gray-500",
}

const statusLabels = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  offline: "Offline",
}

const defaultFilters: FilterState = {
  search: "",
  status: [],
  location: [],
  os: [],
  tags: [],
  cpuRange: [0, 100],
  memoryRange: [0, 100],
  diskRange: [0, 100],
  uptimeMin: 0,
  containerCountRange: [0, 20],
}

export function ServerList({ onServerSelect, onConfigureServer }: ServerListProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredServers = servers.filter((server) => {
    const matchesSearch =
      !filters.search ||
      server.hostname.toLowerCase().includes(filters.search.toLowerCase()) ||
      server.ip.includes(filters.search) ||
      server.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()))

    const matchesStatus = filters.status.length === 0 || filters.status.includes(server.status)
    const matchesLocation = filters.location.length === 0 || filters.location.includes(server.location)
    const matchesOS = filters.os.length === 0 || filters.os.includes(server.os)
    const matchesTags = filters.tags.length === 0 || filters.tags.some((tag) => server.tags.includes(tag))
    const matchesCPU = server.cpu >= filters.cpuRange[0] && server.cpu <= filters.cpuRange[1]
    const matchesMemory = server.memory >= filters.memoryRange[0] && server.memory <= filters.memoryRange[1]
    const matchesDisk = server.disk >= filters.diskRange[0] && server.disk <= filters.diskRange[1]
    const uptimeDays = Number.parseInt(server.uptime.split("d")[0])
    const matchesUptime = uptimeDays >= filters.uptimeMin
    const matchesContainers =
      server.containers >= filters.containerCountRange[0] && server.containers <= filters.containerCountRange[1]

    return (
      matchesSearch &&
      matchesStatus &&
      matchesLocation &&
      matchesOS &&
      matchesTags &&
      matchesCPU &&
      matchesMemory &&
      matchesDisk &&
      matchesUptime &&
      matchesContainers
    )
  })

  const totalPages = Math.ceil(filteredServers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServers = filteredServers.slice(startIndex, startIndex + itemsPerPage)

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setCurrentPage(1)
  }

  const handleRemoveFilter = (key: keyof FilterState, value?: string) => {
    const newFilters = { ...filters }
    if (value && Array.isArray(newFilters[key])) {
      newFilters[key] = (newFilters[key] as string[]).filter((item) => item !== value)
    } else {
      newFilters[key] = defaultFilters[key]
    }
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleServerAction = async (serverId: string, action: string) => {
    console.log(`[ServerList] ${action} action for server:`, serverId)
    
    switch (action) {
      case "view":
        onServerSelect(serverId)
        break
      case "configure":
        onConfigureServer(serverId)
        break
      case "restart":
      case "shutdown":
      case "terminal":
        await new Promise(resolve => setTimeout(resolve, 500))
        break
      default:
        break
    }
  }

  const getStatusBadge = (status: string) => (
    <Badge variant="outline" className="flex items-center space-x-1">
      <div className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
      <span>{statusLabels[status as keyof typeof statusLabels]}</span>
    </Badge>
  )

  const getResourceBar = (value: number, type: "cpu" | "memory" | "disk" | "network") => {
    const color = value > 80 ? "bg-red-500" : value > 60 ? "bg-yellow-500" : "bg-green-500"
    return (
      <div className="flex items-center space-x-2 min-w-0">
        <div className="w-16 bg-muted rounded-full h-2 flex-shrink-0">
          <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
        </div>
        <span className="text-xs text-muted-foreground w-8 flex-shrink-0">{value}%</span>
      </div>
    )
  }

  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i)
        }
        items.push('ellipsis')
        items.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        items.push(1)
        items.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        items.push(1)
        items.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i)
        }
        items.push('ellipsis')
        items.push(totalPages)
      }
    }
    
    return items
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Server Management</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor your server infrastructure</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge variant="secondary" className="px-3 py-1">
            <Activity className="w-3 h-3 mr-1" />
            {filteredServers.length} servers
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>Filter servers by various criteria to find what you need</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search servers, IPs, or tags..."
                  value={filters.search}
                  onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              <Select
                value={filters.status.length === 1 ? filters.status[0] : "all"}
                onValueChange={(value) => handleFiltersChange({ ...filters, status: value === "all" ? [] : [value] })}
              >
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.location.length === 1 ? filters.location[0] : "all"}
                onValueChange={(value) => handleFiltersChange({ ...filters, location: value === "all" ? [] : [value] })}
              >
                <SelectTrigger className="w-40"><SelectValue placeholder="Location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="US-East-1">US-East-1</SelectItem>
                  <SelectItem value="US-West-2">US-West-2</SelectItem>
                  <SelectItem value="EU-Central-1">EU-Central-1</SelectItem>
                  <SelectItem value="Asia-Pacific-1">Asia-Pacific-1</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => { setItemsPerPage(Number(value)); setCurrentPage(1) }}
              >
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>

              <AdvancedFilters filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />
            </div>
          </div>
        </CardContent>
      </Card>

      <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Server</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead className="w-[120px]">CPU</TableHead>
                  <TableHead className="w-[120px]">Memory</TableHead>
                  <TableHead className="w-[120px]">Disk</TableHead>
                  <TableHead className="w-[120px]">Network</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Search className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No servers found matching your criteria</p>
                        <Button variant="outline" size="sm" onClick={handleResetFilters}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedServers.map((server) => (
                    <TableRow 
                      key={server.id} 
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => onServerSelect(server.id)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{server.hostname}</div>
                          <div className="text-sm text-muted-foreground font-mono">{server.ip}</div>
                          <div className="flex flex-wrap gap-1">
                            {server.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                            {server.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">+{server.tags.length - 2}</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(server.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{server.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{server.os}</TableCell>
                      <TableCell>{getResourceBar(server.cpu, "cpu")}</TableCell>
                      <TableCell>{getResourceBar(server.memory, "memory")}</TableCell>
                      <TableCell>{getResourceBar(server.disk, "disk")}</TableCell>
                      <TableCell>{getResourceBar(server.network, "network")}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{server.uptime}</div>
                          <div className="text-muted-foreground text-xs">{server.lastSeen}</div>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => handleServerAction(server.id, "view")}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleServerAction(server.id, "configure")}>
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleServerAction(server.id, "terminal")}>
                              <Terminal className="w-4 h-4 mr-2" />
                              Terminal
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleServerAction(server.id, "restart")}>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restart
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleServerAction(server.id, "shutdown")}
                            >
                              <Power className="w-4 h-4 mr-2" />
                              Shutdown
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredServers.length)} of{" "}
            {filteredServers.length} servers
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {generatePaginationItems().map((item, index) => (
                <PaginationItem key={index}>
                  {item === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(item as number)}
                      isActive={currentPage === item}
                      className="cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
