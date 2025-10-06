"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { ServerList } from "@/components/servers/server-list"
import { ServerDetail } from "@/components/servers/server-detail"
import { AlertsPage } from "@/components/alerts/alerts-page"
import { UserManagement } from "@/components/users/user-management"
import { ContactsPage } from "@/components/contacts/contacts-page"
import { IntegrationManagement } from "@/components/integrations/integration-management"
import { ReportsAnalytics } from "@/components/reports/reports-analytics"
import { SettingsConfiguration } from "@/components/settings/settings-configuration"
import { SystemAudit } from "@/components/audit/system-audit"
import { DockerManagement } from "@/components/docker/docker-management"
import { KubernetesManagement } from "@/components/kubernetes/kubernetes-management"
import { KubernetesConfiguration } from "@/components/kubernetes/kubernetes-configuration"
import { HarborManagement } from "@/components/harbor/harbor-management"
import { DatabaseManagement } from "@/components/database/database-management"
import { SecurityCenter } from "@/components/security/security-center"
import { SystemImpactWorkflow } from "@/components/workflow/system-impact-workflow" // Added workflow import
import { Toaster } from "@/components/ui/toaster" // Added toaster for notifications

const tabTitles = {
  dashboard: "Infrastructure Dashboard",
  servers: "Server Management",
  containers: "Docker Container Management",
  monitoring: "Kubernetes Management",
  harbor: "Harbor Registry Management",
  workflow: "System Impact Workflow", // Added workflow title
  alerts: "Alerts & Notifications",
  database: "Database Management",
  security: "Security Center",
  contacts: "Contact Management",
  integrations: "Integration Management",
  reports: "Reports & Analytics",
  activity: "Activity Logs",
  users: "User Management",
  settings: "System Settings",
  audit: "System Audit & Impact Management",
  "k8s-config": "Kubernetes Configuration",
}

export default function InfraCRMDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isDark, setIsDark] = useState(false)
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<{
    type: "docker" | "k8s-pod" | "k8s-node" | null
    id: string | null
  }>({ type: null, id: null })

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleThemeToggle = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleServerSelect = (serverId: string) => {
    console.log("[v0] Server selected:", serverId)
    setSelectedServer(serverId)
    setSelectedResource({ type: null, id: null })
  }

  const handleResourceSelect = (type: "docker" | "k8s-pod" | "k8s-node", id: string) => {
    console.log("[v0] Resource selected:", type, id)
    setSelectedResource({ type, id })
    setSelectedServer(null)
  }

  const handleBackToList = () => {
    console.log("[v0] Back to list")
    setSelectedServer(null)
    setSelectedResource({ type: null, id: null })
  }

  const renderContent = () => {
    if (selectedServer) {
      return <ServerDetail serverId={selectedServer} onBack={handleBackToList} />
    }

    if (selectedResource.type && selectedResource.id) {
      // Import and render resource detail components with terminal
      return (
        <div>
          Resource detail for {selectedResource.type}: {selectedResource.id}
        </div>
      )
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />
      case "servers":
        return <ServerList onServerSelect={handleServerSelect} />
      case "containers":
        return <DockerManagement onResourceSelect={handleResourceSelect} />
      case "monitoring":
        return <KubernetesManagement onResourceSelect={handleResourceSelect} />
      case "harbor":
        return <HarborManagement />
      case "workflow": // Added workflow case
        return <SystemImpactWorkflow />
      case "alerts":
        return <AlertsPage />
      case "users":
        return <UserManagement />
      case "contacts":
        return <ContactsPage />
      case "integrations":
        return <IntegrationManagement />
      case "reports":
        return <ReportsAnalytics />
      case "settings":
        return <SettingsConfiguration />
      case "audit":
        return <SystemAudit />
      case "k8s-config":
        return <KubernetesConfiguration />
      case "database":
        return <DatabaseManagement />
      case "security":
        return <SecurityCenter />
      case "activity":
        return <div className="p-6">Activity logs coming soon...</div>
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={tabTitles[activeTab as keyof typeof tabTitles]}
          onThemeToggle={handleThemeToggle}
          isDark={isDark}
        />

        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>

      <Toaster />
    </div>
  )
}
