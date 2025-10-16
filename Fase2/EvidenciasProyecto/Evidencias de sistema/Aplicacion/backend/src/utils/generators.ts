/**
 * Utilidades para generar códigos y números únicos
 */

/**
 * Genera un código de ingreso único
 * Formato: ING-YYYYMMDD-XXXX
 * Ejemplo: ING-20241015-0001
 */
export function generateEntryCode(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')

  return `ING-${year}${month}${day}-${random}`
}

/**
 * Genera un número de orden de trabajo único
 * Formato: OT-YYYYMMDD-XXXX
 * Ejemplo: OT-20241015-0001
 */
export function generateWorkOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')

  return `OT-${year}${month}${day}-${random}`
}

/**
 * Genera un código de repuesto único
 * Formato: REP-XXXX
 */
export function generateSparePartCode(): string {
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0')
  return `REP-${random}`
}

/**
 * Genera un número de flota
 * Formato: FL-XXXX
 */
export function generateFleetNumber(): string {
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `FL-${random}`
}


