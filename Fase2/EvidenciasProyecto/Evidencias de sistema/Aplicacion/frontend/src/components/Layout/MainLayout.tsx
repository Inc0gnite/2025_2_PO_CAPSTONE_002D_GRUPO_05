import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Navegación según rol
  const getNavItems = () => {
    const roleName = user?.role?.name || ''

    const commonItems = [
      { name: 'Inicio', href: '/dashboard', icon: '🏠' },
    ]

    const roleItems: Record<string, any[]> = {
      Administrador: [
        { name: 'Usuarios', href: '/users', icon: '👥' },
        { name: 'Vehículos', href: '/vehicles', icon: '🚗' },
        { name: 'Ingresos', href: '/entries', icon: '📝' },
        { name: 'Órdenes', href: '/work-orders', icon: '🔨' },
        { name: 'Inventario', href: '/inventory', icon: '🔧' },
        { name: 'Talleres', href: '/workshops', icon: '🏭' },
        { name: 'Reportes', href: '/reports', icon: '📊' },
      ],
      Guardia: [
        { name: 'Ingresos', href: '/entries', icon: '📝' },
        { name: 'Vehículos', href: '/vehicles', icon: '🚗' },
      ],
      Recepcionista: [
        { name: 'Ingresos', href: '/entries', icon: '📝' },
        { name: 'Órdenes', href: '/work-orders', icon: '🔨' },
        { name: 'Vehículos', href: '/vehicles', icon: '🚗' },
      ],
      Mecánico: [
        { name: 'Mis Órdenes', href: '/my-work-orders', icon: '🔨' },
        { name: 'Repuestos', href: '/spare-parts', icon: '🔧' },
      ],
      'Jefe de Taller': [
        { name: 'Órdenes', href: '/work-orders', icon: '🔨' },
        { name: 'Mecánicos', href: '/mechanics', icon: '👷' },
        { name: 'Inventario', href: '/inventory', icon: '🔧' },
        { name: 'Reportes', href: '/reports', icon: '📊' },
      ],
      'Encargado de Inventario': [
        { name: 'Inventario', href: '/inventory', icon: '🔧' },
        { name: 'Movimientos', href: '/movements', icon: '📦' },
        { name: 'Órdenes', href: '/work-orders', icon: '🔨' },
      ],
    }

    return [...commonItems, ...(roleItems[roleName] || [])]
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">PepsiCo Fleet</h1>
                <p className="text-xs text-gray-500">{user?.role?.name}</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Notificaciones</span>
                🔔
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Usuario */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}


