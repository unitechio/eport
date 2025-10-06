export const PERMISSIONS = {
    // Server permissions
    SERVERS_VIEW: 'servers:view',
    SERVERS_CREATE: 'servers:create',
    SERVERS_UPDATE: 'servers:update',
    SERVERS_DELETE: 'servers:delete',
    SERVERS_RESTART: 'servers:restart',

    // Container permissions
    CONTAINERS_VIEW: 'containers:view',
    CONTAINERS_MANAGE: 'containers:manage',
    CONTAINERS_DEPLOY: 'containers:deploy',

    // Config permissions
    CONFIG_VIEW: 'config:view',
    CONFIG_EDIT: 'config:edit',
    CONFIG_DEPLOY: 'config:deploy',

    // Monitoring permissions
    MONITORING_VIEW: 'monitoring:view',
    MONITORING_ALERTS: 'monitoring:alerts',

    // Admin permissions
    USERS_MANAGE: 'users:manage',
    ROLES_MANAGE: 'roles:manage',
    SYSTEM_ADMIN: 'system:admin'
} as const

export const ROLES = {
    ADMIN: 'admin',
    OPERATOR: 'operator',
    VIEWER: 'viewer',
    DEVELOPER: 'developer'
} as const

export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS),
    [ROLES.OPERATOR]: [
        PERMISSIONS.SERVERS_VIEW,
        PERMISSIONS.SERVERS_UPDATE,
        PERMISSIONS.SERVERS_RESTART,
        PERMISSIONS.CONTAINERS_VIEW,
        PERMISSIONS.CONTAINERS_MANAGE,
        PERMISSIONS.CONFIG_VIEW,
        PERMISSIONS.CONFIG_EDIT,
        PERMISSIONS.MONITORING_VIEW,
        PERMISSIONS.MONITORING_ALERTS
    ],
    [ROLES.DEVELOPER]: [
        PERMISSIONS.SERVERS_VIEW,
        PERMISSIONS.CONTAINERS_VIEW,
        PERMISSIONS.CONTAINERS_DEPLOY,
        PERMISSIONS.CONFIG_VIEW,
        PERMISSIONS.CONFIG_DEPLOY,
        PERMISSIONS.MONITORING_VIEW
    ],
    [ROLES.VIEWER]: [
        PERMISSIONS.SERVERS_VIEW,
        PERMISSIONS.CONTAINERS_VIEW,
        PERMISSIONS.CONFIG_VIEW,
        PERMISSIONS.MONITORING_VIEW
    ]
}