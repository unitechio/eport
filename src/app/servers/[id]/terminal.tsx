"use client"

import { useState, useRef, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    Terminal,
    X,
    Maximize2,
    Minimize2,
    Copy,
    Download,
    Settings,
    Power
} from "lucide-react"

interface TerminalOutput {
    id: string
    timestamp: Date
    type: "command" | "output" | "error" | "system"
    content: string
    user?: string
    directory?: string
}

interface ServerTerminalProps {
    serverId: string
    serverHostname: string
    serverIp: string
    isOpen: boolean
    onClose: () => void
}

export function ServerTerminal({ serverId, serverHostname, serverIp, isOpen, onClose }: ServerTerminalProps) {
    const [output, setOutput] = useState<TerminalOutput[]>([])
    const [currentCommand, setCurrentCommand] = useState("")
    const [isConnected, setIsConnected] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [currentUser, setCurrentUser] = useState("root")
    const [currentDirectory, setCurrentDirectory] = useState("~")
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [isMaximized, setIsMaximized] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const outputRef = useRef<HTMLDivElement>(null)
    const wsRef = useRef<WebSocket | null>(null)

    // Mock WebSocket connection for demo
    const connectToServer = async () => {
        setIsConnecting(true)

        // Add connection message
        const connectionMsg: TerminalOutput = {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: "system",
            content: `Connecting to ${serverHostname} (${serverIp})...`
        }
        setOutput(prev => [...prev, connectionMsg])

        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Add welcome message
        const welcomeMsg: TerminalOutput = {
            id: (Date.now() + 1).toString(),
            timestamp: new Date(),
            type: "system",
            content: `Connected to ${serverHostname}\nUbuntu 22.04.3 LTS\nWelcome to your server terminal.`
        }
        setOutput(prev => [...prev, welcomeMsg])

        setIsConnected(true)
        setIsConnecting(false)

        // Focus input after connection
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100)

        // In real implementation, you would create WebSocket connection here:
        // const ws = new WebSocket(`ws://your-api/terminal/${serverId}`)
        // wsRef.current = ws
    }

    const disconnect = () => {
        if (wsRef.current) {
            wsRef.current.close()
        }
        setIsConnected(false)
        const disconnectMsg: TerminalOutput = {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: "system",
            content: "Connection closed."
        }
        setOutput(prev => [...prev, disconnectMsg])
    }

    const executeCommand = async (command: string) => {
        if (!command.trim()) return

        // Add command to history
        setCommandHistory(prev => [...prev, command])
        setHistoryIndex(-1)

        // Add command to output
        const commandOutput: TerminalOutput = {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: "command",
            content: command,
            user: currentUser,
            directory: currentDirectory
        }
        setOutput(prev => [...prev, commandOutput])

        // Simulate command execution
        await new Promise(resolve => setTimeout(resolve, 300))

        // Mock command responses
        let response = ""
        let responseType: "output" | "error" = "output"
        let newDirectory = currentDirectory

        switch (command.trim().toLowerCase()) {
            case "ls":
            case "ls -la":
                response = `total 24
drwxr-xr-x  5 root root 4096 Jan 15 10:30 .
drwxr-xr-x 23 root root 4096 Jan 10 08:15 ..
-rw-r--r--  1 root root  220 Jan  1 00:00 .bashrc
-rw-r--r--  1 root root  807 Jan  1 00:00 .profile
drwxr-xr-x  2 root root 4096 Jan 15 10:30 docker
drwxr-xr-x  3 root root 4096 Jan 12 14:20 logs
-rwxr-xr-x  1 root root 1024 Jan 15 09:00 start.sh`
                break

            case "pwd":
                response = `/home/${currentUser}`
                break

            case "whoami":
                response = currentUser
                break

            case "date":
                response = new Date().toString()
                break

            case "uptime":
                response = " 10:45:23 up 45 days, 12:15,  3 users,  load average: 1.20, 1.50, 1.80"
                break

            case "ps aux":
                response = `USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.1  19356  1024 ?        Ss   Jan01   0:01 /sbin/init
root        1234  3.2  2.1 745632 21504 ?        Ssl  Jan05  45:23 /usr/bin/dockerd
www-data    5678  1.5  0.8 125432  8192 ?        S    Jan08  12:34 nginx: master process
postgres    9012  8.7  5.2 892456 52480 ?        Ss   Jan05 123:45 postgres: 14/main`
                break

            case "df -h":
                response = `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        98G   71G   22G  77% /
/dev/sda2       197G  142G   46G  76% /var
tmpfs           32G     0   32G   0% /dev/shm`
                break

            case "free -h":
                response = `              total        used        free      shared  buff/cache   available
Mem:           64G         44G         5.0G        1.2G        15G         18G
Swap:          8.0G        512M        7.5G`
                break

            case "docker ps":
                response = `CONTAINER ID   IMAGE                COMMAND                  CREATED       STATUS       PORTS                    NAMES
c1a2b3c4d5e6   nginx:1.24-alpine       "/docker-entrypoint.…"   2 weeks ago   Up 2 weeks   0.0.0.0:80->80/tcp       nginx-proxy
d7e8f9g0h1i2   node:18-alpine          "npm start"              10 days ago   Up 10 days   0.0.0.0:3000->3000/tcp   api-server
j3k4l5m6n7o8   redis:7-alpine          "docker-entrypoint.s…"   2 weeks ago   Up 2 weeks   6379/tcp                 redis-cache`
                break

            case "clear":
                setOutput([])
                setCurrentCommand("")
                return

            case "exit":
                disconnect()
                return

            default:
                if (command.startsWith("cd ")) {
                    const path = command.substring(3).trim()
                    newDirectory = path === ".." ? "/" : path.startsWith("/") ? path : `${currentDirectory}/${path}`
                    response = ""
                } else if (command.startsWith("mkdir ") || command.startsWith("touch ") || command.startsWith("rm ")) {
                    response = "" // Silent success for file operations
                } else {
                    response = `bash: ${command}: command not found`
                    responseType = "error"
                }
        }

        // Update directory if changed
        if (newDirectory !== currentDirectory) {
            setCurrentDirectory(newDirectory)
        }

        // Add response to output
        if (response) {
            const responseOutput: TerminalOutput = {
                id: (Date.now() + 1).toString(),
                timestamp: new Date(),
                type: responseType,
                content: response
            }
            setOutput(prev => [...prev, responseOutput])
        }

        setCurrentCommand("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            executeCommand(currentCommand)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1
                setHistoryIndex(newIndex)
                setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1
                setHistoryIndex(newIndex)
                setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
            } else if (historyIndex === 0) {
                setHistoryIndex(-1)
                setCurrentCommand("")
            }
        } else if (e.key === "Tab") {
            e.preventDefault()
            // Basic tab completion for common commands
            const commands = ["ls", "cd", "pwd", "ps", "docker", "systemctl", "cat", "nano", "vim"]
            const matches = commands.filter(cmd => cmd.startsWith(currentCommand))
            if (matches.length === 1) {
                setCurrentCommand(matches[0] + " ")
            }
        }
    }

    const copyOutput = () => {
        const text = output.map(line => {
            if (line.type === "command") {
                return `${line.user}@${serverHostname}:${line.directory}$ ${line.content}`
            } else {
                return line.content
            }
        }).join("\n")

        navigator.clipboard.writeText(text)
    }

    const downloadLog = () => {
        const text = output.map(line => {
            const timestamp = line.timestamp.toISOString()
            if (line.type === "command") {
                return `[${timestamp}] ${line.user}@${serverHostname}:${line.directory}$ ${line.content}`
            } else {
                return `[${timestamp}] ${line.content}`
            }
        }).join("\n")

        const blob = new Blob([text], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${serverHostname}-terminal-${new Date().toISOString().split('T')[0]}.log`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Auto-scroll to bottom when output changes
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight
        }
    }, [output])

    // Auto-connect when modal opens
    useEffect(() => {
        if (isOpen && !isConnected && !isConnecting) {
            connectToServer()
        }
    }, [isOpen])

    // Clear output when modal closes
    useEffect(() => {
        if (!isOpen) {
            setOutput([])
            setCurrentCommand("")
            setCommandHistory([])
            setHistoryIndex(-1)
            setIsConnected(false)
            setIsConnecting(false)
        }
    }, [isOpen])

    const prompt = `${currentUser}@${serverHostname}:${currentDirectory}$`

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={`bg-gray-900 text-green-400 border-gray-700 font-mono ${isMaximized
                    ? "max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh]"
                    : "max-w-[95vw] max-h-[80vh] w-[90vw] h-[600px]"
                    }`}
            >
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        <DialogTitle className="text-green-400">Terminal - {serverHostname}</DialogTitle>
                        <Badge
                            variant={isConnected ? "default" : "secondary"}
                            className={isConnected ? "bg-green-600" : "bg-gray-600"}
                        >
                            {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Disconnected"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyOutput}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={downloadLog}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
                        >
                            <Download className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsMaximized(!isMaximized)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
                        >
                            {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={disconnect}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                            disabled={!isConnected}
                        >
                            <Power className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onClose}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex flex-col h-full min-h-0">
                    {/* Terminal Output */}
                    <ScrollArea
                        className="flex-1 p-3 bg-black rounded border border-gray-700 text-sm leading-relaxed"
                        ref={outputRef}
                    >
                        <div className="space-y-1">
                            {output.map((line) => (
                                <div
                                    key={line.id}
                                    className="flex flex-col tracking-tight"
                                >
                                    {line.type === "command" && (
                                        <div className="text-blue-400">
                                            <span className="text-green-400">{line.user}@{serverHostname}</span>
                                            <span className="text-yellow-400">:</span>
                                            <span className="text-blue-400">{line.directory}</span>
                                            <span className="text-white">$ </span>
                                            <span className="text-white">{line.content}</span>
                                        </div>
                                    )}
                                    {line.type === "output" && (
                                        <div className="text-gray-200 whitespace-pre-line">{line.content}</div>
                                    )}
                                    {line.type === "error" && (
                                        <div className="text-red-400 whitespace-pre-line">{line.content}</div>
                                    )}
                                    {line.type === "system" && (
                                        <div className="text-yellow-400 whitespace-pre-line italic">{line.content}</div>
                                    )}
                                </div>
                            ))}

                            {/* Current prompt */}
                            {isConnected && (
                                <div className="flex items-center">
                                    <span className="text-green-400">{currentUser}@{serverHostname}</span>
                                    <span className="text-yellow-400">:</span>
                                    <span className="text-blue-400">{currentDirectory}</span>
                                    <span className="text-white">$ </span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={currentCommand}
                                        onChange={(e) => setCurrentCommand(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                                        placeholder="Enter command..."
                                        disabled={!isConnected}
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <div className="w-2 h-4 bg-green-400 animate-pulse ml-1" />
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Terminal Footer */}
                    <div className="flex items-center justify-between p-2 border-t border-gray-700 text-xs text-gray-400">
                        <div className="flex items-center gap-4">
                            <span>Server: {serverIp}</span>
                            <span>Session: {new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Commands: {commandHistory.length}</span>
                            <span>•</span>
                            <span>Use ↑↓ for history, Tab for completion, Ctrl+C to interrupt</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}