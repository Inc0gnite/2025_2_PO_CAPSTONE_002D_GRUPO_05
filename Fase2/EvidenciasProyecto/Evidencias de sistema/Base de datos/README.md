# Base de Datos - Sistema de Gestión de Talleres Automotrices

## 📋 Descripción
Base de datos PostgreSQL para el sistema de gestión de talleres automotrices desarrollado para PepsiCo. Esta base de datos está diseñada para manejar todas las operaciones relacionadas con la gestión de vehículos, talleres, órdenes de trabajo e inventario de repuestos.

## 🛠️ Tecnologías Utilizadas
- **Motor de Base de Datos**: PostgreSQL 13+
- **ORM**: Prisma
- **Lenguaje**: TypeScript
- **Migraciones**: Prisma Migrate

## 🏗️ Estructura de la Base de Datos

### Entidades Principales (20 tablas en total)

#### A. Gestión de Usuarios y Seguridad (5 tablas)
- `users` - Usuarios del sistema
- `roles` - Roles de usuario (Admin, Guardia, Recepcionista, etc.)
- `permissions` - Permisos específicos del sistema
- `role_permissions` - Relación roles-permisos
- `audit_logs` - Registro de auditoría de acciones

#### B. Gestión de Vehículos (3 tablas)
- `vehicles` - Información de vehículos de la flota
- `vehicle_entries` - Registro de ingresos de vehículos al taller
- `key_control` - Control de llaves de vehículos

#### C. Órdenes de Trabajo (4 tablas)
- `work_orders` - Órdenes de trabajo principales
- `work_order_statuses` - Historial de estados de órdenes
- `work_order_photos` - Fotos asociadas a órdenes
- `work_pauses` - Registro de pausas en trabajos

#### D. Inventario (3 tablas)
- `spare_parts` - Catálogo de repuestos
- `work_order_spare_parts` - Repuestos solicitados por orden
- `spare_part_movements` - Movimientos de stock de repuestos

#### E. Infraestructura (3 tablas)
- `regions` - Regiones geográficas
- `workshops` - Talleres de la empresa
- `workshop_schedules` - Horarios de funcionamiento de talleres

#### F. Documentación y Notificaciones (2 tablas)
- `documents` - Documentos del sistema
- `notifications` - Sistema de notificaciones

## 📁 Archivos Incluidos

### Archivos Principales
- `schema.prisma` - Esquema completo de la base de datos con todas las entidades y relaciones
- `seed.ts` - Script de inicialización con datos de prueba y usuarios por defecto
- `database_setup.sql` - Script SQL para configuración inicial de la base de datos
- `database_backup.sql` - Respaldo de la estructura de la base de datos

### Documentación
- `README.md` - Este archivo (documentación general)
- `INSTALACION.md` - Guía paso a paso para la instalación y configuración

## 🚀 Características Principales

### Seguridad
- Sistema de roles y permisos granulares
- Registro completo de auditoría
- Autenticación segura con bcrypt
- Control de acceso basado en roles (RBAC)

### Funcionalidades
- Gestión completa de flota vehicular
- Control de ingresos y salidas de vehículos
- Sistema de órdenes de trabajo con seguimiento de estados
- Gestión de inventario con control de stock
- Sistema de notificaciones en tiempo real
- Control de llaves de vehículos

### Escalabilidad
- Diseño normalizado para optimizar consultas
- Índices estratégicos para mejorar rendimiento
- Estructura flexible para múltiples talleres
- Soporte para múltiples regiones geográficas

## 📊 Datos de Prueba

El script `seed.ts` incluye datos de ejemplo:
- **6 roles** diferentes (Admin, Guardia, Recepcionista, Mecánico, Jefe de Taller, Inventario)
- **6 usuarios** de prueba con diferentes roles
- **3 regiones** (Metropolitana, Valparaíso, Biobío)
- **3 talleres** distribuidos por regiones
- **4 vehículos** de diferentes tipos
- **5 repuestos** de ejemplo con stock
- **Órdenes de trabajo** de muestra
- **Notificaciones** del sistema

## 🔐 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@pepsico.cl | admin123 |
| Guardia | guardia@pepsico.cl | admin123 |
| Recepcionista | recepcion@pepsico.cl | admin123 |
| Mecánico | mecanico1@pepsico.cl | admin123 |
| Jefe de Taller | jefe@pepsico.cl | admin123 |

## 📈 Métricas de la Base de Datos

- **Total de tablas**: 20
- **Relaciones**: 25+ relaciones entre entidades
- **Índices**: 15+ índices para optimizar consultas
- **Campos JSON**: 3 campos para flexibilidad (audit_logs.details, vehicle_entries.photos, etc.)

## 🔄 Flujo de Datos Principal

1. **Ingreso de Vehículo**: Guardia registra entrada → Se crea vehicle_entry
2. **Creación de Orden**: Recepcionista crea work_order → Se asigna a mecánico
3. **Ejecución**: Mecánico actualiza estados → Se registran fotos y repuestos
4. **Inventario**: Sistema actualiza stock → Genera notificaciones de stock bajo
5. **Salida**: Vehículo sale del taller → Se actualiza vehicle_entry

## 🛡️ Consideraciones de Seguridad

- Todas las contraseñas están hasheadas con bcrypt
- Registro completo de auditoría de todas las acciones
- Validación de datos a nivel de base de datos
- Índices optimizados para consultas de seguridad
- Control de acceso granular por recursos y acciones

## 📞 Soporte

Para consultas técnicas sobre la base de datos, revisar:
1. `INSTALACION.md` - Para problemas de instalación
2. `schema.prisma` - Para entender la estructura
3. `seed.ts` - Para ver ejemplos de datos

---

**Desarrollado para**: PepsiCo Chile  
**Fecha**: Octubre 2025  
**Versión**: 1.0.0
