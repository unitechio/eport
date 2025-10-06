"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Server,
  BarChart3,
  Container,
  Users,
  Settings,
  Menu,
  X,
  Monitor,
  Database,
  Shield,
  Activity,
  ChevronRight,
  Bell,
  PieChart,
  Puzzle,
  FileText,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3, badge: null },
  { id: "servers", name: "Servers", icon: Server, badge: "102" },
  { id: "containers", name: "Containers", icon: Container, badge: "45" },
  { id: "monitoring", name: "Monitoring", icon: Monitor, badge: "4" },
  { id: "alerts", name: "Alerts", icon: Bell, badge: "3" },
  { id: "database", name: "Database", icon: Database, badge: null },
  { id: "security", name: "Security", icon: Shield, badge: "2" },
  { id: "integrations", name: "Integrations", icon: Puzzle, badge: null },
  { id: "reports", name: "Reports", icon: PieChart, badge: null },
  { id: "activity", name: "Activity", icon: Activity, badge: null },
  { id: "audit", name: "Audit", icon: FileText, badge: null }, // Added audit menu item
  { id: "users", name: "Users", icon: Users, badge: null },
  { id: "settings", name: "Settings", icon: Settings, badge: null },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const SidebarButton = ({ item }: { item: (typeof navigation)[0] }) => {
    const Icon = item.icon
    const isActive = activeTab === item.id

    const button = (
      <Button
        key={item.id}
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start text-left transition-all duration-200 group",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isCollapsed && "justify-center px-2",
        )}
        onClick={() => onTabChange(item.id)}
      >
        <Icon
          className={cn("w-4 h-4 transition-transform duration-200", !isCollapsed && "mr-3", isActive && "scale-110")}
        />
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span>{item.name}</span>
            <div className="flex items-center space-x-1">
              {item.badge && (
                <Badge variant="secondary" className="text-xs h-5 px-1.5">
                  {item.badge}
                </Badge>
              )}
              {isActive && <ChevronRight className="w-3 h-3 opacity-70" />}
            </div>
          </div>
        )}
      </Button>
    )

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right" className="flex items-center space-x-2">
              <span>{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs h-5 px-1.5">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
              <Server className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sidebar-foreground">InfraCRM</span>
              <div className="text-xs text-muted-foreground">v2.1.0</div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
        >
          <div className="relative w-4 h-4">
            <Menu
              className={cn(
                "w-4 h-4 absolute transition-all duration-300",
                isCollapsed ? "rotate-0 scale-100" : "rotate-180 scale-0",
              )}
            />
            <X
              className={cn(
                "w-4 h-4 absolute transition-all duration-300",
                isCollapsed ? "rotate-180 scale-0" : "rotate-0 scale-100",
              )}
            />
          </div>
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <SidebarButton key={item.id} item={item} />
        ))}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border bg-sidebar/50">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-background/50 border border-border/50">
            <div className="w-8 h-8 bg-gradient-to-br from-muted to-muted/80 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@company.com</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Online" />
          </div>
        </div>
      )}
    </div>
  )
}
