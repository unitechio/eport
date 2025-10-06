"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  HardDrive,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  FileText,
  Database,
  Lock,
  Server,
  Users,
  Key,
  Layers,
  Container,
} from "lucide-react"

interface KubernetesClusterConfig {
  name: string
  version: string
  endpoint: string
  certificateAuthority: string
  serviceSubnet: string
  podSubnet: string
  dnsService: string
  networkPlugin: string
  storageClass: string
  ingressController: string
  monitoring: boolean
  logging: boolean
  rbacEnabled: boolean
  networkPolicies: boolean
  podSecurityPolicies: boolean
}

interface KubernetesNamespace {
  name: string
  status: "Active" | "Terminating"
  labels: Record<string, string>
  annotations: Record<string, string>
  resourceQuota: {
    cpu: string
    memory: string
    storage: string
    pods: number
    services: number
  }
  networkPolicy: boolean
  created: string
}

interface KubernetesSecret {
  name: string
  namespace: string
  type: "Opaque" | "kubernetes.io/tls" | "kubernetes.io/dockerconfigjson" | "kubernetes.io/service-account-token"
  data: Record<string, string>
  labels: Record<string, string>
  created: string
  lastModified: string
}

interface KubernetesConfigMap {
  name: string
  namespace: string
  data: Record<string, string>
  binaryData: Record<string, string>
  labels: Record<string, string>
  created: string
  lastModified: string
}

interface KubernetesServiceAccount {
  name: string
  namespace: string
  secrets: string[]
  imagePullSecrets: string[]
  automountServiceAccountToken: boolean
  labels: Record<string, string>
  created: string
}

interface KubernetesRole {
  name: string
  namespace: string
  rules: Array<{
    apiGroups: string[]
    resources: string[]
    verbs: string[]
    resourceNames?: string[]
  }>
  labels: Record<string, string>
  created: string
}

interface KubernetesStorageClass {
  name: string
  provisioner: string
  parameters: Record<string, string>
  reclaimPolicy: "Retain" | "Delete" | "Recycle"
  allowVolumeExpansion: boolean
  volumeBindingMode: "Immediate" | "WaitForFirstConsumer"
  mountOptions: string[]
  default: boolean
}

