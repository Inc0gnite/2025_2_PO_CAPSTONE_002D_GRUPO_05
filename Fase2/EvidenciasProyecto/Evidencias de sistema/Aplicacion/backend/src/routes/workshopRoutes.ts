import { Router } from 'express'
import workshopController from '../controllers/workshopController'
import { authenticate } from '../middlewares/auth'
import { authorize, requireAdmin } from '../middlewares/rbac'
import { validateBody } from '../middlewares/validation'
import { auditLog } from '../middlewares/audit'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticate)

/**
 * GET /api/workshops/region/:regionId
 */
router.get('/region/:regionId', authorize('workshops', 'read'), workshopController.getByRegion)

/**
 * GET /api/workshops/:id/stats
 */
router.get('/:id/stats', authorize('workshops', 'read'), workshopController.getStats)

/**
 * GET /api/workshops
 */
router.get('/', authorize('workshops', 'read'), workshopController.getAll)

/**
 * GET /api/workshops/:id
 */
router.get('/:id', authorize('workshops', 'read'), workshopController.getById)

/**
 * POST /api/workshops
 */
router.post(
  '/',
  requireAdmin,
  validateBody(['code', 'name', 'regionId', 'address', 'city']),
  auditLog('create', 'workshops'),
  workshopController.create
)

/**
 * PUT /api/workshops/:id
 */
router.put(
  '/:id',
  requireAdmin,
  auditLog('update', 'workshops'),
  workshopController.update
)

/**
 * POST /api/workshops/:id/schedule
 */
router.post(
  '/:id/schedule',
  requireAdmin,
  validateBody(['dayOfWeek', 'openTime', 'closeTime']),
  auditLog('set-schedule', 'workshops'),
  workshopController.setSchedule
)

export default router


