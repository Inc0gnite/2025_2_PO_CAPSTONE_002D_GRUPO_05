# 🚛 Plataforma de Gestión de Ingreso de Vehículos - PepsiCo Chile

Sistema web para la gestión y control de ingresos de vehículos al taller de la flota nacional de PepsiCo Chile.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Base de Datos](#base-de-datos)
- [Deployment](#deployment)
- [Equipo](#equipo)

## 📝 Descripción

Plataforma web que digitaliza y automatiza la gestión de ingresos de vehículos al taller, reemplazando el proceso manual actual basado en planillas Excel y WhatsApp. El sistema permite:

- ✅ Registro de ingreso/salida de vehículos con captura de fotos
- ✅ Gestión de órdenes de trabajo (OT)
- ✅ Control de inventario de repuestos
- ✅ Asignación de mecánicos y seguimiento de estados
- ✅ Sistema de notificaciones automáticas
- ✅ Generación de reportes de productividad
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Gestión de 10 perfiles de usuario diferenciados

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3+** - Librería UI
- **TypeScript 5.5+** - Lenguaje tipado
- **Vite 5.4+** - Build tool
- **TailwindCSS 3.4+** - Estilos
- **shadcn/ui** - Componentes UI
- **React Router 6.26+** - Navegación
- **TanStack Query 5.56+** - Estado servidor
- **Zustand 4.5+** - Estado global
- **React Hook Form + Zod** - Formularios y validación
- **Recharts 2.12+** - Gráficos

### Backend
- **Node.js 20 LTS** - Runtime
- **Express.js 4.19+** - Framework web
- **TypeScript 5.5+** - Lenguaje tipado
- **Prisma ORM 5.20+** - ORM
- **PostgreSQL 15+** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **Winston** - Logging
- **Nodemailer** - Email
- **pdfkit + exceljs** - Generación de reportes

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway / Render
- **Database**: Neon / Supabase
- **Imágenes**: Cloudinary

## 📁 Estructura del Proyecto

```
Capstone_github/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas/vistas
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Servicios API
│   │   ├── store/           # Estado global (Zustand)
│   │   ├── utils/           # Utilidades
│   │   ├── types/           # Tipos TypeScript
│   │   ├── schemas/         # Esquemas Zod
│   │   ├── App.tsx          # Componente principal
│   │   ├── main.tsx         # Punto de entrada
│   │   └── index.css        # Estilos globales
│   ├── public/              # Archivos estáticos
│   ├── package.json         # Dependencias frontend
│   ├── tsconfig.json        # Configuración TypeScript
│   ├── vite.config.ts       # Configuración Vite
│   ├── tailwind.config.js   # Configuración Tailwind
│   ├── eslint.config.js     # Configuración ESLint
│   ├── postcss.config.js    # Configuración PostCSS
│   ├── index.html           # HTML principal
│   ├── env.example.txt      # Variables de entorno ejemplo
│   └── README.md            # Documentación frontend
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── config/          # Configuraciones (database.ts, logger.ts)
│   │   ├── controllers/     # Controladores (11 archivos)
│   │   ├── routes/          # Rutas (12 archivos)
│   │   ├── middlewares/     # Middlewares (5 archivos)
│   │   ├── models/          # Modelos (usa Prisma)
│   │   ├── services/        # Lógica de negocio (10 archivos)
│   │   ├── utils/           # Utilidades (4 archivos)
│   │   └── index.ts         # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma    # Modelo de datos
│   │   └── seed.ts          # Datos iniciales
│   ├── logs/                # Logs del sistema
│   ├── package.json         # Dependencias backend
│   ├── tsconfig.json        # Configuración TypeScript
│   ├── env.example.txt      # Variables de entorno ejemplo
│   └── README.md            # Documentación backend
│
├── shared/                   # Código compartido
│   ├── types/
│   │   └── index.ts         # Tipos compartidos
│   └── schemas/
│       └── index.ts         # Esquemas Zod compartidos
│
├── .gitignore               # Archivos a ignorar en Git
├── package.json             # Workspace principal
├── package-lock.json        # Lock de dependencias
└── README.md                # Documentación principal
```

## 📦 Requisitos Previos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **PostgreSQL** >= 15
- **Git**

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pepsico-fleet-management.git
cd pepsico-fleet-management
```

### 2. Instalar dependencias

```bash
# Instalar todas las dependencias (recomendado)
npm install

# Esto instalará automáticamente las dependencias de:
# - frontend/
# - backend/
# - shared/
# - raíz del proyecto
```

## ⚙️ Configuración

### Backend

1. Copiar el archivo de ejemplo de variables de entorno:
```bash
cd backend
cp env.example.txt .env
```

2. Editar `backend/.env` con tus credenciales:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/pepsico_fleet"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion

# Cloudinary (Imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Configuración de Logs
LOG_LEVEL=info
```

### Frontend

1. Copiar el archivo de ejemplo:
```bash
cd frontend
cp env.example.txt .env
```

2. Editar `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Gestión de Flota PepsiCo
```

## 🗄️ Base de Datos

### Crear base de datos

```sql
CREATE DATABASE pepsico_fleet;
```

### Ejecutar migraciones

```bash
cd backend

# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# (Opcional) Poblar con datos de prueba
npm run db:seed

# (Opcional) Abrir Prisma Studio para ver los datos
npm run db:studio
```

## 🏃 Ejecución

### Modo Desarrollo

#### Opción 1: Ejecutar todo desde la raíz
```bash
npm run dev
```

#### Opción 2: Ejecutar por separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health
- **Prisma Studio**: http://localhost:5555 (si está ejecutándose)

### Build para Producción

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

## 📊 Modelo de Datos

El sistema cuenta con **20 tablas** organizadas en 6 categorías:

### A. Gestión de Usuarios y Seguridad (5 tablas)
- `users` - Usuarios del sistema
- `roles` - Roles y perfiles
- `permissions` - Permisos del sistema
- `role_permissions` - Relación roles-permisos
- `audit_logs` - Registro de auditoría

### B. Gestión de Vehículos (3 tablas)
- `vehicles` - Vehículos de la flota
- `vehicle_entries` - Ingresos de vehículos
- `key_control` - Control de llaves

### C. Órdenes de Trabajo (4 tablas)
- `work_orders` - Órdenes de trabajo
- `work_order_statuses` - Historial de estados
- `work_order_photos` - Fotografías de OT
- `work_pauses` - Pausas de trabajo

### D. Inventario (3 tablas)
- `spare_parts` - Repuestos
- `work_order_spare_parts` - Repuestos usados en OT
- `spare_part_movements` - Movimientos de inventario

### E. Infraestructura (3 tablas)
- `regions` - Regiones
- `workshops` - Talleres
- `workshop_schedules` - Horarios de talleres

### F. Documentación y Notificaciones (2 tablas)
- `documents` - Documentos adjuntos
- `notifications` - Notificaciones del sistema

## 🎯 Funcionalidades Principales

### Perfiles de Usuario (10 roles)
1. Guardia de Portería
2. Recepcionista de Taller
3. Mecánico
4. Asistente de Repuestos
5. Jefe de Taller
6. Coordinador Regional
7. Coordinador de Flota Nacional
8. Administrador de Sistema
9. Supervisor de Calidad
10. Analista de Reportes

### Módulos del Sistema
- 📝 **Registro de Ingresos**: Captura de datos y fotos del vehículo
- 🔧 **Órdenes de Trabajo**: Creación, asignación y seguimiento
- 📦 **Inventario**: Control de stock de repuestos
- 📊 **Reportes**: Generación de informes en PDF/Excel
- 🔔 **Notificaciones**: Alertas automáticas por rol
- 👥 **Gestión de Usuarios**: CRUD y asignación de permisos

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Frontend (Vitest)
cd frontend
npm run test
npm run test:coverage

# Backend (Jest)
cd backend
npm run test
npm run test:coverage
```

### Objetivos de Cobertura
- **Backend**: 80% mínimo
- **Frontend**: 70% mínimo
- **Tasa de éxito**: > 95%

## 📚 Scripts Disponibles

### Raíz del proyecto
- `npm run dev` - Ejecutar frontend y backend simultáneamente
- `npm run build` - Build de todos los workspaces
- `npm run lint` - Linter en todos los workspaces
- `npm run format` - Formatear código con Prettier

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run lint` - ESLint

### Backend
- `npm run dev` - Servidor con hot reload
- `npm run build` - Compilar TypeScript
- `npm run start` - Ejecutar build compilado
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:studio` - Abrir Prisma Studio

## 🚀 Deployment

### Frontend (Vercel)
1. Conectar repositorio con Vercel
2. Configurar variables de entorno
3. Deploy automático desde `main`

### Backend (Railway/Render)
1. Conectar repositorio
2. Configurar variables de entorno
3. Configurar base de datos PostgreSQL
4. Deploy automático

### Base de Datos (Neon/Supabase)
1. Crear proyecto
2. Copiar DATABASE_URL
3. Ejecutar migraciones en producción

## 👥 Equipo

- **Joaquín Marín** - Gerente de Proyecto / Desarrollador Frontend
- **Benjamin Vilches** - Gerente de Proyecto / Desarrollador Backend

### Stakeholders
- **Alexis González** - Patrocinador (Subgerente de Flota Nacional PepsiCo)
- **Fabián Álvarez** - Docente Supervisor

## 📅 Cronograma

- **Inicio**: 01 Septiembre 2024
- **Término**: 28 Noviembre 2024
- **Duración**: 12 semanas

### Fases
1. **Inicio** (Semana 1): Kickoff y setup
2. **Planificación** (Semanas 2-3): Análisis y diseño
3. **Análisis y Diseño** (Semanas 3-4): Mockups y arquitectura
4. **Construcción** (Semanas 5-9): Desarrollo
5. **Pruebas** (Semanas 10-11): Testing y QA
6. **Cierre** (Semana 12): Deploy y entrega

## 📄 Licencia

Este proyecto es privado y propiedad de PepsiCo Chile.

## 📞 Contacto

Para consultas sobre el proyecto:
- Joaquín Marín: jo.marinm@duocuc.cl
- Benjamin Vilches: benj.vilches@duocuc.cl

---

## 🧹 Notas sobre la Estructura del Proyecto

Este proyecto ha sido optimizado para producción, manteniendo solo los archivos esenciales para el funcionamiento de la aplicación:

### ✅ Archivos Incluidos
- Código fuente completo (frontend, backend, shared)
- Archivos de configuración necesarios
- Documentación esencial (README.md)
- Archivos de ejemplo para variables de entorno

### ❌ Archivos Excluidos
- Documentación de planificación del proyecto
- Archivos de pruebas y testing
- Diagramas y documentación técnica detallada
- Archivos temporales y de desarrollo

La estructura actual es **profesional y lista para producción**, enfocándose únicamente en el código funcional y la documentación mínima necesaria para que otros desarrolladores puedan instalar, configurar y ejecutar la aplicación.

---

**Institución**: Duoc UC  
**Asignatura**: Capstone  
**Año**: 2024




