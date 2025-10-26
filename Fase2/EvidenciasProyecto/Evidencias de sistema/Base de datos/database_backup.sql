-- =============================================
-- Respaldo de Estructura de Base de Datos
-- Sistema de Gestión de Talleres Automotrices
-- PepsiCo Chile - 2025
-- =============================================
-- 
-- Este archivo contiene la estructura completa de la base de datos
-- generada automáticamente por Prisma Migrate
-- 
-- Para generar este archivo manualmente, ejecutar:
-- pg_dump -h localhost -U postgres -d taller_automotriz_db --schema-only > database_backup.sql
--
-- Para restaurar la estructura completa:
-- psql -h localhost -U postgres -d taller_automotriz_db < database_backup.sql
-- =============================================

-- PostgreSQL database dump
-- =============================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- =============================================
-- EXTENSIONES
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA public;

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Tabla: roles
CREATE TABLE public.roles (
    id character varying NOT NULL,
    name character varying NOT NULL,
    description character varying,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
);

-- Tabla: permissions
CREATE TABLE public.permissions (
    id character varying NOT NULL,
    resource character varying NOT NULL,
    action character varying NOT NULL,
    description character varying,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT permissions_pkey PRIMARY KEY (id),
    CONSTRAINT permissions_resource_action_key UNIQUE (resource, action)
);

-- Tabla: role_permissions
CREATE TABLE public.role_permissions (
    role_id character varying NOT NULL,
    permission_id character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id)
);

-- Tabla: regions
CREATE TABLE public.regions (
    id character varying NOT NULL,
    code character varying NOT NULL,
    name character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT regions_pkey PRIMARY KEY (id),
    CONSTRAINT regions_code_key UNIQUE (code)
);

-- Tabla: workshops
CREATE TABLE public.workshops (
    id character varying NOT NULL,
    code character varying NOT NULL,
    name character varying NOT NULL,
    region_id character varying NOT NULL,
    address character varying NOT NULL,
    city character varying NOT NULL,
    phone character varying,
    capacity integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT workshops_pkey PRIMARY KEY (id),
    CONSTRAINT workshops_code_key UNIQUE (code)
);

-- Tabla: users
CREATE TABLE public.users (
    id character varying NOT NULL,
    rut character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    phone character varying,
    role_id character varying NOT NULL,
    workshop_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_rut_key UNIQUE (rut),
    CONSTRAINT users_email_key UNIQUE (email)
);

-- Tabla: vehicles
CREATE TABLE public.vehicles (
    id character varying NOT NULL,
    license_plate character varying NOT NULL,
    vehicle_type character varying NOT NULL,
    brand character varying NOT NULL,
    model character varying NOT NULL,
    year integer NOT NULL,
    vin character varying,
    fleet_number character varying,
    region_id character varying NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT vehicles_pkey PRIMARY KEY (id),
    CONSTRAINT vehicles_license_plate_key UNIQUE (license_plate),
    CONSTRAINT vehicles_vin_key UNIQUE (vin),
    CONSTRAINT vehicles_fleet_number_key UNIQUE (fleet_number)
);

-- Tabla: vehicle_entries
CREATE TABLE public.vehicle_entries (
    id character varying NOT NULL,
    entry_code character varying NOT NULL,
    vehicle_id character varying NOT NULL,
    workshop_id character varying NOT NULL,
    driver_rut character varying NOT NULL,
    driver_name character varying NOT NULL,
    driver_phone character varying,
    entry_date timestamp(3) without time zone NOT NULL,
    exit_date timestamp(3) without time zone,
    entry_km integer NOT NULL,
    exit_km integer,
    fuel_level character varying NOT NULL,
    has_keys boolean DEFAULT true NOT NULL,
    observations character varying,
    photos jsonb,
    status character varying DEFAULT 'ingresado'::character varying NOT NULL,
    created_by_id character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT vehicle_entries_pkey PRIMARY KEY (id),
    CONSTRAINT vehicle_entries_entry_code_key UNIQUE (entry_code)
);

