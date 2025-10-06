// src/components/layout/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  Sun,
  Moon,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  User,
  Settings,
  LogOut,
  HelpCircle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationStore, Notification } from "@/store/notificationStore";

interface HeaderProps {
  title: string;
  onThemeToggle: () => void;
  isDark: boolean;
  onLogout: () => void;
}

export function Header({ title, onThemeToggle, isDark, onLogout }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useAuth();
  const { notifications, dismissNotification, clearNotifications } = useNotificationStore();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="text-xs border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            98 Healthy
          </Badge>
          <Badge
            variant="outline"
            className="text-xs border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />3 Warnings
          </Badge>
          <Badge
            variant="outline"
            className="text-xs border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />1 Critical
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search servers, containers..."
            className="pl-10 w-64 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50"
          />
        </div>

        <div className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
          {currentTime.toLocaleTimeString()}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>

        <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/50"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500 hover:bg-red-500">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span className="font-bold">Notifications</span>
              <Badge variant="secondary">{notifications.length} New</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {notifications.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3 hover:bg-muted/50"
                    onSelect={(e) => e.preventDefault()} // Prevent closing on click
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{notification.title}</span>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No new notifications</p>
              </div>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
                <Button variant="ghost" className="w-full justify-center" onClick={clearNotifications}>
                  Clear all notifications
                </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={onThemeToggle}
          className="bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/50 transition-all duration-200"
        >
          <div className="relative w-4 h-4">
            <Sun
              className={`w-4 h-4 absolute transition-all duration-300 ${isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}
            />
            <Moon
              className={`w-4 h-4 absolute transition-all duration-300 ${isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
            />
          </div>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/admin-user-avatar.png" alt="Admin" />
                <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
