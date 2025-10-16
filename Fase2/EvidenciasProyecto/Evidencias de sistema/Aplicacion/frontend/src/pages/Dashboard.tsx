import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import AdminDashboard from './dashboards/AdminDashboard'
import GuardiaDashboard from './dashboards/GuardiaDashboard'
import RecepcionistaDashboard from './dashboards/RecepcionistaDashboard'
import MecanicoDashboard from './dashboards/MecanicoDashboard'
import JefeTallerDashboard from './dashboards/JefeTallerDashboard'
import InventarioDashboard from './dashboards/InventarioDashboard'

function Dashboard() {
  const { user, getCurrentUser, isLoading } = useAuthStore()

  useEffect(() => {
    if (!user) {
      getCurrentUser()
    }
  }, [user, getCurrentUser])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Error al cargar usuario</p>
          <p className="text-gray-600 mt-2">Por favor, inicia sesión nuevamente</p>
        </div>
      </div>
    )
  }

  // Renderizar dashboard según rol
  const roleName = user.role.name

  switch (roleName) {
    case 'Administrador':
      return <AdminDashboard />
    
    case 'Guardia':
      return <GuardiaDashboard />
    
    case 'Recepcionista':
      return <RecepcionistaDashboard />
    
    case 'Mecánico':
      return <MecanicoDashboard />
    
    case 'Jefe de Taller':
      return <JefeTallerDashboard />
    
    case 'Encargado de Inventario':
      return <InventarioDashboard />
    
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-xl font-bold text-gray-900">
              Rol no reconocido: {roleName}
            </p>
            <p className="text-gray-600 mt-2">
              Contacta al administrador del sistema
            </p>
          </div>
        </div>
      )
  }
}

export default Dashboard
