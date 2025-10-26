import { MainLayout } from '../../components/Layout/MainLayout'

export default function GuardiaDashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Control de Ingreso Vehicular</h2>
          <p className="text-gray-600">Gestión de entradas y salidas de vehículos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Vehículos en Taller"
            value="23"
            icon="🏭"
            color="blue"
          />
          <StatCard
            title="Ingresos Hoy"
            value="8"
            icon="📝"
            color="green"
          />
          <StatCard
            title="Salidas Hoy"
            value="5"
            icon="✅"
            color="purple"
          />
        </div>

        {/* Acción Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg p-8 text-center transition transform hover:scale-105">
            <div className="text-6xl mb-4">🚗 ➡️</div>
            <h3 className="text-2xl font-bold mb-2">Registrar Ingreso</h3>
            <p className="text-blue-100">Nuevo vehículo ingresando al taller</p>
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg p-8 text-center transition transform hover:scale-105">
            <div className="text-6xl mb-4">✅ 🚗</div>
            <h3 className="text-2xl font-bold mb-2">Registrar Salida</h3>
            <p className="text-green-100">Vehículo saliendo del taller</p>
          </button>
        </div>

        {/* Vehículos Actualmente en Taller */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vehículos en Taller Actualmente
          </h3>
          <div className="space-y-3">
            <VehicleInWorkshop
              plate="ABCD-12"
              driver="Juan Pérez"
              entryTime="08:30"
              status="en_trabajo"
            />
            <VehicleInWorkshop
              plate="EFGH-34"
              driver="María González"
              entryTime="09:15"
              status="esperando"
            />
            <VehicleInWorkshop
              plate="IJKL-56"
              driver="Pedro López"
              entryTime="10:00"
              status="en_trabajo"
            />
            <VehicleInWorkshop
              plate="MNOP-78"
              driver="Ana Martínez"
              entryTime="11:30"
              status="completado"
            />
          </div>
        </div>

        {/* Actividad del Día */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad de Hoy
          </h3>
          <div className="space-y-3">
            <ActivityLog
              time="12:30"
              action="Ingreso"
              vehicle="QRST-90"
              driver="Roberto Silva"
            />
            <ActivityLog
              time="11:45"
              action="Salida"
              vehicle="UVWX-12"
              driver="Carolina Ruiz"
            />
            <ActivityLog
              time="10:15"
              action="Ingreso"
              vehicle="YZAB-34"
              driver="Diego Torres"
            />
            <ActivityLog
              time="09:30"
              action="Salida"
              vehicle="CDEF-56"
              driver="Lucía Campos"
            />
          </div>
        </div>

        {/* Búsqueda Rápida */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Búsqueda Rápida de Vehículo
          </h3>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Ingresa patente (ej: ABCD12)"
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

function VehicleInWorkshop({ plate, driver, entryTime, status }: any) {
  const statusConfig: Record<string, any> = {
    en_trabajo: { label: 'En Trabajo', color: 'bg-blue-100 text-blue-800' },
    esperando: { label: 'Esperando', color: 'bg-yellow-100 text-yellow-800' },
    completado: { label: 'Listo', color: 'bg-green-100 text-green-800' },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">🚗</span>
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{plate}</p>
          <p className="text-sm text-gray-600">Conductor: {driver}</p>
          <p className="text-xs text-gray-500">Ingreso: {entryTime}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  )
}

function ActivityLog({ time, action, vehicle, driver }: any) {
  const actionConfig: Record<string, any> = {
    Ingreso: { icon: '➡️', color: 'text-blue-600' },
    Salida: { icon: '✅', color: 'text-green-600' },
  }

  const config = actionConfig[action]

  return (
    <div className="flex items-center space-x-4 p-3 border-l-4 border-gray-200">
      <span className={`text-2xl ${config.color}`}>{config.icon}</span>
      <div className="flex-1">
        <p className="font-medium text-gray-900">
          {action}: {vehicle}
        </p>
        <p className="text-sm text-gray-600">Conductor: {driver}</p>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  )
}


