"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, Filter, RotateCcw } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export interface FilterState {
  search: string
  status: string[]
  location: string[]
  os: string[]
  tags: string[]
  cpuRange: [number, number]
  memoryRange: [number, number]
  diskRange: [number, number]
  uptimeMin: number
  containerCountRange: [number, number]
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
}

const defaultFilters: FilterState = {
  search: "",
  status: [],
  location: [],
  os: [],
  tags: [],
  cpuRange: [0, 100],
  memoryRange: [0, 100],
  diskRange: [0, 100],
  uptimeMin: 0,
  containerCountRange: [0, 20],
}

const statusOptions = [
  { value: "healthy", label: "Healthy", color: "bg-green-500" },
  { value: "warning", label: "Warning", color: "bg-yellow-500" },
  { value: "critical", label: "Critical", color: "bg-red-500" },
  { value: "offline", label: "Offline", color: "bg-gray-500" },
]

const locationOptions = [
  "US-East-1",
  "US-West-2",
  "EU-Central-1",
  "Asia-Pacific-1",
  "Canada-Central-1",
  "Australia-Southeast-1",
]

const osOptions = [
  "Ubuntu 22.04 LTS",
  "Ubuntu 20.04 LTS",
  "CentOS 8",
  "Alpine Linux",
  "Red Hat Enterprise Linux 8",
  "Windows Server 2022",
]

const tagOptions = [
  "production",
  "staging",
  "development",
  "web",
  "database",
  "api",
  "cache",
  "worker",
  "backup",
  "storage",
  "nginx",
  "mysql",
  "redis",
  "gateway",
  "queue",
  "archive",
]

export function AdvancedFilters({ filters, onFiltersChange, onReset }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.status.length > 0) count++
    if (filters.location.length > 0) count++
    if (filters.os.length > 0) count++
    if (filters.tags.length > 0) count++
    if (filters.cpuRange[0] > 0 || filters.cpuRange[1] < 100) count++
    if (filters.memoryRange[0] > 0 || filters.memoryRange[1] < 100) count++
    if (filters.diskRange[0] > 0 || filters.diskRange[1] < 100) count++
    if (filters.uptimeMin > 0) count++
    if (filters.containerCountRange[0] > 0 || filters.containerCountRange[1] < 20) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>Apply detailed filters to find specific servers in your infrastructure</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search servers, IPs, or tags..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          <Separator />

          {/* Status Filter */}
          <div className="space-y-3">
            <Label>Server Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={() => toggleArrayFilter("status", status.value)}
                  />
                  <Label htmlFor={`status-${status.value}`} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                    <span>{status.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Location Filter */}
          <div className="space-y-3">
            <Label>Location</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {locationOptions.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.location.includes(location)}
                    onCheckedChange={() => toggleArrayFilter("location", location)}
                  />
                  <Label htmlFor={`location-${location}`}>{location}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Operating System Filter */}
          <div className="space-y-3">
            <Label>Operating System</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {osOptions.map((os) => (
                <div key={os} className="flex items-center space-x-2">
                  <Checkbox
                    id={`os-${os}`}
                    checked={filters.os.includes(os)}
                    onCheckedChange={() => toggleArrayFilter("os", os)}
                  />
                  <Label htmlFor={`os-${os}`} className="text-sm">
                    {os}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tags Filter */}
          <div className="space-y-3">
            <Label>Tags</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {tagOptions.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={filters.tags.includes(tag)}
                    onCheckedChange={() => toggleArrayFilter("tags", tag)}
                  />
                  <Label htmlFor={`tag-${tag}`} className="text-sm">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resource Usage Filters */}
          <div className="space-y-4">
            <Label>Resource Usage</Label>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">CPU Usage</Label>
                <span className="text-sm text-muted-foreground">
                  {filters.cpuRange[0]}% - {filters.cpuRange[1]}%
                </span>
              </div>
              <Slider
                value={filters.cpuRange}
                onValueChange={(value) => updateFilter("cpuRange", value as [number, number])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Memory Usage</Label>
                <span className="text-sm text-muted-foreground">
                  {filters.memoryRange[0]}% - {filters.memoryRange[1]}%
                </span>
              </div>
              <Slider
                value={filters.memoryRange}
                onValueChange={(value) => updateFilter("memoryRange", value as [number, number])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Disk Usage</Label>
                <span className="text-sm text-muted-foreground">
                  {filters.diskRange[0]}% - {filters.diskRange[1]}%
                </span>
              </div>
              <Slider
                value={filters.diskRange}
                onValueChange={(value) => updateFilter("diskRange", value as [number, number])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Uptime Filter */}
          <div className="space-y-3">
            <Label htmlFor="uptime">Minimum Uptime (days)</Label>
            <Input
              id="uptime"
              type="number"
              min="0"
              value={filters.uptimeMin}
              onChange={(e) => updateFilter("uptimeMin", Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <Separator />

          {/* Container Count Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Container Count</Label>
              <span className="text-sm text-muted-foreground">
                {filters.containerCountRange[0]} - {filters.containerCountRange[1]}
              </span>
            </div>
            <Slider
              value={filters.containerCountRange}
              onValueChange={(value) => updateFilter("containerCountRange", value as [number, number])}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Active filters display component
export function ActiveFilters({
  filters,
  onRemoveFilter,
}: {
  filters: FilterState
  onRemoveFilter: (key: keyof FilterState, value?: string) => void
}) {
  const activeFilters: Array<{ key: keyof FilterState; label: string; value?: string }> = []

  if (filters.search) {
    activeFilters.push({ key: "search", label: `Search: "${filters.search}"` })
  }

  filters.status.forEach((status) => {
    activeFilters.push({ key: "status", label: `Status: ${status}`, value: status })
  })

  filters.location.forEach((location) => {
    activeFilters.push({ key: "location", label: `Location: ${location}`, value: location })
  })

  filters.os.forEach((os) => {
    activeFilters.push({ key: "os", label: `OS: ${os}`, value: os })
  })

  filters.tags.forEach((tag) => {
    activeFilters.push({ key: "tags", label: `Tag: ${tag}`, value: tag })
  })

  if (filters.cpuRange[0] > 0 || filters.cpuRange[1] < 100) {
    activeFilters.push({
      key: "cpuRange",
      label: `CPU: ${filters.cpuRange[0]}%-${filters.cpuRange[1]}%`,
    })
  }

  if (filters.memoryRange[0] > 0 || filters.memoryRange[1] < 100) {
    activeFilters.push({
      key: "memoryRange",
      label: `Memory: ${filters.memoryRange[0]}%-${filters.memoryRange[1]}%`,
    })
  }

  if (filters.diskRange[0] > 0 || filters.diskRange[1] < 100) {
    activeFilters.push({
      key: "diskRange",
      label: `Disk: ${filters.diskRange[0]}%-${filters.diskRange[1]}%`,
    })
  }

  if (filters.uptimeMin > 0) {
    activeFilters.push({ key: "uptimeMin", label: `Min Uptime: ${filters.uptimeMin} days` })
  }

  if (filters.containerCountRange[0] > 0 || filters.containerCountRange[1] < 20) {
    activeFilters.push({
      key: "containerCountRange",
      label: `Containers: ${filters.containerCountRange[0]}-${filters.containerCountRange[1]}`,
    })
  }

  if (activeFilters.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Active Filters</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => onRemoveFilter(filter.key, filter.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
