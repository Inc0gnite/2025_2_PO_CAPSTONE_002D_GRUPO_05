import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils/response'
import { validateRUT, validateEmail, validatePassword } from '../utils/validation'

/**
 * Middleware para validar request body
 */
export function validateBody(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter((field) => !req.body[field])

    if (missingFields.length > 0) {
      return sendError(
        res,
        `Campos requeridos: ${missingFields.join(', ')}`,
        400
      )
    }

    next()
  }
}

/**
 * Middleware para validar RUT en el body
 */
export function validateRUTField(field = 'rut') {
  return (req: Request, res: Response, next: NextFunction) => {
    const rut = req.body[field]

    if (rut && !validateRUT(rut)) {
      return sendError(res, `RUT inválido: ${rut}`, 400)
    }

    next()
  }
}

/**
 * Middleware para validar email en el body
 */
export function validateEmailField(field = 'email') {
  return (req: Request, res: Response, next: NextFunction) => {
    const email = req.body[field]

    if (email && !validateEmail(email)) {
      return sendError(res, `Email inválido: ${email}`, 400)
    }

    next()
  }
}

/**
 * Middleware para validar contraseña en el body
 */
export function validatePasswordField(field = 'password') {
  return (req: Request, res: Response, next: NextFunction) => {
    const password = req.body[field]

    if (password) {
      const result = validatePassword(password)
      if (!result.isValid) {
        return sendError(res, result.errors.join('. '), 400)
      }
    }

    next()
  }
}

/**
 * Middleware para validar paginación en query params
 */
export function validatePagination(req: Request, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  if (page < 1) {
    return sendError(res, 'El número de página debe ser mayor a 0', 400)
  }

  if (limit < 1 || limit > 100) {
    return sendError(res, 'El límite debe estar entre 1 y 100', 400)
  }

  // Agregar valores validados al query
  req.query.page = page.toString()
  req.query.limit = limit.toString()

  next()
}


