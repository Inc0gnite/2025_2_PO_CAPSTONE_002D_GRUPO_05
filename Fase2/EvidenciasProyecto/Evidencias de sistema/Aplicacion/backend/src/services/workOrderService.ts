import prisma from '../config/database'
import { generateWorkOrderNumber } from '../utils/generators'
import type { WorkOrderFilters } from '../../../shared/types'

/**
 * Servicio de órdenes de trabajo
 */
export class WorkOrderService {
  /**
   * Obtener todas las órdenes con filtros
   */
  async getAll(filters: WorkOrderFilters) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      priority,
      workshopId,
      assignedToId,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { vehicle: { licensePlate: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) where.currentStatus = status
    if (priority) where.priority = priority
    if (workshopId) where.workshopId = workshopId
    if (assignedToId) where.assignedToId = assignedToId
    
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    const [workOrders, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          vehicle: true,
          entry: true,
          workshop: true,
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              spareParts: true,
              photos: true,
              pauses: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.workOrder.count({ where }),
    ])

    return {
      workOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Obtener orden por ID
   */
  async getById(id: string) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: { region: true },
        },
        entry: true,
        workshop: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        statuses: {
          orderBy: { changedAt: 'desc' },
        },
        photos: true,
        spareParts: {
          include: {
            sparePart: true,
          },
        },
        pauses: {
          orderBy: { pausedAt: 'desc' },
        },
      },
    })

    if (!workOrder) {
      throw new Error('Orden de trabajo no encontrada')
    }

    return workOrder
  }

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
    createdById: string
  }) {
    const {
      vehicleId,
      entryId,
      workshopId,
      workType,
      priority = 'media',
      description,
      estimatedHours,
      assignedToId,
      createdById,
    } = data

    // Generar número único
    let orderNumber = generateWorkOrderNumber()
    let exists = await prisma.workOrder.findUnique({ where: { orderNumber } })
    while (exists) {
      orderNumber = generateWorkOrderNumber()
      exists = await prisma.workOrder.findUnique({ where: { orderNumber } })
    }

    // Crear orden en transacción
    const workOrder = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.workOrder.create({
        data: {
          orderNumber,
          vehicleId,
          entryId,
          workshopId,
          workType,
          priority,
          description,
          estimatedHours,
          assignedToId,
          createdById,
        },
      })

      // Crear primer registro de estado
      await tx.workOrderStatus.create({
        data: {
          workOrderId: newOrder.id,
          status: 'pendiente',
          observations: 'Orden creada',
          changedById: createdById,
        },
      })

      return newOrder
    })

    return this.getById(workOrder.id)
  }

  /**
   * Actualizar orden
   */
  async update(id: string, data: Partial<{
    workType: string
    priority: string
    description: string
    estimatedHours: number
    assignedToId: string
    observations: string
  }>) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
    })

    if (!workOrder) {
      throw new Error('Orden de trabajo no encontrada')
    }

    const updated = await prisma.workOrder.update({
      where: { id },
      data,
    })

    return this.getById(updated.id)
  }

  /**
   * Cambiar estado de la orden
   */
  async changeStatus(
    id: string,
    newStatus: string,
    observations: string,
    changedById: string
  ) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
    })

    if (!workOrder) {
      throw new Error('Orden de trabajo no encontrada')
    }

    // Actualizar en transacción
    await prisma.$transaction(async (tx) => {
      // Actualizar estado actual
      const updateData: any = { currentStatus: newStatus }
      
      if (newStatus === 'en_progreso' && !workOrder.startedAt) {
        updateData.startedAt = new Date()
      }
      
      if (newStatus === 'completado' && !workOrder.completedAt) {
        updateData.completedAt = new Date()
        
        // Calcular horas totales
        if (workOrder.startedAt) {
          const totalHours =
            (new Date().getTime() - workOrder.startedAt.getTime()) / (1000 * 60 * 60)
          updateData.totalHours = Math.round(totalHours * 100) / 100
        }
      }

      await tx.workOrder.update({
        where: { id },
        data: updateData,
      })

      // Crear registro de cambio de estado
      await tx.workOrderStatus.create({
        data: {
          workOrderId: id,
          status: newStatus,
          observations,
          changedById,
        },
      })
    })

    return this.getById(id)
  }

  /**
   * Pausar orden de trabajo
   */
  async pause(id: string, reason: string, observations?: string) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        pauses: {
          where: { resumedAt: null },
        },
      },
    })

    if (!workOrder) {
      throw new Error('Orden de trabajo no encontrada')
    }

    if (workOrder.pauses.length > 0) {
      throw new Error('La orden ya está pausada')
    }

    await prisma.$transaction([
      prisma.workPause.create({
        data: {
          workOrderId: id,
          reason,
          observations,
        },
      }),
      prisma.workOrder.update({
        where: { id },
        data: { currentStatus: 'pausado' },
      }),
    ])

    return this.getById(id)
  }

  /**
   * Reanudar orden de trabajo
   */
  async resume(id: string) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        pauses: {
          where: { resumedAt: null },
          orderBy: { pausedAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!workOrder) {
      throw new Error('Orden de trabajo no encontrada')
    }

    if (workOrder.pauses.length === 0) {
      throw new Error('La orden no está pausada')
    }

    const pause = workOrder.pauses[0]
    const now = new Date()
    const duration = Math.floor((now.getTime() - pause.pausedAt.getTime()) / 1000 / 60)

    await prisma.$transaction([
      prisma.workPause.update({
        where: { id: pause.id },
        data: {
          resumedAt: now,
          duration,
        },
      }),
      prisma.workOrder.update({
        where: { id },
        data: { currentStatus: 'en_progreso' },
      }),
    ])

    return this.getById(id)
  }

  /**
   * Agregar foto a la orden
   */
  async addPhoto(workOrderId: string, url: string, description?: string, photoType?: string) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
    })

    if (!workOrder) {
      throw new Error('Orden de trabajo no encontrada')
    }

    const photo = await prisma.workOrderPhoto.create({
      data: {
        workOrderId,
        url,
        description,
        photoType: photoType || 'general',
      },
    })

    return photo
  }

  /**
   * Obtener estadísticas de órdenes
   */
  async getStats(workshopId?: string) {
    const where = workshopId ? { workshopId } : {}

    const [total, pending, inProgress, paused, completed, cancelled, byPriority] =
      await Promise.all([
        prisma.workOrder.count({ where }),
        prisma.workOrder.count({ where: { ...where, currentStatus: 'pendiente' } }),
        prisma.workOrder.count({ where: { ...where, currentStatus: 'en_progreso' } }),
        prisma.workOrder.count({ where: { ...where, currentStatus: 'pausado' } }),
        prisma.workOrder.count({ where: { ...where, currentStatus: 'completado' } }),
        prisma.workOrder.count({ where: { ...where, currentStatus: 'cancelado' } }),
        prisma.workOrder.groupBy({
          by: ['priority'],
          where,
          _count: true,
        }),
      ])

    return {
      total,
      pending,
      inProgress,
      paused,
      completed,
      cancelled,
      byPriority,
    }
  }
}

export default new WorkOrderService()