-- Tabla: key_control
CREATE TABLE public.key_control (
    id character varying NOT NULL,
    entry_id character varying NOT NULL,
    key_location character varying NOT NULL,
    delivered_to character varying,
    delivered_at timestamp(3) without time zone,
    returned_by character varying,
    returned_at timestamp(3) without time zone,
    observations character varying,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT key_control_pkey PRIMARY KEY (id),
    CONSTRAINT key_control_entry_id_key UNIQUE (entry_id)
);

-- Tabla: work_orders
CREATE TABLE public.work_orders (
    id character varying NOT NULL,
    order_number character varying NOT NULL,
    vehicle_id character varying NOT NULL,
    entry_id character varying NOT NULL,
    workshop_id character varying NOT NULL,
    work_type character varying NOT NULL,
    priority character varying DEFAULT 'media'::character varying NOT NULL,
    description character varying NOT NULL,
    estimated_hours double precision,
    assigned_to_id character varying,
    current_status character varying DEFAULT 'pendiente'::character varying NOT NULL,
    started_at timestamp(3) without time zone,
    completed_at timestamp(3) without time zone,
    total_hours double precision,
    observations character varying,
    created_by_id character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT work_orders_pkey PRIMARY KEY (id),
    CONSTRAINT work_orders_order_number_key UNIQUE (order_number)
);

-- Tabla: work_order_statuses
CREATE TABLE public.work_order_statuses (
    id character varying NOT NULL,
    work_order_id character varying NOT NULL,
    status character varying NOT NULL,
    observations character varying,
    changed_by_id character varying NOT NULL,
    changed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT work_order_statuses_pkey PRIMARY KEY (id)
);

-- Tabla: work_order_photos
CREATE TABLE public.work_order_photos (
    id character varying NOT NULL,
    work_order_id character varying NOT NULL,
    url character varying NOT NULL,
    description character varying,
    photo_type character varying NOT NULL,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT work_order_photos_pkey PRIMARY KEY (id)
);

-- Tabla: work_pauses
CREATE TABLE public.work_pauses (
    id character varying NOT NULL,
    work_order_id character varying NOT NULL,
    reason character varying NOT NULL,
    paused_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resumed_at timestamp(3) without time zone,
    duration integer,
    observations character varying,
    CONSTRAINT work_pauses_pkey PRIMARY KEY (id)
);

-- Tabla: spare_parts
CREATE TABLE public.spare_parts (
    id character varying NOT NULL,
    code character varying NOT NULL,
    name character varying NOT NULL,
    description character varying,
    category character varying NOT NULL,
    unit_of_measure character varying NOT NULL,
    unit_price double precision NOT NULL,
    current_stock integer DEFAULT 0 NOT NULL,
    min_stock integer NOT NULL,
    max_stock integer NOT NULL,
    location character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT spare_parts_pkey PRIMARY KEY (id),
    CONSTRAINT spare_parts_code_key UNIQUE (code)
);

-- Tabla: work_order_spare_parts
CREATE TABLE public.work_order_spare_parts (
    id character varying NOT NULL,
    work_order_id character varying NOT NULL,
    spare_part_id character varying NOT NULL,
    quantity_requested integer NOT NULL,
    quantity_delivered integer,
    status character varying DEFAULT 'solicitado'::character varying NOT NULL,
    requested_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delivered_at timestamp(3) without time zone,
    observations character varying,
    CONSTRAINT work_order_spare_parts_pkey PRIMARY KEY (id)
);

-- Tabla: spare_part_movements
CREATE TABLE public.spare_part_movements (
    id character varying NOT NULL,
    spare_part_id character varying NOT NULL,
    movement_type character varying NOT NULL,
    quantity integer NOT NULL,
    previous_stock integer NOT NULL,
    new_stock integer NOT NULL,
    reason character varying NOT NULL,
    reference character varying,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT spare_part_movements_pkey PRIMARY KEY (id)
);

-- Tabla: workshop_schedules
CREATE TABLE public.workshop_schedules (
    id character varying NOT NULL,
    workshop_id character varying NOT NULL,
    day_of_week integer NOT NULL,
    open_time character varying NOT NULL,
    close_time character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    CONSTRAINT workshop_schedules_pkey PRIMARY KEY (id)
);

