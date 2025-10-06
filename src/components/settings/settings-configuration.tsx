"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Database, Save, RefreshCw, Download, Upload, AlertTriangle, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SystemSettings {
  general: {
    systemName: string
    description: string
    timezone: string
    language: string
    dateFormat: string
    autoRefresh: boolean
    refreshInterval: number
  }
  notifications: {
    emailEnabled: boolean
    slackEnabled: boolean
    webhookEnabled: boolean
    criticalAlerts: boolean
    warningAlerts: boolean
    infoAlerts: boolean
    digestFrequency: string
  }
  security: {
    sessionTimeout: number
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
    }
    twoFactorAuth: boolean
    ipWhitelist: string[]
    auditLogging: boolean
  }
  monitoring: {
    dataRetention: number
    metricsInterval: number
    alertThresholds: {
      cpu: number
      memory: number
      disk: number
      network: number
    }
    healthCheckInterval: number
  }
  backup: {
    enabled: boolean
    frequency: string
    retention: number
    location: string
    encryption: boolean
  }
}

const defaultSettings: SystemSettings = {
  general: {
    systemName: "InfraCRM",
    description: "Infrastructure Management System",
    timezone: "UTC",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    autoRefresh: true,
    refreshInterval: 30,
  },
  notifications: {
    emailEnabled: true,
    slackEnabled: true,
    webhookEnabled: false,
    criticalAlerts: true,
    warningAlerts: true,
    infoAlerts: false,
    digestFrequency: "daily",
  },
  security: {
    sessionTimeout: 480,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
    },
    twoFactorAuth: false,
    ipWhitelist: [],
    auditLogging: true,
  },
  monitoring: {
    dataRetention: 90,
    metricsInterval: 60,
    alertThresholds: {
      cpu: 80,
      memory: 85,
      disk: 90,
      network: 75,
    },
    healthCheckInterval: 300,
  },
  backup: {
    enabled: true,
    frequency: "daily",
    retention: 30,
    location: "s3://backups/infracrm",
    encryption: true,
  },
}

