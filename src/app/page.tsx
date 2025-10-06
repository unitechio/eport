// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/app/layout/sidebar";
import { Header } from "@/app/layout/header";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { ServerList } from "@/app/servers/page";
import { ServerDetail } from "@/app/servers/[id]/page";
import { AlertsPage } from "@/components/alerts/alerts-page";
import { UserManagement } from "@/components/users/user-management";
import { IntegrationManagement } from "@/components/integrations/integration-management";
import { ReportsAnalytics } from "@/components/reports/reports-analytics";
import { SettingsConfiguration } from "@/components/settings/settings-configuration";
import { SystemAudit } from "@/components/audit/system-audit";
import { DockerManagement } from "@/components/docker/docker-management";
import { KubernetesManagement } from "@/components/kubernetes/kubernetes-management";
import { KubernetesConfiguration } from "@/components/kubernetes/kubernetes-configuration";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";

const tabTitles = {
  dashboard: "Infrastructure Dashboard",
  servers: "Server Management",
  containers: "Docker Container Management",
  monitoring: "Kubernetes Management",
  alerts: "Alerts & Notifications",
  database: "Database Management",
  security: "Security Center",
  integrations: "Integration Management",
  reports: "Reports & Analytics",
  activity: "Activity Logs",
  users: "User Management",
  settings: "System Settings",
  audit: "System Audit & Impact Management",
  "k8s-config": "Kubernetes Configuration",
};

export default function InfraCRMDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [configuringServer, setConfiguringServer] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleServerSelect = (serverId: string) => {
    setSelectedServer(serverId);
  };

  const handleConfigureServer = (serverId: string) => {
    setConfiguringServer(serverId);
    setSelectedServer(serverId);
  };

  const renderContent = () => {
    if (selectedServer) {
      return <ServerDetail serverId={selectedServer} onBack={() => setSelectedServer(null)} />;
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "servers":
        return <ServerList onServerSelect={handleServerSelect} onConfigureServer={handleConfigureServer} />;
      case "containers":
        return <DockerManagement />;
      case "monitoring":
        return <KubernetesManagement />;
      case "alerts":
        return <AlertsPage />;
      case "users":
        return <UserManagement />;
      case "integrations":
        return <IntegrationManagement />;
      case "reports":
        return <ReportsAnalytics />;
      case "settings":
        return <SettingsConfiguration />;
      case "audit":
        return <SystemAudit />;
      case "k8s-config":
        return <KubernetesConfiguration />;
      case "database":
        return <div className="p-6">Database management coming soon...</div>;
      case "security":
        return <div className="p-6">Security center coming soon...</div>;
      case "activity":
        return <div className="p-6">Activity logs coming soon...</div>;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={tabTitles[activeTab as keyof typeof tabTitles]}
            onThemeToggle={handleThemeToggle}
            isDark={isDark}
            onLogout={logout}
          />

          <main className="flex-1 overflow-auto">{renderContent()}</main>
        </div>
      </div>
    </AuthGuard>
  );
}