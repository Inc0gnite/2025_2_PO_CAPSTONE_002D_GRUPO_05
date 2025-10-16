import { MainLayout } from '../../components/Layout/MainLayout'

export default function JefeTallerDashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supervisión del Taller</h2>
          <p className="text-gray-600">Monitoreo y control de operaciones</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Órdenes Activas"
            value="18"
            change="+3"
            icon="🔨"
            color="blue"
          />
          <StatCard
            title="Mecánicos Trabajando"
            value="12/15"
            change="80%"
            icon="👷"
            color="green"
          />
          <StatCard
            title="Completadas Hoy"
            value="7"
            change="+2"
            icon="✅"
            color="purple"
          />
          <StatCard
            title="Eficiencia Global"
            value="92%"
            change="+5%"
            icon="📈"
            color="yellow"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estado de Órdenes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estado de Órdenes de Trabajo
            </h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <OrderStatusCount status="Pendiente" count={5} color="yellow" />
              <OrderStatusCount status="En Progreso" count={10} color="blue" />
              <OrderStatusCount status="Pausado" count={3} color="orange" />
              <OrderStatusCount status="Completado" count={7} color="green" />
            </div>

            <div className="space-y-3">
              <OrderProgress
                orderNumber="OT-2024-105"
                vehicle="ABCD-12"
                mechanic="Carlos Silva"
                progress={75}
                priority="crítica"
              />
              <OrderProgress
                orderNumber="OT-2024-106"
                vehicle="EFGH-34"
                mechanic="Ana Martínez"
                progress={45}
                priority="alta"
              />
              <OrderProgress
                orderNumber="OT-2024-107"
                vehicle="IJKL-56"
                mechanic="Pedro López"
                progress={20}
                priority="media"
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
                efficiency={95}
                tasksCompleted={12}
                tasksActive={2}
              />
              <MechanicPerformance
                name="Ana Martínez"
                efficiency={92}
                tasksCompleted={10}
                tasksActive={3}
              />
              <MechanicPerformance
                name="Pedro López"
                efficiency={88}
                tasksCompleted={8}
                tasksActive={2}
              />
              <MechanicPerformance
                name="Juan Ramírez"
                efficiency={85}
                tasksCompleted={7}
                tasksActive={1}
              />
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
              Ver equipo completo →
            </button>
          </div>
        </div>

        {/* Alertas y Problemas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Alertas e Incidencias
              </h3>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                4 alertas
              </span>
            </div>
            <div className="space-y-3">
              <Alert
                type="crítico"
                message="Orden OT-2024-105 excede tiempo estimado en 2 horas"
                time="Hace 15 min"
              />
              <Alert
                type="advertencia"
                message="Stock bajo: Filtro de aceite (3 unidades)"
                time="Hace 1 hora"
              />
              <Alert
                type="info"
                message="Mecánico Carlos Silva próximo a terminar turno"
                time="Hace 2 horas"
              />
              <Alert
                type="advertencia"
                message="Orden OT-2024-108 pausada por falta de repuestos"
                time="Hace 3 horas"
              />
            </div>
          </div>

          {/* Recursos del Taller */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estado de Recursos
            </h3>
            <div className="space-y-4">
              <ResourceStatus
                name="Capacidad del Taller"
                current={15}
                max={20}
                unit="vehículos"
              />
              <ResourceStatus
                name="Mecánicos Disponibles"
                current={3}
                max={15}
                unit="personas"
              />
              <ResourceStatus
                name="Repuestos Críticos"
                current={8}
                max={12}
                unit="items"
              />
              <ResourceStatus
                name="Herramientas en Uso"
                current={18}
                max={25}
                unit="equipos"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas Semanales */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rendimiento Semanal
          </h3>
          <div className="grid grid-cols-7 gap-2">
            <DayPerformance day="Lun" completed={8} total={10} />
            <DayPerformance day="Mar" completed={9} total={11} />
            <DayPerformance day="Mié" completed={7} total={9} />
            <DayPerformance day="Jue" completed={10} total={12} />
            <DayPerformance day="Vie" completed={11} total={13} />
            <DayPerformance day="Sáb" completed={5} total={6} />
            <DayPerformance day="Dom" completed={0} total={0} />
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction icon="➕" label="Nueva Orden" />
            <QuickAction icon="👷" label="Asignar Mecánico" />
            <QuickAction icon="📊" label="Generar Reporte" />
            <QuickAction icon="🔧" label="Solicitar Repuestos" />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function StatCard({ title, value, change, icon, color }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{change}</p>
        </div>
        <div className={`text-4xl ${colors[color]} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  )
}

function OrderStatusCount({ status, count, color }: any) {
  const colors: Record<string, string> = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    green: 'bg-green-100 text-green-800 border-green-200',
  }

  return (
    <div className={`border-2 ${colors[color]} rounded-lg p-4 text-center`}>
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm font-medium mt-1">{status}</p>
    </div>
  )
}

function OrderProgress({ orderNumber, vehicle, mechanic, progress, priority }: any) {
  const priorityColors: Record<string, string> = {
    crítica: 'bg-red-100 text-red-800',
    alta: 'bg-orange-100 text-orange-800',
    media: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className="font-medium text-gray-900">{orderNumber} - {vehicle}</p>
          <p className="text-sm text-gray-600">Mecánico: {mechanic}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
    </div>
  )
}

function MechanicPerformance({ name, efficiency, tasksCompleted, tasksActive }: any) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-gray-900">{name}</p>
        <span className="text-sm font-bold text-blue-600">{efficiency}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div
          className="bg-blue-600 h-1.5 rounded-full"
          style={{ width: `${efficiency}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>✅ {tasksCompleted}</span>
        <span>🔨 {tasksActive} activas</span>
      </div>
    </div>
  )
}

function Alert({ type, message, time }: any) {
  const typeConfig: Record<string, any> = {
    crítico: { icon: '🔴', color: 'bg-red-50 border-red-200' },
    advertencia: { icon: '⚠️', color: 'bg-yellow-50 border-yellow-200' },
    info: { icon: 'ℹ️', color: 'bg-blue-50 border-blue-200' },
  }

  const config = typeConfig[type]

  return (
    <div className={`p-3 border rounded-lg ${config.color}`}>
      <div className="flex items-start space-x-2">
        <span className="text-xl">{config.icon}</span>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{message}</p>
          <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  )
}

function ResourceStatus({ name, current, max, unit }: any) {
  const percentage = (current / max) * 100

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-gray-700">{name}</p>
        <p className="text-sm text-gray-600">
          {current}/{max} {unit}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

function DayPerformance({ day, completed, total }: any) {
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="text-center">
      <p className="text-xs font-medium text-gray-600 mb-1">{day}</p>
      <div className="h-24 bg-gray-200 rounded relative">
        <div
          className="bg-blue-600 rounded absolute bottom-0 left-0 right-0"
          style={{ height: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {completed}/{total}
      </p>
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


