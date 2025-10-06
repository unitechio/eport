export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: Role[]
  permissions: string[]
  avatar?: string
  lastLogin?: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string
}

export interface LoginCredentials {
  // username: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}