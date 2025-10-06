export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="relative w-24 h-24">
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-loading-primary rounded-full animate-pulse-glow" />

          {/* Orbiting dots */}
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-loading-secondary rounded-full animate-orbit"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-loading-accent rounded-full animate-orbit"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-loading-primary rounded-full animate-orbit"
            style={{ animationDelay: "2s" }}
          />

          {/* Outer ring */}
          <div
            className="absolute inset-0 border-2 border-loading-primary/20 rounded-full animate-spin"
            style={{ animationDuration: "4s" }}
          />
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-foreground animate-float">Loading</h2>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-loading-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div
              className="w-2 h-2 bg-loading-secondary rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-loading-accent rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>

        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-loading-primary via-loading-secondary to-loading-accent animate-shimmer rounded-full" />
        </div>

        <p className="text-sm text-muted-foreground animate-pulse">Preparing your experience...</p>
      </div>

      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-loading-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-loading-accent/10 rounded-full blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />
    </div>
  )
}
