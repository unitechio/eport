export interface AuditLog {
    audit_log_id: string         // UUID
    method_call_type: string     // METHOD_CALL_TYPE  
    request_time: string         // ISO datetime string
    action_user_id: string       // UUID
    action_user_name: string     // ACTION_USER_NAME
    client_ip: string            // VARCHAR(45)
    request_uri: string          // REQUEST_URI
    action: string               // ACTION
    source_app_id: string        // CRM-WEB; CRM-APP
    duration_ms: number          // DURATION_MS
    status_code: number          // STATUS_CODE
    msg_request: string          // Base64 encoded blob
    msg_response: string         // Base64 encoded encrypted blob  
    trace_id: string             // TRACE_ID
}

export interface AuditLogFilters {
    startDate?: string
    endDate?: string
    userId?: string
    userName?: string
    action?: string
    sourceApp?: string
    statusCode?: number
    clientIP?: string
    traceId?: string
    page?: number
    limit?: number
    sortBy?: 'request_time' | 'duration_ms' | 'status_code'
    sortOrder?: 'asc' | 'desc'
}

export interface AuditLogResponse {
    data: AuditLog[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface AuditStatistics {
    totalRequests: number
    successRequests: number
    errorRequests: number
    averageDuration: number
    requestsByHour: { hour: string; count: number }[]
    requestsByAction: { action: string; count: number }[]
    requestsByUser: { user: string; count: number }[]
    requestsByStatusCode: { status: number; count: number }[]
}

export const METHOD_CALL_TYPES = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
} as const

export const SOURCE_APPS = {
    CRM_WEB: 'CRM-WEB',
    CRM_APP: 'CRM-APP',
    SERVER_MANAGER: 'SERVER-MANAGER',
    CONTAINER_MANAGER: 'CONTAINER-MANAGER'
} as const

export const AUDIT_ACTIONS = {
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT',
    SERVER_START: 'SERVER_START',
    SERVER_STOP: 'SERVER_STOP',
    SERVER_RESTART: 'SERVER_RESTART',
    CONTAINER_DEPLOY: 'CONTAINER_DEPLOY',
    CONTAINER_DELETE: 'CONTAINER_DELETE',
    CONFIG_UPDATE: 'CONFIG_UPDATE',
    CONFIG_DEPLOY: 'CONFIG_DEPLOY',
    PERMISSION_CHANGE: 'PERMISSION_CHANGE'
} as const