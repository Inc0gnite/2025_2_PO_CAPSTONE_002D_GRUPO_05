# Guía de Instalación - Base de Datos

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **PostgreSQL 13+** ([Descargar aquí](https://www.postgresql.org/download/))
- **Node.js 18+** ([Descargar aquí](https://nodejs.org/))
- **npm o yarn** (incluido con Node.js)
- **Git** (para clonar el repositorio)

## 🚀 Pasos de Instalación

### 1. Configurar PostgreSQL

#### Opción A: Usando línea de comandos
```bash
# Crear base de datos
createdb taller_automotriz_db

# O usando psql
psql -U postgres
CREATE DATABASE taller_automotriz_db;
\q
```

#### Opción B: Usando pgAdmin
1. Abrir pgAdmin
2. Conectar al servidor PostgreSQL
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `taller_automotriz_db`
5. Click "Save"

### 2. Configurar Variables de Entorno

Crear archivo `.env` en el directorio `backend/`:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/taller_automotriz_db"

# JWT Secret (para autenticación)
JWT_SECRET="tu_jwt_secret_muy_seguro_aqui"

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV="development"
```

**⚠️ Importante**: Cambiar `usuario` y `password` por tus credenciales de PostgreSQL.

### 3. Instalar Dependencias

```bash
# Navegar al directorio del proyecto
cd "Fase2/EvidenciasProyecto/Evidencias de sistema/Aplicacion"

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 4. Configurar Prisma

```bash
# Desde el directorio backend
cd backend

# Generar cliente de Prisma
npx prisma generate

# Verificar conexión a la base de datos
npx prisma db push
```

### 5. Ejecutar Migraciones

```bash
# Crear migración inicial
npx prisma migrate dev --name init

# Aplicar migraciones
npx prisma migrate deploy
```

### 6. Ejecutar Seed (Datos de Prueba)

```bash
# Ejecutar script de inicialización
npx prisma db seed
```

Si aparece error, agregar al `package.json` del backend:
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### 7. Verificar Instalación

```bash
# Abrir Prisma Studio para ver los datos
npx prisma studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde podrás ver todas las tablas y datos.

## 🔧 Configuración Adicional

### Configurar Usuario de Base de Datos (Opcional)

```sql
-- Conectar a PostgreSQL como superusuario
psql -U postgres

-- Crear usuario específico para la aplicación
CREATE USER taller_user WITH PASSWORD 'taller_password_2025';

-- Asignar permisos
GRANT ALL PRIVILEGES ON DATABASE taller_automotriz_db TO taller_user;

-- Configurar permisos en las tablas
\c taller_automotriz_db;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taller_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taller_user;
```

### Configuración de PostgreSQL (Opcional)

Para optimizar el rendimiento, editar `postgresql.conf`:

```conf
# Memoria
shared_buffers = 256MB
effective_cache_size = 1GB

# Conexiones
max_connections = 100

# Logging
log_statement = 'all'
log_duration = on
```

## 🧪 Verificar Instalación

### 1. Verificar Conexión
```bash
cd backend
npx prisma db push
```

### 2. Verificar Datos
```bash
npx prisma studio
```

### 3. Probar API
```bash
# Iniciar servidor backend
npm run dev

# En otra terminal, probar endpoint
curl http://localhost:3000/api/health
```

## 🚨 Solución de Problemas

### Error: "database does not exist"
```bash
# Crear la base de datos
createdb taller_automotriz_db
```

### Error: "relation does not exist"
```bash
# Ejecutar migraciones
npx prisma migrate deploy
```

### Error: "permission denied"
```bash
# Verificar usuario y permisos en PostgreSQL
psql -U postgres -c "\du"
```

### Error: "connection refused"
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql status
# O en Windows:
net start postgresql-x64-13
```

### Error: "bcrypt module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📊 Datos de Prueba Incluidos

Después del seed, tendrás:

- ✅ **6 roles** configurados
- ✅ **6 usuarios** de prueba
- ✅ **3 regiones** (RM, Valparaíso, Biobío)
- ✅ **3 talleres** operativos
- ✅ **4 vehículos** de muestra
- ✅ **5 repuestos** con stock
- ✅ **Órdenes de trabajo** de ejemplo
- ✅ **Notificaciones** del sistema

## 🔐 Credenciales de Acceso

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Admin** | admin@pepsico.cl | admin123 | Acceso total |
| **Guardia** | guardia@pepsico.cl | admin123 | Control de acceso |
| **Recepcionista** | recepcion@pepsico.cl | admin123 | Gestión de órdenes |
| **Mecánico** | mecanico1@pepsico.cl | admin123 | Ejecución de trabajos |
| **Jefe de Taller** | jefe@pepsico.cl | admin123 | Supervisión |

## 🎯 Próximos Pasos

1. **Iniciar Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Iniciar Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Acceder al Sistema**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Prisma Studio: http://localhost:5555

## 📞 Soporte

Si encuentras problemas:

1. **Revisar logs**: Verificar consola para errores específicos
2. **Verificar conexión**: `npx prisma db push`
3. **Reinstalar dependencias**: Eliminar `node_modules` y reinstalar
4. **Verificar PostgreSQL**: Asegurar que el servicio esté ejecutándose

---

**¡Instalación completada!** 🎉

Tu base de datos está lista para usar con el sistema de gestión de talleres automotrices.
