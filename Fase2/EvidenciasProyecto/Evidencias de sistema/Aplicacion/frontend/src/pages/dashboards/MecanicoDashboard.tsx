import { MainLayout } from '../../components/Layout/MainLayout'

export default function MecanicoDashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Órdenes de Trabajo</h2>
          <p className="text-gray-600">Gestión de trabajos asignados</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Pendientes"
            value="3"
            icon="⏳"
            color="yellow"
          />
          <StatCard
            title="En Progreso"
            value="2"
            icon="🔨"
            color="blue"
          />
          <StatCard
            title="Completadas Hoy"
            value="4"
            icon="✅"
            color="green"
          />
          <StatCard
            title="Total Mes"
            value="28"
            icon="📊"
            color="purple"
          />
        </div>

        {/* Órdenes en Progreso */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Trabajos en Progreso
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              2 activas
            </span>
          </div>
          <div className="space-y-4">
            <WorkOrderCard
              orderNumber="OT-2024-105"
              vehicle="ABCD-12"
              vehicleType="Camión Mercedes-Benz"
              workType="Cambio de aceite y filtros"
              priority="alta"
              progress={65}
              startTime="08:30"
              estimatedTime="4h"
            />
            <WorkOrderCard
              orderNumber="OT-2024-106"
              vehicle="EFGH-34"
              vehicleType="Camioneta Toyota Hilux"
              workType="Revisión de frenos"
              priority="media"
              progress={30}
              startTime="10:00"
              estimatedTime="3h"
            />
          </div>
        </div>

        {/* Órdenes Pendientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos Trabajos
          </h3>
          <div className="space-y-3">
            <PendingWorkOrder
              orderNumber="OT-2024-107"
              vehicle="IJKL-56"
              workType="Mantenimiento preventivo"
              priority="media"
            />
            <PendingWorkOrder
              orderNumber="OT-2024-108"
              vehicle="MNOP-78"
              workType="Reparación de motor"
              priority="crítica"
            />
            <PendingWorkOrder
              orderNumber="OT-2024-109"
              vehicle="QRST-90"
              workType="Cambio de batería"
              priority="baja"
            />
          </div>
        </div>

        {/* Solicitud de Repuestos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Repuestos Solicitados
            </h3>
            <div className="space-y-3">
              <SparePartRequest
                item="Filtro de aceite"
                status="pendiente"
                orderedFor="OT-2024-105"
              />
              <SparePartRequest
                item="Pastillas de freno"
                status="entregado"
                orderedFor="OT-2024-106"
              />
              <SparePartRequest
                item="Aceite motor 15W40"
                status="pendiente"
                orderedFor="OT-2024-105"
              />
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              + Solicitar Repuesto
            </button>
          </div>

          {/* Pausas/Observaciones */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <ActionButton
                icon="⏸️"
                label="Pausar Trabajo"
                description="Registrar pausa de trabajo"
              />
              <ActionButton
                icon="📸"
                label="Subir Foto"
                description="Documentar progreso"
              />
              <ActionButton
                icon="✅"
                label="Completar Orden"
                description="Finalizar trabajo actual"
              />
              <ActionButton
                icon="📝"
                label="Agregar Observación"
                description="Registrar notas"
              />
            </div>
          </div>
        </div>

        {/* Historial Reciente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trabajos Completados Recientemente
          </h3>
          <div className="space-y-2">
            <CompletedWork
              orderNumber="OT-2024-104"
              vehicle="UVWX-12"
              completedAt="Hoy 11:30"
              duration="3.5h"
            />
            <CompletedWork
              orderNumber="OT-2024-103"
              vehicle="YZAB-34"
              completedAt="Hoy 09:15"
              duration="4h"
            />
            <CompletedWork
              orderNumber="OT-2024-102"
              vehicle="CDEF-56"
              completedAt="Ayer 16:00"
              duration="5h"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function StatCard({ title, value, icon, color }: any) {
  const colors: Record<string, string> = {
    yellow: 'bg-yellow-50 text-yellow-600',
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
        <div className={`text-4xl ${colors[color]} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  )
}

function WorkOrderCard({
  orderNumber,
  vehicle,
  vehicleType,
  workType,
  priority,
  progress,
  startTime,
  estimatedTime,
}: any) {
  const priorityColors: Record<string, string> = {
    crítica: 'bg-red-100 text-red-800',
    alta: 'bg-orange-100 text-orange-800',
    media: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-lg text-gray-900">{orderNumber}</p>
          <p className="text-gray-700 font-medium">{vehicle} - {vehicleType}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>

      <p className="text-gray-800 mb-3">{workType}</p>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>Progreso</span>
          <span className="font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>⏰ Inicio: {startTime}</span>
        <span>⏱️ Estimado: {estimatedTime}</span>
      </div>

      <div className="flex space-x-2 mt-4">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
          Continuar
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm">
          Pausar
        </button>
      </div>
    </div>
  )
}

function PendingWorkOrder({ orderNumber, vehicle, workType, priority }: any) {
  const priorityColors: Record<string, string> = {
    crítica: 'bg-red-100 text-red-800',
    alta: 'bg-orange-100 text-orange-800',
    media: 'bg-yellow-100 text-yellow-800',
    baja: 'bg-green-100 text-green-800',
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{orderNumber}</p>
        <p className="text-sm text-gray-600">{vehicle} - {workType}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
        {priority}
      </span>
    </div>
  )
}

function SparePartRequest({ item, status, orderedFor }: any) {
  const statusConfig: Record<string, any> = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    entregado: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900">{item}</p>
        <p className="text-xs text-gray-500">Para: {orderedFor}</p>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  )
}

function ActionButton({ icon, label, description }: any) {
  return (
    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-left">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </button>
  )
}

function CompletedWork({ orderNumber, vehicle, completedAt, duration }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-medium text-gray-900">{orderNumber} - {vehicle}</p>
          <p className="text-xs text-gray-500">Completado: {completedAt}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-600">{duration}</span>
    </div>
  )
}