-- Tabla: documents
CREATE TABLE public.documents (
    id character varying NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    url character varying NOT NULL,
    related_to character varying NOT NULL,
    related_id character varying NOT NULL,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT documents_pkey PRIMARY KEY (id)
);

-- Tabla: notifications
CREATE TABLE public.notifications (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    title character varying NOT NULL,
    message character varying NOT NULL,
    type character varying NOT NULL,
    related_to character varying,
    related_id character varying,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Tabla: audit_logs
CREATE TABLE public.audit_logs (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    action character varying NOT NULL,
    resource character varying NOT NULL,
    resource_id character varying,
    details jsonb,
    ip_address character varying,
    user_agent character varying,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);

-- =============================================
-- ÍNDICES
-- =============================================

-- Índices para users
CREATE INDEX users_role_id_idx ON public.users USING btree (role_id);
CREATE INDEX users_workshop_id_idx ON public.users USING btree (workshop_id);

-- Índices para vehicles
CREATE INDEX vehicles_license_plate_idx ON public.vehicles USING btree (license_plate);
CREATE INDEX vehicles_region_id_idx ON public.vehicles USING btree (region_id);

-- Índices para vehicle_entries
CREATE INDEX vehicle_entries_vehicle_id_idx ON public.vehicle_entries USING btree (vehicle_id);
CREATE INDEX vehicle_entries_workshop_id_idx ON public.vehicle_entries USING btree (workshop_id);
CREATE INDEX vehicle_entries_entry_date_idx ON public.vehicle_entries USING btree (entry_date);

-- Índices para work_orders
CREATE INDEX work_orders_vehicle_id_idx ON public.work_orders USING btree (vehicle_id);
CREATE INDEX work_orders_entry_id_idx ON public.work_orders USING btree (entry_id);
CREATE INDEX work_orders_workshop_id_idx ON public.work_orders USING btree (workshop_id);
CREATE INDEX work_orders_assigned_to_id_idx ON public.work_orders USING btree (assigned_to_id);
CREATE INDEX work_orders_current_status_idx ON public.work_orders USING btree (current_status);
CREATE INDEX work_orders_created_at_idx ON public.work_orders USING btree (created_at);

-- Índices para work_order_statuses
CREATE INDEX work_order_statuses_work_order_id_idx ON public.work_order_statuses USING btree (work_order_id);
CREATE INDEX work_order_statuses_changed_at_idx ON public.work_order_statuses USING btree (changed_at);

-- Índices para work_order_photos
CREATE INDEX work_order_photos_work_order_id_idx ON public.work_order_photos USING btree (work_order_id);

-- Índices para work_pauses
CREATE INDEX work_pauses_work_order_id_idx ON public.work_pauses USING btree (work_order_id);

-- Índices para spare_parts
CREATE INDEX spare_parts_code_idx ON public.spare_parts USING btree (code);
CREATE INDEX spare_parts_category_idx ON public.spare_parts USING btree (category);

-- Índices para work_order_spare_parts
CREATE INDEX work_order_spare_parts_work_order_id_idx ON public.work_order_spare_parts USING btree (work_order_id);
CREATE INDEX work_order_spare_parts_spare_part_id_idx ON public.work_order_spare_parts USING btree (spare_part_id);

-- Índices para spare_part_movements
CREATE INDEX spare_part_movements_spare_part_id_idx ON public.spare_part_movements USING btree (spare_part_id);
CREATE INDEX spare_part_movements_created_at_idx ON public.spare_part_movements USING btree (created_at);

-- Índices para workshops
CREATE INDEX workshops_region_id_idx ON public.workshops USING btree (region_id);

-- Índices para workshop_schedules
CREATE INDEX workshop_schedules_workshop_id_idx ON public.workshop_schedules USING btree (workshop_id);

-- Índices para documents
CREATE INDEX documents_related_to_related_id_idx ON public.documents USING btree (related_to, related_id);

-- Índices para notifications
CREATE INDEX notifications_user_id_is_read_idx ON public.notifications USING btree (user_id, is_read);
CREATE INDEX notifications_created_at_idx ON public.notifications USING btree (created_at);

-- Índices para audit_logs
CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);
CREATE INDEX audit_logs_resource_resource_id_idx ON public.audit_logs USING btree (resource, resource_id);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);

