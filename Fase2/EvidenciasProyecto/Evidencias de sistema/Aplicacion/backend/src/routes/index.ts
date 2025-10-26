import { Router } from 'express'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import roleRoutes from './roleRoutes'
import vehicleRoutes from './vehicleRoutes'
import vehicleEntryRoutes from './vehicleEntryRoutes'
import workOrderRoutes from './workOrderRoutes'
import sparePartRoutes from './sparePartRoutes'
import workshopRoutes from './workshopRoutes'
import regionRoutes from './regionRoutes'
import dashboardRoutes from './dashboardRoutes'
import notificationRoutes from './notificationRoutes'

const router = Router()

// Rutas públicas
router.use('/auth', authRoutes)

// Rutas protegidas
router.use('/users', userRoutes)
router.use('/roles', roleRoutes)
router.use('/vehicles', vehicleRoutes)
router.use('/vehicle-entries', vehicleEntryRoutes)
router.use('/work-orders', workOrderRoutes)
router.use('/spare-parts', sparePartRoutes)
router.use('/workshops', workshopRoutes)
router.use('/regions', regionRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/notifications', notificationRoutes)

export default router


