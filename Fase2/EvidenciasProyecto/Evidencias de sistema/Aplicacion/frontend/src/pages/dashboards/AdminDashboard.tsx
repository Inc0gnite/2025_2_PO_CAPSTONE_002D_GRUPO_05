import { MainLayout } from '../../components/Layout/MainLayout'

export default function AdminDashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Administrador</h2>
          <p className="text-gray-600">Vista general del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Vehículos"
            value="124"
            change="+12%"
            icon="🚗"
            color="blue"
          />
          <StatCard
            title="Órdenes Activas"
            value="18"
            change="+5%"
            icon="🔨"
            color="yellow"
          />
          <StatCard
            title="En Taller"
            value="23"
            change="-3%"
            icon="🏭"
            color="green"
          />
          <StatCard
            title="Completadas Hoy"
            value="7"
            change="+2"
            icon="✅"
            color="purple"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Órdenes Urgentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Órdenes Urgentes</h3>
              <span className="text-sm text-red-600 font-medium">3 críticas</span>
            </div>
            <div className="space-y-3">
              <OrderItem
                orderNumber="OT-2024-001"
                vehicle="ABCD-12"
                priority="crítica"
                mechanic="Carlos Silva"
              />
              <OrderItem
                orderNumber="OT-2024-002"
                vehicle="EFGH-34"
                priority="alta"
                mechanic="Ana Martínez"
              />
              <OrderItem
                orderNumber="OT-2024-003"
                vehicle="IJKL-56"
                priority="alta"
                mechanic="Pedro López"
              />
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
              Ver todas las órdenes →
            </button>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              <ActivityItem
                icon="📝"
                title="Nuevo ingreso"
                description="Vehículo MNOP-78 ingresado"
                time="Hace 5 min"
              />
              <ActivityItem
                icon="✅"
                title="Orden completada"
                description="OT-2024-005 finalizada"
                time="Hace 15 min"
              />
              <ActivityItem
                icon="👤"
                title="Nuevo usuario"
                description="Roberto García agregado"
                time="Hace 1 hora"
              />
              <ActivityItem
                icon="🔧"
                title="Stock bajo"
                description="Filtro de aceite bajo stock"
                time="Hace 2 horas"
              />
            </div>
          </div>

          {/* Rendimiento de Mecánicos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rendimiento del Equipo
            </h3>
            <div className="space-y-4">
              <MechanicPerformance
                name="Carlos Silva"
                completed={12}
                inProgress={3}
                efficiency={95}
              />
              <MechanicPerformance
                name="Ana Martínez"
                completed={10}
                inProgress={2}
                efficiency={92}
              />
              <MechanicPerformance
                name="Pedro López"
                completed={8}
                inProgress={4}
                efficiency={88}
              />
            </div>
          </div>

          {/* Stock Bajo */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock</h3>
              <span className="text-sm text-orange-600 font-medium">5 items</span>
            </div>
            <div className="space-y-3">
              <StockAlert item="Filtro de Aceite" current={3} min={10} />
              <StockAlert item="Pastillas de Freno" current={5} min={8} />
              <StockAlert item="Aceite Motor 15W40" current={45} min={50} />
              <StockAlert item="Batería 12V" current={2} min={5} />
              <StockAlert item="Neumático 295/80R22.5" current={3} min={8} />
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
              Ver inventario completo →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction icon="➕" label="Nuevo Usuario" />
            <QuickAction icon="🚗" label="Registrar Vehículo" />
            <QuickAction icon="📝" label="Nuevo Ingreso" />
            <QuickAction icon="📊" label="Ver Reportes" />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// Componentes auxiliares
function StatCard({ title, value, change, icon, color }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{change} vs mes anterior</p>
        </div>
        <div className={`text-4xl ${colors[color]} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  )
}

function OrderItem({ orderNumber, vehicle, priority, mechanic }: any) {
  const priorityColors: Record<string, string> = {
    crítica: 'bg-red-100 text-red-800',
    alta: 'bg-orange-100 text-orange-800',
    media: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{orderNumber}</p>
        <p className="text-sm text-gray-600">Vehículo: {vehicle}</p>
        <p className="text-xs text-gray-500">Mecánico: {mechanic}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[priority]}`}>
        {priority}
      </span>
    </div>
  )
}

function ActivityItem({ icon, title, description, time }: any) {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

function MechanicPerformance({ name, completed, inProgress, efficiency }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-sm font-bold text-blue-600">{efficiency}%</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${efficiency}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <p className="text-xs text-gray-500">✅ {completed} completadas</p>
        <p className="text-xs text-gray-500">🔨 {inProgress} en progreso</p>
      </div>
    </div>
  )
}

function StockAlert({ item, current, min }: any) {
  const percentage = (current / min) * 100
  const isLow = percentage < 50

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{item}</p>
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-orange-500'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600">
            {current}/{min}
          </span>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  )
}


