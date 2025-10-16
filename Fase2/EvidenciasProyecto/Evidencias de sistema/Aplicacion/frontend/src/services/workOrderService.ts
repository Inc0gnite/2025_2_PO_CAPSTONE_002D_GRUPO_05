import api from './api'
import type { WorkOrder, WorkOrderFilters } from '../../../shared/types'

export const workOrderService = {
  /**
   * Obtener todas las órdenes con filtros
   */
  async getAll(filters?: WorkOrderFilters) {
    const response = await api.get('/work-orders', { params: filters })
    return response.data
  },

  /**
   * Obtener orden por ID
   */
  async getById(id: string): Promise<WorkOrder> {
    const response = await api.get(`/work-orders/${id}`)
    return response.data.data
  },

  /**
   * Crear orden de trabajo
   */
  async create(data: {
    vehicleId: string
    entryId: string
    workshopId: string
    workType: string
    priority?: string
    description: string
    estimatedHours?: number
    assignedToId?: string
  }): Promise<WorkOrder> {
    const response = await api.post('/work-orders', data)
    return response.data.data
  },

  /**
   * Actualizar orden
   */
  async update(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    const response = await api.put(`/work-orders/${id}`, data)
    return response.data.data
  },

  /**
   * Cambiar estado de la orden
   */
  async changeStatus(id: string, status: string, observations?: string) {
    const response = await api.post(`/work-orders/${id}/status`, {
      status,
      observations,
    })
    return response.data.data
  },

  /**
   * Pausar orden
   */
  async pause(id: string, reason: string, observations?: string) {
    const response = await api.post(`/work-orders/${id}/pause`, {
      reason,
      observations,
    })
    return response.data.data
  },

  /**
   * Reanudar orden
   */
  async resume(id: string) {
    const response = await api.post(`/work-orders/${id}/resume`)
    return response.data.data
  },

  /**
   * Agregar foto
   */
  async addPhoto(id: string, url: string, description?: string, photoType?: string) {
    const response = await api.post(`/work-orders/${id}/photos`, {
      url,
      description,
      photoType,
    })
    return response.data.data
  },

  /**
   * Obtener estadísticas
   */
  async getStats(workshopId?: string) {
    const params = workshopId ? { workshopId } : {}
    const response = await api.get('/work-orders/stats', { params })
    return response.data.data
  },
}


