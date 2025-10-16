import api from './api'
import type { LoginRequest, LoginResponse, User } from '../../../shared/types'

export const authService = {
  /**
   * Login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials)
    const data = response.data.data

    // Guardar tokens
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    return data
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    })
  },

  /**
   * Solicitar recuperación de contraseña
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  },
}