-- =============================================
-- RESTRICCIONES DE CLAVE FORÁNEA
-- =============================================

-- Restricciones para users
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- Restricciones para role_permissions
ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Restricciones para workshops
ALTER TABLE ONLY public.workshops
    ADD CONSTRAINT workshops_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Restricciones para vehicles
ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Restricciones para vehicle_entries
ALTER TABLE ONLY public.vehicle_entries
    ADD CONSTRAINT vehicle_entries_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.vehicle_entries
    ADD CONSTRAINT vehicle_entries_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.vehicle_entries
    ADD CONSTRAINT vehicle_entries_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Restricciones para key_control
ALTER TABLE ONLY public.key_control
    ADD CONSTRAINT key_control_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.vehicle_entries(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Restricciones para work_orders
ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_assigned_to_id_fkey FOREIGN KEY (assigned_to_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.vehicle_entries(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Restricciones para work_order_statuses
ALTER TABLE ONLY public.work_order_statuses
    ADD CONSTRAINT work_order_statuses_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Restricciones para work_order_photos
ALTER TABLE ONLY public.work_order_photos
    ADD CONSTRAINT work_order_photos_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Restricciones para work_pauses
ALTER TABLE ONLY public.work_pauses
    ADD CONSTRAINT work_pauses_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Restricciones para work_order_spare_parts
ALTER TABLE ONLY public.work_order_spare_parts
    ADD CONSTRAINT work_order_spare_parts_spare_part_id_fkey FOREIGN KEY (spare_part_id) REFERENCES public.spare_parts(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.work_order_spare_parts
    ADD CONSTRAINT work_order_spare_parts_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Restricciones para spare_part_movements
ALTER TABLE ONLY public.spare_part_movements
    ADD CONSTRAINT spare_part_movements_spare_part_id_fkey FOREIGN KEY (spare_part_id) REFERENCES public.spare_parts(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Restricciones para workshop_schedules
ALTER TABLE ONLY public.workshop_schedules
    ADD CONSTRAINT workshop_schedules_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Restricciones para notifications
ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Restricciones para audit_logs
ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- =============================================
-- COMENTARIOS EN TABLAS
-- =============================================

COMMENT ON TABLE public.roles IS 'Roles de usuario del sistema';
COMMENT ON TABLE public.permissions IS 'Permisos específicos del sistema';
COMMENT ON TABLE public.role_permissions IS 'Relación entre roles y permisos';
COMMENT ON TABLE public.regions IS 'Regiones geográficas';
COMMENT ON TABLE public.workshops IS 'Talleres de la empresa';
COMMENT ON TABLE public.users IS 'Usuarios del sistema';
COMMENT ON TABLE public.vehicles IS 'Vehículos de la flota';
COMMENT ON TABLE public.vehicle_entries IS 'Registro de ingresos de vehículos';
COMMENT ON TABLE public.key_control IS 'Control de llaves de vehículos';
COMMENT ON TABLE public.work_orders IS 'Órdenes de trabajo';
COMMENT ON TABLE public.work_order_statuses IS 'Historial de estados de órdenes';
COMMENT ON TABLE public.work_order_photos IS 'Fotos asociadas a órdenes';
COMMENT ON TABLE public.work_pauses IS 'Registro de pausas en trabajos';
COMMENT ON TABLE public.spare_parts IS 'Catálogo de repuestos';
COMMENT ON TABLE public.work_order_spare_parts IS 'Repuestos solicitados por orden';
COMMENT ON TABLE public.spare_part_movements IS 'Movimientos de stock de repuestos';
COMMENT ON TABLE public.workshop_schedules IS 'Horarios de funcionamiento de talleres';
COMMENT ON TABLE public.documents IS 'Documentos del sistema';
COMMENT ON TABLE public.notifications IS 'Sistema de notificaciones';
COMMENT ON TABLE public.audit_logs IS 'Registro de auditoría de acciones';

-- =============================================
-- FIN DEL RESPALDO
-- =============================================

-- Respaldo generado el: [FECHA_ACTUAL]
-- Base de datos: taller_automotriz_db
-- Versión de PostgreSQL: [VERSION]
-- Total de tablas: 20
-- Total de índices: 25+
-- Total de restricciones: 25+
