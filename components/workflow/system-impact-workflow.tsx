"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  User,
  Calendar,
  Server,
  Container,
  Network,
  Shield,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Edit,
  Trash2,
  Users,
  Upload,
} from "lucide-react"
import { LogViewerModal } from "@/components/shared/log-viewer-modal"
import { PDFViewerModal } from "@/components/shared/pdf-viewer-modal"
import { UserPickerModal } from "@/components/shared/user-picker-modal"

interface SystemImpact {
  id: string
  title: string
  description: string
  type: "deployment" | "configuration" | "maintenance" | "security" | "infrastructure"
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "approved" | "rejected" | "in-review" | "completed"
  submitter: string
  submittedAt: string
  reviewer?: string
  reviewedAt?: string
  scheduledAt?: string
  affectedSystems: string[]
  estimatedDowntime: string
  rollbackPlan: string
  approvalComments?: string
  approvers: Array<{ id: string; name: string; email: string; role: string; department: string }>
  documentUrl?: string
  reason: string
  impactDetails: string
}

export function SystemImpactWorkflow() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedImpact, setSelectedImpact] = useState<SystemImpact | null>(null)
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false)
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)
  const [isUserPickerOpen, setIsUserPickerOpen] = useState(false)
  const [selectedApprovers, setSelectedApprovers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    severity: "",
    affectedSystems: "",
    scheduledAt: "",
    estimatedDowntime: "",
    rollbackPlan: "",
    reason: "",
    impactDetails: "",
  })

  // Mock data
  const [impacts, setImpacts] = useState<SystemImpact[]>([
    {
      id: "IMP-001",
      title: "Database Migration - PostgreSQL 14 to 15",
      description: "Upgrade production PostgreSQL database from version 14 to 15 with zero downtime migration strategy",
      type: "infrastructure",
      severity: "high",
      status: "pending",
      submitter: "John Doe",
      submittedAt: "2024-01-15T10:30:00Z",
      scheduledAt: "2024-01-20T02:00:00Z",
      affectedSystems: ["prod-db-01", "prod-db-02", "api-gateway"],
      estimatedDowntime: "0 minutes (rolling upgrade)",
      rollbackPlan: "Automated rollback script available. Backup created before migration.",
      approvers: [{ id: "user-1", name: "Approver One", email: "app1@example.com", role: "Admin", department: "IT" }],
      reason: "To leverage new features and performance improvements.",
      impactDetails: "Potential for brief latency during migration, but zero downtime expected.",
      documentUrl: "/sample-impact-document.pdf",
    },
    {
      id: "IMP-002",
      title: "Kubernetes Cluster Upgrade",
      description: "Upgrade K8s cluster from 1.27 to 1.28 with node-by-node rolling update",
      type: "infrastructure",
      severity: "critical",
      status: "in-review",
      submitter: "Jane Smith",
      submittedAt: "2024-01-14T14:20:00Z",
      reviewer: "Mike Johnson",
      scheduledAt: "2024-01-18T00:00:00Z",
      affectedSystems: ["k8s-prod-cluster", "all-microservices"],
      estimatedDowntime: "5 minutes per node",
      rollbackPlan: "Snapshot of etcd cluster. Can rollback individual nodes.",
      approvers: [
        { id: "user-2", name: "Approver Two", email: "app2@example.com", role: "Engineer", department: "DevOps" },
      ],
      reason: "Security vulnerabilities and end-of-life support for the current version.",
      impactDetails: "Temporary disruptions to services running on upgraded nodes.",
    },
    {
      id: "IMP-003",
      title: "Firewall Rule Update - Allow New IP Range",
      description: "Add new IP range 10.50.0.0/16 to production firewall for new office location",
      type: "security",
      severity: "medium",
      status: "approved",
      submitter: "Alice Brown",
      submittedAt: "2024-01-13T09:15:00Z",
      reviewer: "Security Team",
      reviewedAt: "2024-01-13T11:30:00Z",
      scheduledAt: "2024-01-16T10:00:00Z",
      affectedSystems: ["prod-firewall-01", "prod-firewall-02"],
      estimatedDowntime: "0 minutes",
      rollbackPlan: "Remove firewall rule immediately if issues detected.",
      approvalComments: "Approved after security review. IP range verified with network team.",
      approvers: [
        { id: "user-3", name: "Approver Three", email: "app3@example.com", role: "Analyst", department: "Security" },
      ],
      reason: "To enable network connectivity for the new office.",
      impactDetails: "Will allow inbound traffic from the specified IP range.",
    },
    {
      id: "IMP-004",
      title: "Redis Cache Configuration Change",
      description: "Increase maxmemory-policy to allkeys-lru and adjust memory limits",
      type: "configuration",
      severity: "low",
      status: "rejected",
      submitter: "Bob Wilson",
      submittedAt: "2024-01-12T16:45:00Z",
      reviewer: "Tech Lead",
      reviewedAt: "2024-01-13T08:00:00Z",
      affectedSystems: ["redis-prod-01", "redis-prod-02"],
      estimatedDowntime: "0 minutes",
      rollbackPlan: "Revert configuration via Ansible playbook.",
      approvalComments: "Rejected - Need more detailed performance analysis before making this change.",
      approvers: [
        { id: "user-4", name: "Approver Four", email: "app4@example.com", role: "Lead", department: "Engineering" },
      ],
      reason: "Performance optimization.",
      impactDetails: "Potential impact on cache hit rates and memory usage.",
    },
    {
      id: "IMP-005",
      title: "Deploy New Microservice - Payment Gateway v2",
      description: "Deploy new payment gateway service with improved fraud detection",
      type: "deployment",
      severity: "high",
      status: "completed",
      submitter: "Sarah Lee",
      submittedAt: "2024-01-10T11:00:00Z",
      reviewer: "DevOps Team",
      reviewedAt: "2024-01-11T09:00:00Z",
      scheduledAt: "2024-01-12T14:00:00Z",
      affectedSystems: ["payment-service", "api-gateway", "load-balancer"],
      estimatedDowntime: "0 minutes (blue-green deployment)",
      rollbackPlan: "Switch traffic back to v1 via load balancer.",
      approvalComments: "Approved. All tests passed. Monitoring in place.",
      approvers: [
        { id: "user-5", name: "Approver Five", email: "app5@example.com", role: "Manager", department: "Product" },
      ],
      reason: "Enhance payment processing capabilities.",
      impactDetails: "Rollout of new payment gateway with enhanced fraud detection features.",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-review":
        return <Eye className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "in-review":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "completed":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deployment":
        return <Container className="h-4 w-4" />
      case "configuration":
        return <FileText className="h-4 w-4" />
      case "maintenance":
        return <Server className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "infrastructure":
        return <Network className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredImpacts = impacts.filter((impact) => {
    const matchesSearch =
      impact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      impact.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || impact.type === filterType
    const matchesSeverity = filterSeverity === "all" || impact.severity === filterSeverity
    const matchesTab = activeTab === "all" || impact.status === activeTab

    return matchesSearch && matchesType && matchesSeverity && matchesTab
  })

  const stats = {
    pending: impacts.filter((i) => i.status === "pending").length,
    inReview: impacts.filter((i) => i.status === "in-review").length,
    approved: impacts.filter((i) => i.status === "approved").length,
    rejected: impacts.filter((i) => i.status === "rejected").length,
    completed: impacts.filter((i) => i.status === "completed").length,
  }

  const handleApprove = (impactId: string) => {
    setImpacts(
      impacts.map((impact) =>
        impact.id === impactId
          ? {
              ...impact,
              status: "approved",
              reviewer: "Current User",
              reviewedAt: new Date().toISOString(),
              approvalComments: "Approved after review.",
            }
          : impact,
      ),
    )
  }

  const handleReject = (impactId: string, reason: string) => {
    setImpacts(
      impacts.map((impact) =>
        impact.id === impactId
          ? {
              ...impact,
              status: "rejected",
              reviewer: "Current User",
              reviewedAt: new Date().toISOString(),
              approvalComments: reason,
            }
          : impact,
      ),
    )
  }

  const handleCreate = () => {
    const newImpact: SystemImpact = {
      id: `IMP-${String(impacts.length + 1).padStart(3, "0")}`,
      title: formData.title,
      description: formData.description,
      type: formData.type as any,
      severity: formData.severity as any,
      status: "pending",
      submitter: "Current User",
      submittedAt: new Date().toISOString(),
      scheduledAt: formData.scheduledAt,
      affectedSystems: formData.affectedSystems.split(",").map((s) => s.trim()),
      estimatedDowntime: formData.estimatedDowntime,
      rollbackPlan: formData.rollbackPlan,
      approvers: selectedApprovers,
      reason: formData.reason,
      impactDetails: formData.impactDetails,
      documentUrl: "/sample-impact-document.pdf", // Placeholder for actual upload
    }
    setImpacts([...impacts, newImpact])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!selectedImpact) return
    setImpacts(
      impacts.map((impact) =>
        impact.id === selectedImpact.id
          ? {
              ...impact,
              title: formData.title,
              description: formData.description,
              type: formData.type as any,
              severity: formData.severity as any,
              scheduledAt: formData.scheduledAt,
              affectedSystems: formData.affectedSystems.split(",").map((s) => s.trim()),
              estimatedDowntime: formData.estimatedDowntime,
              rollbackPlan: formData.rollbackPlan,
              approvers: selectedApprovers,
              reason: formData.reason,
              impactDetails: formData.impactDetails,
            }
          : impact,
      ),
    )
    setIsEditDialogOpen(false)
    setSelectedImpact(null)
    resetForm()
  }

  const handleDelete = (impactId: string) => {
    if (confirm("Are you sure you want to delete this impact registration?")) {
      setImpacts(impacts.filter((impact) => impact.id !== impactId))
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      severity: "",
      affectedSystems: "",
      scheduledAt: "",
      estimatedDowntime: "",
      rollbackPlan: "",
      reason: "",
      impactDetails: "",
    })
    setSelectedApprovers([])
  }

  const openEditDialog = (impact: SystemImpact) => {
    setSelectedImpact(impact)
    setFormData({
      title: impact.title,
      description: impact.description,
      type: impact.type,
      severity: impact.severity,
      affectedSystems: impact.affectedSystems.join(", "),
      scheduledAt: impact.scheduledAt || "",
      estimatedDowntime: impact.estimatedDowntime,
      rollbackPlan: impact.rollbackPlan,
      reason: impact.reason || "",
      impactDetails: impact.impactDetails || "",
    })
    setSelectedApprovers(impact.approvers || [])
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Impact & Approval Workflow</h2>
          <p className="text-muted-foreground">Register and manage system changes with approval workflow</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register Impact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register System Impact</DialogTitle>
              <DialogDescription>Submit a new system change for approval</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Impact Title</Label>
                <Input id="title" placeholder="Brief description of the change" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea id="description" placeholder="Provide detailed information about the change" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Change Type</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deployment">Deployment</SelectItem>
                      <SelectItem value="configuration">Configuration</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="affected">Affected Systems</Label>
                <Input id="affected" placeholder="server-01, database-prod, api-gateway" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled">Scheduled Time</Label>
                  <Input id="scheduled" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downtime">Estimated Downtime</Label>
                  <Input id="downtime" placeholder="e.g., 30 minutes" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollback">Rollback Plan</Label>
                <Textarea id="rollback" placeholder="Describe the rollback procedure" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Submit for Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search impacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deployment">Deployment</SelectItem>
                <SelectItem value="configuration">Configuration</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full md:w-[180px]">
                <AlertCircle className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Impacts List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-review">In Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredImpacts.map((impact) => (
            <Card key={impact.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{impact.title}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(impact.status)}>
                        {getStatusIcon(impact.status)}
                        <span className="ml-1">{impact.status}</span>
                      </Badge>
                    </div>
                    <CardDescription>{impact.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getSeverityColor(impact.severity)}>
                      {impact.severity}
                    </Badge>
                    <Badge variant="outline">
                      {getTypeIcon(impact.type)}
                      <span className="ml-1">{impact.type}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Submitted by:</span>
                      <span className="font-medium">{impact.submitter}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="font-medium">{new Date(impact.submittedAt).toLocaleString()}</span>
                    </div>
                    {impact.scheduledAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Scheduled:</span>
                        <span className="font-medium">{new Date(impact.scheduledAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {impact.reviewer && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Reviewed by:</span>
                        <span className="font-medium">{impact.reviewer}</span>
                      </div>
                    )}
                    {impact.reviewedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Reviewed:</span>
                        <span className="font-medium">{new Date(impact.reviewedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Affected Systems:</div>
                  <div className="flex flex-wrap gap-2">
                    {impact.affectedSystems.map((system) => (
                      <Badge key={system} variant="secondary">
                        <Server className="mr-1 h-3 w-3" />
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Estimated Downtime:</div>
                    <div className="text-sm text-muted-foreground">{impact.estimatedDowntime}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Impact ID:</div>
                    <div className="text-sm text-muted-foreground font-mono">{impact.id}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Rollback Plan:</div>
                  <div className="text-sm text-muted-foreground">{impact.rollbackPlan}</div>
                </div>

                {impact.approvalComments && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Review Comments:
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {impact.approvalComments}
                    </div>
                  </div>
                )}

                {impact.approvers && impact.approvers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Approvers:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {impact.approvers.map((approver) => (
                        <Badge key={approver.id} variant="outline">
                          {approver.name} - {approver.role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {impact.reason && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Reason for Change:</div>
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{impact.reason}</div>
                  </div>
                )}

                {impact.impactDetails && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Impact Details:</div>
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{impact.impactDetails}</div>
                  </div>
                )}

                {/* Action buttons for pending/in-review */}
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve System Impact</DialogTitle>
                        <DialogDescription>Are you sure you want to approve this system change?</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Label htmlFor="approval-comment">Approval Comments (Optional)</Label>
                        <Textarea id="approval-comment" placeholder="Add any comments..." rows={3} />
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={() => handleApprove(impact.id)}>Confirm Approval</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject System Impact</DialogTitle>
                        <DialogDescription>Please provide a reason for rejecting this change.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Label htmlFor="rejection-reason">Rejection Reason</Label>
                        <Textarea
                          id="rejection-reason"
                          placeholder="Explain why this change is being rejected..."
                          rows={4}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive" onClick={() => handleReject(impact.id, "Rejected by reviewer")}>
                          Confirm Rejection
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>

                {/* Action buttons for other statuses */}
                <div className="flex gap-2 pt-2 flex-wrap">
                  {impact.status === "pending" || impact.status === "in-review" ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-transparent">
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve System Impact</DialogTitle>
                            <DialogDescription>Are you sure you want to approve this system change?</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Label htmlFor="approval-comment">Approval Comments (Optional)</Label>
                            <Textarea id="approval-comment" placeholder="Add any comments..." rows={3} />
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={() => handleApprove(impact.id)}>Confirm Approval</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-transparent">
                            <ThumbsDown className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject System Impact</DialogTitle>
                            <DialogDescription>Please provide a reason for rejecting this change.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Label htmlFor="rejection-reason">Rejection Reason</Label>
                            <Textarea
                              id="rejection-reason"
                              placeholder="Explain why this change is being rejected..."
                              rows={4}
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(impact.id, "Rejected by reviewer")}
                            >
                              Confirm Rejection
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : null}
                  <Button variant="outline" onClick={() => openEditDialog(impact)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleDelete(impact.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  {impact.documentUrl && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImpact(impact)
                        setIsPDFViewerOpen(true)
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Document
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImpact(impact)
                      setIsLogViewerOpen(true)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredImpacts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No impacts found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or create a new impact registration
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          setIsEditDialogOpen(open)
          if (!open) {
            resetForm()
            setSelectedImpact(null)
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? "Edit" : "Register"} System Impact</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? "Update the" : "Submit a new"} system change for approval
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Impact Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the change"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the change"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Change *</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this change is necessary"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="impactDetails">Impact Details *</Label>
              <Textarea
                id="impactDetails"
                placeholder="Describe the expected impact on systems and users"
                rows={3}
                value={formData.impactDetails}
                onChange={(e) => setFormData({ ...formData, impactDetails: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Change Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deployment">Deployment</SelectItem>
                    <SelectItem value="configuration">Configuration</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="affected">Affected Systems *</Label>
              <Input
                id="affected"
                placeholder="server-01, database-prod, api-gateway (comma separated)"
                value={formData.affectedSystems}
                onChange={(e) => setFormData({ ...formData, affectedSystems: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled">Scheduled Time *</Label>
                <Input
                  id="scheduled"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downtime">Estimated Downtime *</Label>
                <Input
                  id="downtime"
                  placeholder="e.g., 30 minutes"
                  value={formData.estimatedDowntime}
                  onChange={(e) => setFormData({ ...formData, estimatedDowntime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollback">Rollback Plan *</Label>
              <Textarea
                id="rollback"
                placeholder="Describe the rollback procedure"
                rows={3}
                value={formData.rollbackPlan}
                onChange={(e) => setFormData({ ...formData, rollbackPlan: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Approvers *</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setIsUserPickerOpen(true)} className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  Select Approvers ({selectedApprovers.length} selected)
                </Button>
              </div>
              {selectedApprovers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApprovers.map((user) => (
                    <Badge key={user.id} variant="secondary">
                      {user.name} - {user.role}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">Supporting Document (PDF)</Label>
              <div className="flex items-center gap-2">
                <Input id="document" type="file" accept=".pdf" className="flex-1" />
                <Button type="button" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setIsEditDialogOpen(false)
                resetForm()
                setSelectedImpact(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={isEditDialogOpen ? handleEdit : handleCreate}>
              {isEditDialogOpen ? "Update" : "Submit"} for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedImpact && (
        <>
          <LogViewerModal
            isOpen={isLogViewerOpen}
            onClose={() => {
              setIsLogViewerOpen(false)
              setSelectedImpact(null)
            }}
            title={`Logs for ${selectedImpact.title}`}
            resourceId={selectedImpact.id}
            resourceType="server"
          />
          <PDFViewerModal
            isOpen={isPDFViewerOpen}
            onClose={() => {
              setIsPDFViewerOpen(false)
              setSelectedImpact(null)
            }}
            title={`Document for ${selectedImpact.title}`}
            pdfUrl={selectedImpact.documentUrl || ""}
          />
        </>
      )}
      <UserPickerModal
        isOpen={isUserPickerOpen}
        onClose={() => setIsUserPickerOpen(false)}
        onSelect={(users) => setSelectedApprovers(users)}
        selectedUsers={selectedApprovers}
        multiSelect={true}
      />
    </div>
  )
}