export function SettingsConfiguration() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const updateSettings = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const updateNestedSettings = (section: keyof SystemSettings, nestedKey: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: {
          ...(prev[section] as any)[nestedKey],
          [key]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Simulate saving settings
    console.log("Saving settings:", settings)
    setHasChanges(false)
    // Show success message
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "infracrm-settings.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    setIsExportOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings & Configuration</h1>
          <p className="text-muted-foreground">Manage system settings and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Settings</DialogTitle>
                <DialogDescription>Download your current system configuration as a JSON file</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Settings</DialogTitle>
                <DialogDescription>Upload a configuration file to restore settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input type="file" accept=".json" />
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>Importing settings will overwrite your current configuration.</AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsImportOpen(false)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Unsaved Changes</AlertTitle>
          <AlertDescription>You have unsaved changes. Click "Save Changes" to apply them.</AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>Basic system configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.general.systemName}
                    onChange={(e) => updateSettings("general", "systemName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSettings("general", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.general.description}
                  onChange={(e) => updateSettings("general", "description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => updateSettings("general", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) => updateSettings("general", "dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                  </div>
                  <Switch
                    checked={settings.general.autoRefresh}
                    onCheckedChange={(checked) => updateSettings("general", "autoRefresh", checked)}
                  />
                </div>

                {settings.general.autoRefresh && (
                  <div className="space-y-2">
                    <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                    <Input
                      id="refreshInterval"
                      type="number"
                      value={settings.general.refreshInterval}
                      onChange={(e) => updateSettings("general", "refreshInterval", Number.parseInt(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>Configure how and when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailEnabled}
                    onCheckedChange={(checked) => updateSettings("notifications", "emailEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
                  </div>
                  <Switch
                    checked={settings.notifications.slackEnabled}
                    onCheckedChange={(checked) => updateSettings("notifications", "slackEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Webhook Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to custom webhooks</p>
                  </div>
                  <Switch
                    checked={settings.notifications.webhookEnabled}
                    onCheckedChange={(checked) => updateSettings("notifications", "webhookEnabled", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Alert Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">Critical</Badge>
                      <span className="text-sm">Critical alerts</span>
                    </div>
                    <Switch
                      checked={settings.notifications.criticalAlerts}
                      onCheckedChange={(checked) => updateSettings("notifications", "criticalAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Warning</Badge>
                      <span className="text-sm">Warning alerts</span>
                    </div>
                    <Switch
                      checked={settings.notifications.warningAlerts}
                      onCheckedChange={(checked) => updateSettings("notifications", "warningAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Info</Badge>
                      <span className="text-sm">Informational alerts</span>
                    </div>
                    <Switch
                      checked={settings.notifications.infoAlerts}
                      onCheckedChange={(checked) => updateSettings("notifications", "infoAlerts", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="digestFrequency">Digest Frequency</Label>
                <Select
                  value={settings.notifications.digestFrequency}
                  onValueChange={(value) => updateSettings("notifications", "digestFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Configure security policies and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Password Policy</h4>
                <div className="space-y-2">
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={settings.security.passwordPolicy.minLength}
                    onChange={(e) =>
                      updateNestedSettings("security", "passwordPolicy", "minLength", Number.parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Require Uppercase Letters</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireUppercase", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Require Numbers</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireNumbers", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Require Symbols</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireSymbols}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireSymbols", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSettings("security", "twoFactorAuth", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all user actions</p>
                  </div>
                  <Switch
                    checked={settings.security.auditLogging}
                    onCheckedChange={(checked) => updateSettings("security", "auditLogging", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Settings */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Monitoring Settings</span>
              </CardTitle>
              <CardDescription>Configure monitoring intervals and thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.monitoring.dataRetention}
                    onChange={(e) => updateSettings("monitoring", "dataRetention", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metricsInterval">Metrics Interval (seconds)</Label>
                  <Input
                    id="metricsInterval"
                    type="number"
                    value={settings.monitoring.metricsInterval}
                    onChange={(e) => updateSettings("monitoring", "metricsInterval", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Alert Thresholds (%)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpuThreshold">CPU Threshold</Label>
                    <Input
                      id="cpuThreshold"
                      type="number"
                      value={settings.monitoring.alertThresholds.cpu}
                      onChange={(e) =>
                        updateNestedSettings("monitoring", "alertThresholds", "cpu", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memoryThreshold">Memory Threshold</Label>
                    <Input
                      id="memoryThreshold"
                      type="number"
                      value={settings.monitoring.alertThresholds.memory}
                      onChange={(e) =>
                        updateNestedSettings("monitoring", "alertThresholds", "memory", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diskThreshold">Disk Threshold</Label>
                    <Input
                      id="diskThreshold"
                      type="number"
                      value={settings.monitoring.alertThresholds.disk}
                      onChange={(e) =>
                        updateNestedSettings("monitoring", "alertThresholds", "disk", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="networkThreshold">Network Threshold</Label>
                    <Input
                      id="networkThreshold"
                      type="number"
                      value={settings.monitoring.alertThresholds.network}
                      onChange={(e) =>
                        updateNestedSettings(
                          "monitoring",
                          "alertThresholds",
                          "network",
                          Number.parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthCheckInterval">Health Check Interval (seconds)</Label>
                <Input
                  id="healthCheckInterval"
                  type="number"
                  value={settings.monitoring.healthCheckInterval}
                  onChange={(e) => updateSettings("monitoring", "healthCheckInterval", Number.parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Backup Settings</span>
              </CardTitle>
              <CardDescription>Configure automated backups and retention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Backups</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                </div>
                <Switch
                  checked={settings.backup.enabled}
                  onCheckedChange={(checked) => updateSettings("backup", "enabled", checked)}
                />
              </div>

              {settings.backup.enabled && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Backup Frequency</Label>
                      <Select
                        value={settings.backup.frequency}
                        onValueChange={(value) => updateSettings("backup", "frequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retention">Retention (days)</Label>
                      <Input
                        id="retention"
                        type="number"
                        value={settings.backup.retention}
                        onChange={(e) => updateSettings("backup", "retention", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Backup Location</Label>
                    <Input
                      id="location"
                      value={settings.backup.location}
                      onChange={(e) => updateSettings("backup", "location", e.target.value)}
                      placeholder="s3://bucket/path or /local/path"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Encryption</Label>
                      <p className="text-sm text-muted-foreground">Encrypt backup files</p>
                    </div>
                    <Switch
                      checked={settings.backup.encryption}
                      onCheckedChange={(checked) => updateSettings("backup", "encryption", checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
