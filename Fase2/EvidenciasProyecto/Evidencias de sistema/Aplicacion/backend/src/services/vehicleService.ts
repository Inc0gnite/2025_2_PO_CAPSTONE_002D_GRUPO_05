import prisma from '../config/database'
import { validateLicensePlate } from '../utils/validation'
import type { VehicleFilters } from '../../../shared/types'

/**
 * Servicio de vehículos
 */
export class VehicleService {
  /**
   * Obtener todos los vehículos con filtros y paginación
   */
  async getAll(filters: VehicleFilters) {
    const {
      page = 1,
      limit = 10,
      search = '',
      vehicleType,
      regionId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters

    const skip = (page - 1) * limit

    // Construir where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { licensePlate: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { fleetNumber: { contains: search, mode: 'insensitive' } },
        { vin: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (vehicleType) where.vehicleType = vehicleType
    if (regionId) where.regionId = regionId
    if (status) where.status = status

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        include: {
          region: true,
          _count: {
            select: {
              entries: true,
              workOrders: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.vehicle.count({ where }),
    ])

    return {
      vehicles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Obtener vehículo por ID
   */
  async getById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        region: true,
        entries: {
          include: {
            workshop: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { entryDate: 'desc' },
          take: 10,
        },
        workOrders: {
          include: {
            workshop: true,
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!vehicle) {
      throw new Error('Vehículo no encontrado')
    }

    return vehicle
  }

  /**
   * Obtener vehículo por patente
   */
  async getByLicensePlate(licensePlate: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { licensePlate: licensePlate.toUpperCase() },
      include: {
        region: true,
      },
    })

    if (!vehicle) {
      throw new Error('Vehículo no encontrado')
    }

    return vehicle
  }

  /**
   * Crear vehículo
   */
  async create(data: {
    licensePlate: string
    vehicleType: string
    brand: string
    model: string
    year: number
    vin?: string
    fleetNumber?: string
    regionId: string
  }) {
    const { licensePlate, vehicleType, brand, model, year, vin, fleetNumber, regionId } =
      data

    // Validar patente
    if (!validateLicensePlate(licensePlate)) {
      throw new Error('Formato de patente inválido')
    }

    // Verificar si ya existe un vehículo con esa patente
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { licensePlate: licensePlate.toUpperCase() },
    })

    if (existingVehicle) {
      throw new Error('Ya existe un vehículo con esa patente')
    }

    // Verificar si la región existe
    const region = await prisma.region.findUnique({
      where: { id: regionId },
    })

    if (!region) {
      throw new Error('Región no encontrada')
    }

    // Crear vehículo
    const vehicle = await prisma.vehicle.create({
      data: {
        licensePlate: licensePlate.toUpperCase(),
        vehicleType,
        brand,
        model,
        year,
        vin,
        fleetNumber,
        regionId,
      },
      include: {
        region: true,
      },
    })

    return vehicle
  }

  /**
   * Actualizar vehículo
   */
  async update(id: string, data: Partial<{
    licensePlate: string
    vehicleType: string
    brand: string
    model: string
    year: number
    vin?: string
    fleetNumber?: string
    regionId: string
    status: string
    isActive: boolean
  }>) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    })

    if (!vehicle) {
      throw new Error('Vehículo no encontrado')
    }

    // Si se actualiza la patente, validarla y verificar que no exista
    if (data.licensePlate) {
      if (!validateLicensePlate(data.licensePlate)) {
        throw new Error('Formato de patente inválido')
      }

      const existingVehicle = await prisma.vehicle.findUnique({
        where: { licensePlate: data.licensePlate.toUpperCase() },
      })

      if (existingVehicle && existingVehicle.id !== id) {
        throw new Error('Ya existe un vehículo con esa patente')
      }

      data.licensePlate = data.licensePlate.toUpperCase()
    }

    // Actualizar vehículo
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data,
      include: {
        region: true,
      },
    })

    return updatedVehicle
  }

  /**
   * Eliminar vehículo (soft delete)
   */
  async delete(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    })

    if (!vehicle) {
      throw new Error('Vehículo no encontrado')
    }

    await prisma.vehicle.update({
      where: { id },
      data: { isActive: false, status: 'inactive' },
    })

    return { message: 'Vehículo eliminado exitosamente' }
  }

  /**
   * Restaurar vehículo
   */
  async restore(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    })

    if (!vehicle) {
      throw new Error('Vehículo no encontrado')
    }

    await prisma.vehicle.update({
      where: { id },
      data: { isActive: true, status: 'active' },
    })

    return { message: 'Vehículo restaurado exitosamente' }
  }

  /**
   * Obtener estadísticas de vehículos
   */
  async getStats() {
    const [total, active, inMaintenance, inactive, byType, byRegion] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'active' } }),
      prisma.vehicle.count({ where: { status: 'in_maintenance' } }),
      prisma.vehicle.count({ where: { status: 'inactive' } }),
      prisma.vehicle.groupBy({
        by: ['vehicleType'],
        _count: true,
      }),
      prisma.vehicle.groupBy({
        by: ['regionId'],
        _count: true,
      }),
    ])

    return {
      total,
      active,
      inMaintenance,
      inactive,
      byType,
      byRegion,
    }
  }
}

export default new VehicleService()


