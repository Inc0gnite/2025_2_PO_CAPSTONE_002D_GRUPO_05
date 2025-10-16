import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/auth'
import { sendError } from '../utils/response'
import prisma from '../config/database'

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        roleId: string
      }
    }
  }
}

/**
 * Middleware de autenticación
 * Verifica que el usuario esté autenticado mediante JWT
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Token no proporcionado', 401)
    }

    const token = authHeader.substring(7) // Remover "Bearer "

    // Verificar token
    const payload = verifyToken(token)

    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user || !user.isActive) {
      return sendError(res, 'Usuario no autorizado', 401)
    }

    // Agregar información del usuario al request
    req.user = payload

    next()
  } catch (error: any) {
    return sendError(res, error.message || 'Token inválido', 401)
  }
}

/**
 * Middleware opcional de autenticación
 * Intenta autenticar pero no falla si no hay token
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = verifyToken(token)
      req.user = payload
    }

    next()
  } catch (error) {
    // Ignorar errores de autenticación en modo opcional
    next()
  }
}


