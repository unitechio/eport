import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PermissionGuardProps {
  permission: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({ 
  permission, 
  fallback,
  children 
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  // if (!hasPermission(permission)) {
  //   return fallback || (
  //     <Card className="border-red-200">
  //       <CardContent className="p-6 text-center">
  //         <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
  //         <h3 className="text-lg font-semibold text-red-700 mb-2">
  //           Access Denied
  //         </h3>
  //         <p className="text-red-600">
  //           You don't have permission to access this resource.
  //         </p>
  //       </CardContent>
  //     </Card>
  //   )
  // }

  return <>{children}</>
}