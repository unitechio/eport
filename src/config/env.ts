const env = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
    websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080/ws",
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    enableDevLogs: process.env.NODE_ENV === "development",
    tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes before expiry
    requestTimeout: 30000, // 30 seconds
}

export default env
