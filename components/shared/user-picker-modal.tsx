"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, X, Check } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  department: string
}

interface UserPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (users: User[]) => void
  selectedUsers: User[]
  multiSelect?: boolean
  title?: string
}

const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", department: "IT" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Manager", department: "Operations" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "Engineer", department: "DevOps" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "Lead", department: "Security" },
  { id: "5", name: "Charlie Davis", email: "charlie@example.com", role: "Engineer", department: "Infrastructure" },
]

export function UserPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedUsers,
  multiSelect = true,
  title = "Select Users for Approval",
}: UserPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tempSelected, setTempSelected] = useState<User[]>(selectedUsers)

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleUser = (user: User) => {
    if (multiSelect) {
      setTempSelected((prev) =>
        prev.find((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
      )
    } else {
      setTempSelected([user])
    }
  }

  const handleConfirm = () => {
    onSelect(tempSelected)
    onClose()
  }

  const isSelected = (userId: string) => tempSelected.find((u) => u.id === userId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {tempSelected.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
              {tempSelected.map((user) => (
                <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                  {user.name}
                  <button onClick={() => handleToggleUser(user)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="max-h-[400px] overflow-auto space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleToggleUser(user)}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                  isSelected(user.id)
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                }`}
              >
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{user.role}</Badge>
                  <div className="text-xs text-muted-foreground mt-1">{user.department}</div>
                </div>
                {isSelected(user.id) && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={tempSelected.length === 0}>
            Select {tempSelected.length > 0 && `(${tempSelected.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
