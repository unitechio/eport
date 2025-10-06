"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Search,
  Plus,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Settings,
  Copy,
  Tag,
  Archive,
} from "lucide-react"

interface HarborProject {
  id: string
  name: string
  description: string
  repoCount: number
  environment: "production" | "staging" | "development"
  visibility: "public" | "private"
  created: string
  storageUsed: string
  storageLimit: string
  quotaUsage: number
}

interface HarborRepository {
  id: string
  project: string
  name: string
  pullCount: number
  artifactCount: number
  tagCount: number
  size: string
  lastPush: string
  environment: string
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

interface HarborArtifact {
  id: string
  repository: string
  digest: string
  tags: string[]
  size: string
  pushed: string
  pullCount: number
  scanStatus: "passed" | "failed" | "scanning" | "not_scanned"
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
  environment: string
}

const mockProjects: HarborProject[] = [
  {
    id: "proj1",
    name: "production-apps",
    description: "Production application images",
    repoCount: 12,
    environment: "production",
    visibility: "private",
    created: "2023-06-15T09:00:00Z",
    storageUsed: "45.2GB",
    storageLimit: "100GB",
    quotaUsage: 45.2,
  },
  {
    id: "proj2",
    name: "staging-apps",
    description: "Staging environment images",
    repoCount: 8,
    environment: "staging",
    visibility: "private",
    created: "2023-08-20T14:30:00Z",
    storageUsed: "28.5GB",
    storageLimit: "50GB",
    quotaUsage: 57,
  },
  {
    id: "proj3",
    name: "dev-sandbox",
    description: "Development and testing images",
    repoCount: 15,
    environment: "development",
    visibility: "private",
    created: "2023-09-10T11:15:00Z",
    storageUsed: "12.8GB",
    storageLimit: "30GB",
    quotaUsage: 42.7,
  },
]

const mockRepositories: HarborRepository[] = [
  {
    id: "repo1",
    project: "production-apps",
    name: "api-gateway",
    pullCount: 1250,
    artifactCount: 45,
    tagCount: 12,
    size: "8.5GB",
    lastPush: "2024-01-15T10:30:00Z",
    environment: "production",
    vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5 },
  },
  {
    id: "repo2",
    project: "production-apps",
    name: "web-frontend",
    pullCount: 2100,
    artifactCount: 38,
    tagCount: 10,
    size: "12.2GB",
    lastPush: "2024-01-14T14:20:00Z",
    environment: "production",
    vulnerabilities: { critical: 0, high: 0, medium: 2, low: 4 },
  },
  {
    id: "repo3",
    project: "staging-apps",
    name: "api-gateway",
    pullCount: 450,
    artifactCount: 28,
    tagCount: 8,
    size: "6.8GB",
    lastPush: "2024-01-13T09:15:00Z",
    environment: "staging",
    vulnerabilities: { critical: 1, high: 2, medium: 5, low: 8 },
  },
  {
    id: "repo4",
    project: "dev-sandbox",
    name: "test-service",
    pullCount: 120,
    artifactCount: 15,
    tagCount: 5,
    size: "3.2GB",
    lastPush: "2024-01-12T16:45:00Z",
    environment: "development",
    vulnerabilities: { critical: 0, high: 1, medium: 2, low: 3 },
  },
]

const mockArtifacts: HarborArtifact[] = [
  {
    id: "art1",
    repository: "api-gateway",
    digest: "sha256:a1b2c3d4e5f6...",
    tags: ["v1.2.3", "latest", "prod"],
    size: "245MB",
    pushed: "2024-01-15T10:30:00Z",
    pullCount: 450,
    scanStatus: "passed",
    vulnerabilities: { critical: 0, high: 0, medium: 2, low: 3 },
    environment: "production",
  },
  {
    id: "art2",
    repository: "api-gateway",
    digest: "sha256:b2c3d4e5f6g7...",
    tags: ["v1.2.2"],
    size: "243MB",
    pushed: "2024-01-10T08:15:00Z",
    pullCount: 320,
    scanStatus: "passed",
    vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5 },
    environment: "production",
  },
  {
    id: "art3",
    repository: "web-frontend",
    digest: "sha256:c3d4e5f6g7h8...",
    tags: ["v2.1.0", "latest"],
    size: "512MB",
    pushed: "2024-01-14T14:20:00Z",
    pullCount: 680,
    scanStatus: "failed",
    vulnerabilities: { critical: 2, high: 3, medium: 5, low: 8 },
    environment: "production",
  },
  {
    id: "art4",
    repository: "test-service",
    digest: "sha256:d4e5f6g7h8i9...",
    tags: ["dev-latest"],
    size: "180MB",
    pushed: "2024-01-12T16:45:00Z",
    pullCount: 45,
    scanStatus: "scanning",
    vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
    environment: "development",
  },
]

