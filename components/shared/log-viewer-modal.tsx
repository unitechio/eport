"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Search, X, Pause, Play, RotateCcw, Copy, Check } from "lucide-react"

interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  source?: string
}

interface LogViewerModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  resourceId: string
  resourceType: "container" | "pod" | "server" | "service"
}

export function LogViewerModal({ isOpen, onClose, title, resourceId, resourceType }: LogViewerModalProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [isPaused, setIsPaused] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [copied, setCopied] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || isPaused) return

    const mockLogs: LogEntry[] = [
      {
        timestamp: new Date().toISOString(),
        level: "info",
        message: `Starting ${resourceType} ${resourceId}...`,
        source: resourceId,
      },
      {
        timestamp: new Date().toISOString(),
        level: "info",
        message: "Loading configuration files...",
        source: "config",
      },
      {
        timestamp: new Date().toISOString(),
        level: "debug",
        message: "Environment variables loaded: 12 variables",
        source: "env",
      },
      { timestamp: new Date().toISOString(), level: "info", message: "Connecting to database...", source: "database" },
      {
        timestamp: new Date().toISOString(),
        level: "info",
        message: "Database connection established",
        source: "database",
      },
      {
        timestamp: new Date().toISOString(),
        level: "warn",
        message: "High memory usage detected: 85%",
        source: "monitor",
      },
      {
        timestamp: new Date().toISOString(),
        level: "info",
        message: "HTTP server listening on port 3000",
        source: "http",
      },
      {
        timestamp: new Date().toISOString(),
        level: "debug",
        message: "Request received: GET /api/health",
        source: "http",
      },
      { timestamp: new Date().toISOString(), level: "info", message: "Health check passed", source: "health" },
      {
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Failed to connect to Redis: Connection timeout",
        source: "redis",
      },
    ]

    setLogs(mockLogs)

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        timestamp: new Date().toISOString(),
        level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as any,
        message: `Log entry at ${new Date().toLocaleTimeString()}`,
        source: resourceId,
      }
      setLogs((prev) => [...prev, newLog])
    }, 3000)

    return () => clearInterval(interval)
  }, [isOpen, isPaused, resourceId, resourceType])

  useEffect(() => {
    let filtered = logs

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.source?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((log) => log.level === selectedLevel)
    }

    setFilteredLogs(filtered)
  }, [logs, searchQuery, selectedLevel])

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [filteredLogs, autoScroll])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "warn":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "info":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "debug":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const handleCopyLogs = () => {
    const logText = filteredLogs
      .map(
        (log) =>
          `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.source ? `[${log.source}] ` : ""}${log.message}`,
      )
      .join("\n")
    navigator.clipboard.writeText(logText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadLogs = () => {
    const logText = filteredLogs
      .map(
        (log) =>
          `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.source ? `[${log.source}] ` : ""}${log.message}`,
      )
      .join("\n")
    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resourceId}-logs-${new Date().toISOString()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearLogs = () => {
    setLogs([])
    setFilteredLogs([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {filteredLogs.length} lines
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 pb-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={selectedLevel === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedLevel("all")}
            >
              All
            </Button>
            <Button
              variant={selectedLevel === "error" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedLevel("error")}
            >
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-0">
                Error
              </Badge>
            </Button>
            <Button
              variant={selectedLevel === "warn" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedLevel("warn")}
            >
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-0">
                Warn
              </Badge>
            </Button>
            <Button
              variant={selectedLevel === "info" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedLevel("info")}
            >
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-0">
                Info
              </Badge>
            </Button>
            <Button
              variant={selectedLevel === "debug" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedLevel("debug")}
            >
              <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-0">
                Debug
              </Badge>
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearLogs}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyLogs}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadLogs}>
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 bg-black/95 rounded-md p-4 font-mono text-sm overflow-auto"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement
            const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight
            setAutoScroll(isAtBottom)
          }}
        >
          {filteredLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No logs to display</div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 hover:bg-white/5 px-2 py-1 rounded">
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <Badge variant="outline" className={`${getLevelColor(log.level)} text-xs uppercase`}>
                    {log.level}
                  </Badge>
                  {log.source && <span className="text-cyan-400 text-xs whitespace-nowrap">[{log.source}]</span>}
                  <span className="text-gray-300 flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Resource: {resourceId}</span>
            <span>Type: {resourceType}</span>
            <span className="flex items-center gap-1">
              {isPaused ? "Paused" : "Live"}
              <div className={`w-2 h-2 rounded-full ${isPaused ? "bg-yellow-500" : "bg-green-500 animate-pulse"}`} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded"
              />
              Auto-scroll
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
