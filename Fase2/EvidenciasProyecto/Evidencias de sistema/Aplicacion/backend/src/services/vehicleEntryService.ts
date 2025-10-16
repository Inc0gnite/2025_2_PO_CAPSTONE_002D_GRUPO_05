import prisma from '../config/database'
import { generateEntryCode } from '../utils/generators'

/**
 * Servicio de ingresos de vehículos
 */
export class VehicleEntryService {
  /**
   * Obtener todos los ingresos con filtros y paginación
   */
  async getAll(filters: {
    page?: number
    limit?: number
    search?: string
    workshopId?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }) {
    const { page = 1, limit = 10, search = '', workshopId, status, dateFrom, dateTo } = filters
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { entryCode: { contains: search, mode: 'insensitive' } },
        { driverName: { contains: search, mode: 'insensitive' } },
        { driverRut: { contains: search, mode: 'insensitive' } },
        { vehicle: { licensePlate: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (workshopId) where.workshopId = workshopId
    if (status) where.status = status
    if (dateFrom || dateTo) {
      where.entryDate = {}
      if (dateFrom) where.entryDate.gte = new Date(dateFrom)
      if (dateTo) where.entryDate.lte = new Date(dateTo)
    }

    const [entries, total] = await Promise.all([
      prisma.vehicleEntry.findMany({
        where,
        skip,
        take: limit,
        include: {
          vehicle: true,
          workshop: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          keyControl: true,
        },
        orderBy: { entryDate: 'desc' },
      }),
      prisma.vehicleEntry.count({ where }),
    ])

    return {
      entries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Obtener ingreso por ID
   */
  async getById(id: string) {
    const entry = await prisma.vehicleEntry.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            region: true,
          },
        },
        workshop: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        keyControl: true,
        workOrders: {
          include: {
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    if (!entry) {
      throw new Error('Ingreso no encontrado')
    }

    return entry
  }

  /**
   * Crear ingreso de vehículo
   */
  async create(data: {
    vehicleId: string
    workshopId: string
    driverRut: string
    driverName: string
    driverPhone?: string
    entryKm: number
    fuelLevel: string
    hasKeys: boolean
    observations?: string
    photos?: string[]
    createdById: string
    keyLocation?: string
  }) {
    const {
      vehicleId,
      workshopId,
      driverRut,
      driverName,
      driverPhone,
      entryKm,
      fuelLevel,
      hasKeys,
      observations,
      photos,
      createdById,
      keyLocation,
    } = data

    // Generar código único
    let entryCode = generateEntryCode()
    
    // Verificar que el código sea único
    let exists = await prisma.vehicleEntry.findUnique({ where: { entryCode } })
    while (exists) {
      entryCode = generateEntryCode()
      exists = await prisma.vehicleEntry.findUnique({ where: { entryCode } })
    }

    // Verificar que el vehículo existe
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } })
    if (!vehicle) {
      throw new Error('Vehículo no encontrado')
    }

    // Verificar que el taller existe
    const workshop = await prisma.workshop.findUnique({ where: { id: workshopId } })
    if (!workshop) {
      throw new Error('Taller no encontrado')
    }

    // Crear ingreso con transacción
    const entry = await prisma.$transaction(async (tx) => {
      // Crear el ingreso
      const newEntry = await tx.vehicleEntry.create({
        data: {
          entryCode,
          vehicleId,
          workshopId,
          driverRut,
          driverName,
          driverPhone,
          entryDate: new Date(),
          entryKm,
          fuelLevel,
          hasKeys,
          observations,
          photos: photos || [],
          createdById,
        },
        include: {
          vehicle: true,
          workshop: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })

      // Actualizar estado del vehículo
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'in_maintenance' },
      })

      // Crear control de llaves si tiene llaves
      if (hasKeys && keyLocation) {
        await tx.keyControl.create({
          data: {
            entryId: newEntry.id,
            keyLocation,
          },
        })
      }

      return newEntry
    })

    return this.getById(entry.id)
  }

  /**
   * Actualizar ingreso
   */
  async update(id: string, data: Partial<{
    driverRut: string
    driverName: string
    driverPhone: string
    entryKm: number
    exitKm: number
    fuelLevel: string
    observations: string
    photos: string[]
    status: string
  }>) {
    const entry = await prisma.vehicleEntry.findUnique({
      where: { id },
    })

    if (!entry) {
      throw new Error('Ingreso no encontrado')
    }

    const updatedEntry = await prisma.vehicleEntry.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        workshop: true,
        keyControl: true,
      },
    })

    return updatedEntry
  }

  /**
   * Registrar salida del vehículo
   */
  async registerExit(id: string, exitKm: number) {
    const entry = await prisma.vehicleEntry.findUnique({
      where: { id },
      include: { vehicle: true },
    })

    if (!entry) {
      throw new Error('Ingreso no encontrado')
    }

    if (entry.exitDate) {
      throw new Error('El vehículo ya tiene registrada una salida')
    }

    // Actualizar ingreso y vehículo en transacción
    await prisma.$transaction([
      prisma.vehicleEntry.update({
        where: { id },
        data: {
          exitDate: new Date(),
          exitKm,
          status: 'salida',
        },
      }),
      prisma.vehicle.update({
        where: { id: entry.vehicleId },
        data: { status: 'active' },
      }),
    ])

    return this.getById(id)
  }

  /**
   * Gestionar control de llaves
   */
  async updateKeyControl(
    entryId: string,
    data: {
      keyLocation?: string
      deliveredTo?: string
      deliveredAt?: Date
      returnedBy?: string
      returnedAt?: Date
      observations?: string
    }
  ) {
    const entry = await prisma.vehicleEntry.findUnique({
      where: { id: entryId },
      include: { keyControl: true },
    })

    if (!entry) {
      throw new Error('Ingreso no encontrado')
    }

    let keyControl

    if (entry.keyControl) {
      // Actualizar control existente
      keyControl = await prisma.keyControl.update({
        where: { entryId },
        data,
      })
    } else {
      // Crear nuevo control
      keyControl = await prisma.keyControl.create({
        data: {
          entryId,
          keyLocation: data.keyLocation || 'No especificado',
          ...data,
        },
      })
    }

    return keyControl
  }
}

export default new VehicleEntryService()


