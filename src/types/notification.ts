export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    category: 'system' | 'security' | 'container' | 'server'
    timestamp: string
    read: boolean
    actions?: NotificationAction[]
    metadata?: Record<string, any>
}

export interface NotificationAction {
    label: string
    action: string
    style?: 'primary' | 'secondary' | 'destructive'
}

export interface WebSocketMessage {
    type: 'notification' | 'server_update' | 'container_event' | 'system_alert'
    payload: any
    timestamp: string
}