export function HarborManagement() {
  const [projects, setProjects] = useState<HarborProject[]>(mockProjects)
  const [repositories, setRepositories] = useState<HarborRepository[]>(mockRepositories)
  const [artifacts, setArtifacts] = useState<HarborArtifact[]>(mockArtifacts)
  const [selectedEnvironment, setSelectedEnvironment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projects.filter((project) => {
    const matchesEnv = selectedEnvironment === "all" || project.environment === selectedEnvironment
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesEnv && matchesSearch
  })

  const filteredRepositories = repositories.filter((repo) => {
    const matchesEnv = selectedEnvironment === "all" || repo.environment === selectedEnvironment
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.project.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesEnv && matchesSearch
  })

  const filteredArtifacts = artifacts.filter((artifact) => {
    const matchesEnv = selectedEnvironment === "all" || artifact.environment === selectedEnvironment
    const matchesSearch =
      artifact.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesEnv && matchesSearch
  })

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "staging":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "development":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getScanStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "scanning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "not_scanned":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getScanStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "scanning":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case "not_scanned":
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getVulnerabilityBadge = (vuln: { critical: number; high: number; medium: number; low: number }) => {
    if (vuln.critical > 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {vuln.critical} Critical
        </Badge>
      )
    }
    if (vuln.high > 0) {
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {vuln.high} High
        </Badge>
      )
    }
    if (vuln.medium > 0) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          {vuln.medium} Medium
        </Badge>
      )
    }
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Clean
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Harbor Registry Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage container images, artifacts, and security scanning across environments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">{repositories.length} repositories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artifacts</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repositories.reduce((sum, repo) => sum + repo.artifactCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all repositories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86.5GB</div>
            <p className="text-xs text-muted-foreground">of 180GB total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Issues</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {repositories.reduce((sum, repo) => sum + repo.vulnerabilities.critical + repo.vulnerabilities.high, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Critical & High severity</p>
          </CardContent>
        </Card>
      </div>

      {/* Environment Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Environment & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
              <SelectTrigger>
                <SelectValue placeholder="Select Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, repositories, or artifacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getEnvironmentColor(project.environment)}>{project.environment}</Badge>
                      <Badge variant="outline">{project.visibility}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Repositories</h4>
                      <p className="text-2xl font-bold">{project.repoCount}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Storage Quota</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>{project.storageUsed}</span>
                          <span>{project.storageLimit}</span>
                        </div>
                        <Progress value={project.quotaUsage} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Created</h4>
                      <p className="text-sm">{new Date(project.created).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="repositories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Repositories</CardTitle>
              <CardDescription>Container image repositories across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Artifacts</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Pull Count</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                    <TableHead>Last Push</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepositories.map((repo) => (
                    <TableRow key={repo.id}>
                      <TableCell className="font-medium">{repo.name}</TableCell>
                      <TableCell>{repo.project}</TableCell>
                      <TableCell>
                        <Badge className={getEnvironmentColor(repo.environment)}>{repo.environment}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant="outline">{repo.artifactCount} artifacts</Badge>
                          <Badge variant="outline">{repo.tagCount} tags</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{repo.size}</TableCell>
                      <TableCell>{repo.pullCount.toLocaleString()}</TableCell>
                      <TableCell>{getVulnerabilityBadge(repo.vulnerabilities)}</TableCell>
                      <TableCell className="text-sm">{new Date(repo.lastPush).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artifacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artifacts</CardTitle>
              <CardDescription>Container image artifacts with security scan results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Digest</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Scan Status</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                    <TableHead>Pull Count</TableHead>
                    <TableHead>Pushed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArtifacts.map((artifact) => (
                    <TableRow key={artifact.id}>
                      <TableCell className="font-medium">{artifact.repository}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {artifact.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono">{artifact.digest.substring(0, 20)}...</code>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEnvironmentColor(artifact.environment)}>{artifact.environment}</Badge>
                      </TableCell>
                      <TableCell>{artifact.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getScanStatusIcon(artifact.scanStatus)}
                          <Badge className={getScanStatusColor(artifact.scanStatus)}>{artifact.scanStatus}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getVulnerabilityBadge(artifact.vulnerabilities)}
                          {(artifact.vulnerabilities.critical > 0 ||
                            artifact.vulnerabilities.high > 0 ||
                            artifact.vulnerabilities.medium > 0) && (
                            <div className="text-xs text-muted-foreground">
                              C:{artifact.vulnerabilities.critical} H:{artifact.vulnerabilities.high} M:
                              {artifact.vulnerabilities.medium} L:{artifact.vulnerabilities.low}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{artifact.pullCount}</TableCell>
                      <TableCell className="text-sm">{new Date(artifact.pushed).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