export function KubernetesConfiguration() {
  const [activeTab, setActiveTab] = useState("cluster")
  const [isEditing, setIsEditing] = useState(false)

  const [clusterConfig, setClusterConfig] = useState<KubernetesClusterConfig>({
    name: "production-cluster",
    version: "v1.28.4",
    endpoint: "https://k8s-api.company.com:6443",
    certificateAuthority: "/etc/kubernetes/pki/ca.crt",
    serviceSubnet: "10.96.0.0/12",
    podSubnet: "10.244.0.0/16",
    dnsService: "10.96.0.10",
    networkPlugin: "calico",
    storageClass: "fast-ssd",
    ingressController: "nginx",
    monitoring: true,
    logging: true,
    rbacEnabled: true,
    networkPolicies: true,
    podSecurityPolicies: true,
  })

  const [namespaces, setNamespaces] = useState<KubernetesNamespace[]>([
    {
      name: "default",
      status: "Active",
      labels: {},
      annotations: {},
      resourceQuota: {
        cpu: "4",
        memory: "8Gi",
        storage: "100Gi",
        pods: 50,
        services: 10,
      },
      networkPolicy: false,
      created: "2024-01-01T00:00:00Z",
    },
    {
      name: "production",
      status: "Active",
      labels: {
        environment: "production",
        team: "platform",
      },
      annotations: {
        description: "Production workloads",
      },
      resourceQuota: {
        cpu: "16",
        memory: "32Gi",
        storage: "500Gi",
        pods: 200,
        services: 50,
      },
      networkPolicy: true,
      created: "2024-01-05T10:00:00Z",
    },
    {
      name: "staging",
      status: "Active",
      labels: {
        environment: "staging",
        team: "platform",
      },
      annotations: {
        description: "Staging environment for testing",
      },
      resourceQuota: {
        cpu: "8",
        memory: "16Gi",
        storage: "200Gi",
        pods: 100,
        services: 25,
      },
      networkPolicy: true,
      created: "2024-01-05T10:30:00Z",
    },
  ])

  const [secrets, setSecrets] = useState<KubernetesSecret[]>([
    {
      name: "database-credentials",
      namespace: "production",
      type: "Opaque",
      data: {
        username: "YWRtaW4=",
        password: "cGFzc3dvcmQ=",
      },
      labels: {
        app: "database",
        environment: "production",
      },
      created: "2024-01-10T08:00:00Z",
      lastModified: "2024-01-15T10:30:00Z",
    },
    {
      name: "tls-certificate",
      namespace: "production",
      type: "kubernetes.io/tls",
      data: {
        "tls.crt": "LS0tLS1CRUdJTi...",
        "tls.key": "LS0tLS1CRUdJTi...",
      },
      labels: {
        app: "web-server",
      },
      created: "2024-01-12T14:00:00Z",
      lastModified: "2024-01-12T14:00:00Z",
    },
    {
      name: "docker-registry",
      namespace: "default",
      type: "kubernetes.io/dockerconfigjson",
      data: {
        ".dockerconfigjson": "eyJhdXRocyI6e...",
      },
      labels: {},
      created: "2024-01-08T12:00:00Z",
      lastModified: "2024-01-08T12:00:00Z",
    },
  ])

  const [configMaps, setConfigMaps] = useState<KubernetesConfigMap[]>([
    {
      name: "app-config",
      namespace: "production",
      data: {
        "config.yaml": "database:\n  host: db.example.com\n  port: 5432",
        "app.properties": "debug=false\nlog.level=INFO",
      },
      binaryData: {},
      labels: {
        app: "web-app",
        version: "v1.2.0",
      },
      created: "2024-01-10T09:00:00Z",
      lastModified: "2024-01-14T16:00:00Z",
    },
    {
      name: "nginx-config",
      namespace: "production",
      data: {
        "nginx.conf": "server {\n  listen 80;\n  server_name example.com;\n}",
      },
      binaryData: {},
      labels: {
        app: "nginx",
      },
      created: "2024-01-11T11:00:00Z",
      lastModified: "2024-01-11T11:00:00Z",
    },
  ])

  const [serviceAccounts, setServiceAccounts] = useState<KubernetesServiceAccount[]>([
    {
      name: "default",
      namespace: "default",
      secrets: ["default-token-abc123"],
      imagePullSecrets: [],
      automountServiceAccountToken: true,
      labels: {},
      created: "2024-01-01T00:00:00Z",
    },
    {
      name: "app-service-account",
      namespace: "production",
      secrets: ["app-token-def456"],
      imagePullSecrets: ["docker-registry"],
      automountServiceAccountToken: true,
      labels: {
        app: "web-app",
      },
      created: "2024-01-10T10:00:00Z",
    },
    {
      name: "monitoring-service-account",
      namespace: "monitoring",
      secrets: ["monitoring-token-ghi789"],
      imagePullSecrets: [],
      automountServiceAccountToken: false,
      labels: {
        component: "monitoring",
      },
      created: "2024-01-12T15:00:00Z",
    },
  ])

  const [roles, setRoles] = useState<KubernetesRole[]>([
    {
      name: "pod-reader",
      namespace: "production",
      rules: [
        {
          apiGroups: [""],
          resources: ["pods"],
          verbs: ["get", "list", "watch"],
        },
      ],
      labels: {
        "rbac.authorization.k8s.io/aggregate-to-view": "true",
      },
      created: "2024-01-10T11:00:00Z",
    },
    {
      name: "deployment-manager",
      namespace: "production",
      rules: [
        {
          apiGroups: ["apps"],
          resources: ["deployments"],
          verbs: ["get", "list", "watch", "create", "update", "patch", "delete"],
        },
        {
          apiGroups: [""],
          resources: ["pods"],
          verbs: ["get", "list", "watch"],
        },
      ],
      labels: {},
      created: "2024-01-11T13:00:00Z",
    },
  ])

  const [storageClasses, setStorageClasses] = useState<KubernetesStorageClass[]>([
    {
      name: "fast-ssd",
      provisioner: "kubernetes.io/aws-ebs",
      parameters: {
        type: "gp3",
        iops: "3000",
        throughput: "125",
      },
      reclaimPolicy: "Delete",
      allowVolumeExpansion: true,
      volumeBindingMode: "WaitForFirstConsumer",
      mountOptions: [],
      default: true,
    },
    {
      name: "slow-hdd",
      provisioner: "kubernetes.io/aws-ebs",
      parameters: {
        type: "sc1",
      },
      reclaimPolicy: "Retain",
      allowVolumeExpansion: true,
      volumeBindingMode: "Immediate",
      mountOptions: [],
      default: false,
    },
    {
      name: "nfs-storage",
      provisioner: "nfs.csi.k8s.io",
      parameters: {
        server: "nfs.example.com",
        share: "/exports/k8s",
      },
      reclaimPolicy: "Retain",
      allowVolumeExpansion: false,
      volumeBindingMode: "Immediate",
      mountOptions: ["nfsvers=4.1"],
      default: false,
    },
  ])

  const handleSaveConfig = () => {
    console.log("[v0] Saving Kubernetes configuration...")
    setIsEditing(false)
  }

  const handleResetConfig = () => {
    console.log("[v0] Resetting Kubernetes configuration...")
    setIsEditing(false)
  }

  const addNamespace = () => {
    const newNamespace: KubernetesNamespace = {
      name: "new-namespace",
      status: "Active",
      labels: {},
      annotations: {},
      resourceQuota: {
        cpu: "2",
        memory: "4Gi",
        storage: "50Gi",
        pods: 25,
        services: 5,
      },
      networkPolicy: false,
      created: new Date().toISOString(),
    }
    setNamespaces([...namespaces, newNamespace])
  }

  const deleteNamespace = (index: number) => {
    setNamespaces(namespaces.filter((_, i) => i !== index))
  }

  const addSecret = () => {
    const newSecret: KubernetesSecret = {
      name: "new-secret",
      namespace: "default",
      type: "Opaque",
      data: {},
      labels: {},
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
    setSecrets([...secrets, newSecret])
  }

  const deleteSecret = (index: number) => {
    setSecrets(secrets.filter((_, i) => i !== index))
  }

  const addConfigMap = () => {
    const newConfigMap: KubernetesConfigMap = {
      name: "new-configmap",
      namespace: "default",
      data: {},
      binaryData: {},
      labels: {},
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
    setConfigMaps([...configMaps, newConfigMap])
  }

  const deleteConfigMap = (index: number) => {
    setConfigMaps(configMaps.filter((_, i) => i !== index))
  }

  const addServiceAccount = () => {
    const newServiceAccount: KubernetesServiceAccount = {
      name: "new-service-account",
      namespace: "default",
      secrets: [],
      imagePullSecrets: [],
      automountServiceAccountToken: true,
      labels: {},
      created: new Date().toISOString(),
    }
    setServiceAccounts([...serviceAccounts, newServiceAccount])
  }

  const deleteServiceAccount = (index: number) => {
    setServiceAccounts(serviceAccounts.filter((_, i) => i !== index))
  }

  const addRole = () => {
    const newRole: KubernetesRole = {
      name: "new-role",
      namespace: "default",
      rules: [],
      labels: {},
      created: new Date().toISOString(),
    }
    setRoles([...roles, newRole])
  }

  const deleteRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index))
  }

  const addStorageClass = () => {
    const newStorageClass: KubernetesStorageClass = {
      name: "new-storage-class",
      provisioner: "kubernetes.io/no-provisioner",
      parameters: {},
      reclaimPolicy: "Delete",
      allowVolumeExpansion: false,
      volumeBindingMode: "Immediate",
      mountOptions: [],
      default: false,
    }
    setStorageClasses([...storageClasses, newStorageClass])
  }

  const deleteStorageClass = (index: number) => {
    setStorageClasses(storageClasses.filter((_, i) => i !== index))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Terminating":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kubernetes Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage cluster settings, namespaces, secrets, RBAC, and storage configuration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <>
              <Button variant="outline" size="sm" onClick={handleResetConfig}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSaveConfig}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="cluster">Cluster</TabsTrigger>
          <TabsTrigger value="namespaces">Namespaces</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
          <TabsTrigger value="configmaps">ConfigMaps</TabsTrigger>
          <TabsTrigger value="rbac">RBAC</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="cluster" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Cluster Configuration
              </CardTitle>
              <CardDescription>Configure Kubernetes cluster settings and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>Cluster Name</Label>
                  <Input
                    value={clusterConfig.name}
                    disabled={!isEditing}
                    onChange={(e) => setClusterConfig({ ...clusterConfig, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Kubernetes Version</Label>
                  <Input
                    value={clusterConfig.version}
                    disabled={!isEditing}
                    onChange={(e) => setClusterConfig({ ...clusterConfig, version: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>API Server Endpoint</Label>
                  <Input
                    value={clusterConfig.endpoint}
                    disabled={!isEditing}
                    className="font-mono"
                    onChange={(e) => setClusterConfig({ ...clusterConfig, endpoint: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Service Subnet</Label>
                  <Input
                    value={clusterConfig.serviceSubnet}
                    disabled={!isEditing}
                    className="font-mono"
                    onChange={(e) => setClusterConfig({ ...clusterConfig, serviceSubnet: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Pod Subnet</Label>
                  <Input
                    value={clusterConfig.podSubnet}
                    disabled={!isEditing}
                    className="font-mono"
                    onChange={(e) => setClusterConfig({ ...clusterConfig, podSubnet: e.target.value })}
                  />
                </div>
                <div>
                  <Label>DNS Service IP</Label>
                  <Input
                    value={clusterConfig.dnsService}
                    disabled={!isEditing}
                    className="font-mono"
                    onChange={(e) => setClusterConfig({ ...clusterConfig, dnsService: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Network Plugin</Label>
                  <Select value={clusterConfig.networkPlugin} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calico">Calico</SelectItem>
                      <SelectItem value="flannel">Flannel</SelectItem>
                      <SelectItem value="weave">Weave Net</SelectItem>
                      <SelectItem value="cilium">Cilium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Default Storage Class</Label>
                  <Select value={clusterConfig.storageClass} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast-ssd">fast-ssd</SelectItem>
                      <SelectItem value="slow-hdd">slow-hdd</SelectItem>
                      <SelectItem value="nfs-storage">nfs-storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ingress Controller</Label>
                  <Select value={clusterConfig.ingressController} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nginx">NGINX</SelectItem>
                      <SelectItem value="traefik">Traefik</SelectItem>
                      <SelectItem value="istio">Istio Gateway</SelectItem>
                      <SelectItem value="haproxy">HAProxy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={clusterConfig.monitoring}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => setClusterConfig({ ...clusterConfig, monitoring: checked })}
                  />
                  <Label>Monitoring Enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={clusterConfig.logging}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => setClusterConfig({ ...clusterConfig, logging: checked })}
                  />
                  <Label>Logging Enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={clusterConfig.rbacEnabled}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => setClusterConfig({ ...clusterConfig, rbacEnabled: checked })}
                  />
                  <Label>RBAC Enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={clusterConfig.networkPolicies}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => setClusterConfig({ ...clusterConfig, networkPolicies: checked })}
                  />
                  <Label>Network Policies</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={clusterConfig.podSecurityPolicies}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => setClusterConfig({ ...clusterConfig, podSecurityPolicies: checked })}
                  />
                  <Label>Pod Security Policies</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="namespaces" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Namespaces
                  </CardTitle>
                  <CardDescription>Manage Kubernetes namespaces and resource quotas</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addNamespace}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Namespace
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {namespaces.map((namespace, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Container className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{namespace.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(namespace.created).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(namespace.status)}>{namespace.status}</Badge>
                        {namespace.networkPolicy && <Badge variant="secondary">Network Policy</Badge>}
                        {isEditing && (
                          <Button size="sm" variant="destructive" onClick={() => deleteNamespace(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">CPU Quota</Label>
                        <div className="font-medium">{namespace.resourceQuota.cpu}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Memory Quota</Label>
                        <div className="font-medium">{namespace.resourceQuota.memory}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Storage Quota</Label>
                        <div className="font-medium">{namespace.resourceQuota.storage}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Max Pods</Label>
                        <div className="font-medium">{namespace.resourceQuota.pods}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Max Services</Label>
                        <div className="font-medium">{namespace.resourceQuota.services}</div>
                      </div>
                    </div>

                    {Object.keys(namespace.labels).length > 0 && (
                      <div className="mb-3">
                        <Label className="text-sm text-muted-foreground">Labels</Label>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {Object.entries(namespace.labels).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}={value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch checked={namespace.networkPolicy} disabled={!isEditing} />
                      <Label className="text-sm">Network Policy Enabled</Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secrets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Secrets
                  </CardTitle>
                  <CardDescription>Manage Kubernetes secrets and sensitive data</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addSecret}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Secret
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Namespace</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Data Keys</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {secrets.map((secret, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{secret.name}</TableCell>
                        <TableCell>{secret.namespace}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {secret.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {Object.keys(secret.data).map((key) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(secret.created).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" disabled={!isEditing}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteSecret(index)}
                              disabled={!isEditing}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configmaps" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    ConfigMaps
                  </CardTitle>
                  <CardDescription>Manage Kubernetes configuration data</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addConfigMap}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add ConfigMap
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Namespace</TableHead>
                      <TableHead>Data Keys</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configMaps.map((configMap, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{configMap.name}</TableCell>
                        <TableCell>{configMap.namespace}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {Object.keys(configMap.data).map((key) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(configMap.created).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(configMap.lastModified).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" disabled={!isEditing}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteConfigMap(index)}
                              disabled={!isEditing}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rbac" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Service Accounts
                    </CardTitle>
                    <CardDescription>Manage Kubernetes service accounts</CardDescription>
                  </div>
                  {isEditing && (
                    <Button size="sm" onClick={addServiceAccount}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service Account
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Namespace</TableHead>
                        <TableHead>Secrets</TableHead>
                        <TableHead>Auto Mount Token</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceAccounts.map((sa, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{sa.name}</TableCell>
                          <TableCell>{sa.namespace}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{sa.secrets.length}</Badge>
                          </TableCell>
                          <TableCell>
                            {sa.automountServiceAccountToken ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" disabled={!isEditing}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteServiceAccount(index)}
                                disabled={!isEditing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Roles
                    </CardTitle>
                    <CardDescription>Manage Kubernetes RBAC roles and permissions</CardDescription>
                  </div>
                  {isEditing && (
                    <Button size="sm" onClick={addRole}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Namespace</TableHead>
                        <TableHead>Rules</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell>{role.namespace}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{role.rules.length} rules</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(role.created).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" disabled={!isEditing}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteRole(index)}
                                disabled={!isEditing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Storage Classes
                  </CardTitle>
                  <CardDescription>Manage Kubernetes storage classes and provisioners</CardDescription>
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addStorageClass}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Storage Class
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storageClasses.map((sc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{sc.name}</h3>
                          <p className="text-sm text-muted-foreground">{sc.provisioner}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {sc.default && <Badge>Default</Badge>}
                        <Badge variant="outline">{sc.reclaimPolicy}</Badge>
                        {isEditing && (
                          <Button size="sm" variant="destructive" onClick={() => deleteStorageClass(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label className="text-sm">Storage Class Name</Label>
                        <Input value={sc.name} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label className="text-sm">Provisioner</Label>
                        <Input value={sc.provisioner} disabled={!isEditing} className="font-mono text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm">Reclaim Policy</Label>
                        <Select value={sc.reclaimPolicy} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Retain">Retain</SelectItem>
                            <SelectItem value="Delete">Delete</SelectItem>
                            <SelectItem value="Recycle">Recycle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Volume Binding Mode</Label>
                        <Select value={sc.volumeBindingMode} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Immediate">Immediate</SelectItem>
                            <SelectItem value="WaitForFirstConsumer">WaitForFirstConsumer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Parameters</Label>
                        <Textarea
                          value={Object.entries(sc.parameters)
                            .map(([k, v]) => `${k}=${v}`)
                            .join("\n")}
                          disabled={!isEditing}
                          className="font-mono text-sm"
                          placeholder="type=gp3&#10;iops=3000"
                          rows={2}
                        />
                      </div>
                      {sc.mountOptions.length > 0 && (
                        <div>
                          <Label className="text-sm">Mount Options</Label>
                          <Input
                            value={sc.mountOptions.join(", ")}
                            disabled={!isEditing}
                            className="font-mono text-sm"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <Switch checked={sc.allowVolumeExpansion} disabled={!isEditing} />
                        <Label className="text-sm">Allow Volume Expansion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={sc.default} disabled={!isEditing} />
                        <Label className="text-sm">Default Storage Class</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
