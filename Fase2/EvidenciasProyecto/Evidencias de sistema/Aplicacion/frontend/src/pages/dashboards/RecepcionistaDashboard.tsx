import { MainLayout } from '../../components/Layout/MainLayout'

export default function RecepcionistaDashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Ingresos y Órdenes</h2>
          <p className="text-gray-600">Recepción y coordinación de trabajos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Ingresos Hoy"
            value="8"
            icon="📝"
            color="blue"
          />
          <StatCard
            title="Órdenes Creadas"
            value="12"
            icon="🔨"
            color="green"
          />
          <StatCard
            title="En Espera"
            value="5"
            icon="⏳"
            color="yellow"
          />
          <StatCard
            title="Listas para Salida"
            value="3"
            icon="✅"
            color="purple"
          />
        </div>

        {/* Acciones Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg p-8 text-center transition transform hover:scale-105">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">Registrar Ingreso</h3>
            <p className="text-blue-100">Nuevo vehículo al taller</p>
          </button>

          <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg p-8 text-center transition transform hover:scale-105">
            <div className="text-6xl mb-4">🔨</div>
            <h3 className="text-2xl font-bold mb-2">Crear Orden de Trabajo</h3>
            <p className="text-green-100">Asignar trabajo a mecánico</p>
          </button>
        </div>

        {/* Vehículos Pendientes de Orden */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Vehículos Sin Orden Asignada
            </h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              5 pendientes
            </span>
          </div>
          <div className="space-y-3">
            <PendingVehicle
              entryCode="ING-2024-001"
              plate="WXYZ-99"
              driver="Roberto González"
              entryTime="12:30"
              issue="Revisión general"
            />
            <PendingVehicle
              entryCode="ING-2024-002"
              plate="ABCD-11"
              driver="Carmen López"
              entryTime="11:45"
              issue="Cambio de aceite"
            />
            <PendingVehicle
              entryCode="ING-2024-003"
              plate="EFGH-22"
              driver="Diego Soto"
              entryTime="10:15"
              issue="Problema en frenos"
            />
          </div>
        </div>

        {/* Grid de Información */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Órdenes Activas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Órdenes en Proceso
            </h3>
            <div className="space-y-3">
              <ActiveOrder
                orderNumber="OT-2024-105"
                vehicle="IJKL-56"
                mechanic="Carlos Silva"
                status="en_progreso"
                progress={65}
              />
              <ActiveOrder
                orderNumber="OT-2024-106"
                vehicle="MNOP-78"
                mechanic="Ana Martínez"
                status="en_progreso"
                progress={45}
              />
              <ActiveOrder
                orderNumber="OT-2024-107"
                vehicle="QRST-90"
                mechanic="Pedro López"
                status="pausado"
                progress={30}
              />
            </div>
          </div>

          {/* Próximas Salidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vehículos Listos para Salida
            </h3>
            <div className="space-y-3">
              <ReadyVehicle
                plate="UVWX-12"
                driver="Juan Ramírez"
                phone="+56912345678"
                completedAt="11:30"
              />
              <ReadyVehicle
                plate="YZAB-34"
                driver="María Torres"
                phone="+56987654321"
                completedAt="10:15"
              />
              <ReadyVehicle
                plate="CDEF-56"
                driver="Pedro Campos"
                phone="+56955555555"
                completedAt="09:00"
              />
            </div>
          </div>
        </div>

        {/* Mecánicos Disponibles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mecánicos Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MechanicCard
              name="Carlos Silva"
              status="ocupado"
              currentTask="2 órdenes"
            />
            <MechanicCard
              name="Ana Martínez"
              status="disponible"
              currentTask="Libre"
            />
            <MechanicCard
              name="Pedro López"
              status="ocupado"
              currentTask="1 orden"
            />
          </div>
        </div>

        {/* Búsqueda Rápida */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Búsqueda de Vehículo
          </h3>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Buscar por patente, código de ingreso o conductor..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              🔍 Buscar
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function StatCard({ title, value, icon, color }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`text-5xl ${colors[color]} p-4 rounded-lg`}>{icon}</div>
      </div>
    </div>
  )
}

function PendingVehicle({ entryCode, plate, driver, entryTime, issue }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <p className="font-bold text-gray-900">{plate}</p>
          <span className="text-xs text-gray-500">{entryCode}</span>
        </div>
        <p className="text-sm text-gray-700">Conductor: {driver}</p>
        <p className="text-sm text-gray-600">Motivo: {issue}</p>
        <p className="text-xs text-gray-500">Ingreso: {entryTime}</p>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
        Crear Orden
      </button>
    </div>
  )
}

function ActiveOrder({ orderNumber, vehicle, mechanic, status, progress }: any) {
  const statusConfig: Record<string, any> = {
    en_progreso: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
    pausado: { label: 'Pausado', color: 'bg-orange-100 text-orange-800' },
  }

  const config = statusConfig[status]

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-medium text-gray-900">{orderNumber}</p>
          <p className="text-sm text-gray-600">{vehicle} - {mechanic}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600">{progress}%</span>
      </div>
    </div>
  )
}

function ReadyVehicle({ plate, driver, phone, completedAt }: any) {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-lg">{plate}</p>
          <p className="text-sm text-gray-700">Conductor: {driver}</p>
          <p className="text-sm text-gray-600">📞 {phone}</p>
          <p className="text-xs text-gray-500">Completado: {completedAt}</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
          Registrar Salida
        </button>
      </div>
    </div>
  )
}

function MechanicCard({ name, status, currentTask }: any) {
  const statusConfig: Record<string, any> = {
    disponible: { icon: '✅', color: 'bg-green-100 border-green-300', text: 'text-green-800' },
    ocupado: { icon: '🔨', color: 'bg-blue-100 border-blue-300', text: 'text-blue-800' },
  }

  const config = statusConfig[status]

  return (
    <div className={`p-4 border-2 ${config.color} rounded-lg`}>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-2xl">{config.icon}</span>
        <p className={`font-medium ${config.text}`}>{name}</p>
      </div>
      <p className="text-sm text-gray-600">{currentTask}</p>
    </div>
  )
}


