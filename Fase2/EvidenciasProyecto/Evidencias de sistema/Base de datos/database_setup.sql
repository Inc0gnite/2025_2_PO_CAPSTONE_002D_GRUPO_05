-- =============================================
-- Script de Configuración Inicial
-- Sistema de Gestión de Talleres Automotrices
-- PepsiCo Chile - 2025
-- =============================================

-- Crear base de datos principal
CREATE DATABASE taller_automotriz_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_CL.UTF-8'
    LC_CTYPE = 'es_CL.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Comentario en la base de datos
COMMENT ON DATABASE taller_automotriz_db IS 'Base de datos para el sistema de gestión de talleres automotrices de PepsiCo';

-- =============================================
-- CONFIGURACIÓN DE USUARIOS Y PERMISOS
-- =============================================

-- Crear usuario específico para la aplicación (opcional)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'taller_user') THEN
        CREATE USER taller_user WITH PASSWORD 'taller_password_2025';
    END IF;
END
$$;

-- Asignar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE taller_automotriz_db TO taller_user;

-- Conectar a la base de datos creada
\c taller_automotriz_db;

-- =============================================
-- CONFIGURACIONES ADICIONALES
-- =============================================

-- Configurar zona horaria para Chile
ALTER DATABASE taller_automotriz_db SET timezone TO 'America/Santiago';

-- Configurar formato de fecha
SET datestyle = 'ISO, DMY';

-- =============================================
-- EXTENSIONES NECESARIAS
-- =============================================

-- Extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extensión para funciones criptográficas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Extensión para búsqueda de texto completo (opcional)
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- =============================================
-- CONFIGURACIONES DE RENDIMIENTO
-- =============================================

-- Configurar memoria compartida (ajustar según servidor)
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Configurar conexiones
-- ALTER SYSTEM SET max_connections = 100;

-- Configurar logging (para desarrollo)
-- ALTER SYSTEM SET log_statement = 'all';
-- ALTER SYSTEM SET log_duration = 'on';
-- ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Recargar configuración
-- SELECT pg_reload_conf();

-- =============================================
-- PERMISOS EN ESQUEMAS Y TABLAS FUTURAS
-- =============================================

-- Asignar permisos en esquema público
GRANT ALL ON SCHEMA public TO taller_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taller_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taller_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO taller_user;

-- Configurar permisos por defecto para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO taller_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO taller_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO taller_user;

-- =============================================
-- FUNCIONES UTILITARIAS
-- =============================================

-- Función para generar códigos de entrada únicos
CREATE OR REPLACE FUNCTION generate_entry_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    counter INTEGER;
BEGIN
    -- Obtener el siguiente número de secuencia para el día
    SELECT COALESCE(MAX(CAST(SUBSTRING(entry_code FROM '\d+$') AS INTEGER)), 0) + 1
    INTO counter
    FROM vehicle_entries
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Generar código con formato: ING-YYYYMMDD-NNNN
    code := 'ING-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Función para generar números de orden de trabajo
CREATE OR REPLACE FUNCTION generate_work_order_number()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    counter INTEGER;
BEGIN
    -- Obtener el siguiente número de secuencia para el día
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '\d+$') AS INTEGER)), 0) + 1
    INTO counter
    FROM work_orders
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Generar código con formato: OT-YYYYMMDD-NNNN
    code := 'OT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Función para validar formato de RUT chileno
CREATE OR REPLACE FUNCTION validate_rut(rut TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    rut_clean TEXT;
    rut_number TEXT;
    rut_dv TEXT;
    multiplier INTEGER;
    sum_total INTEGER := 0;
    calculated_dv TEXT;
BEGIN
    -- Limpiar RUT (remover puntos y guiones)
    rut_clean := REPLACE(REPLACE(rut, '.', ''), '-', '');
    
    -- Verificar longitud mínima
    IF LENGTH(rut_clean) < 2 THEN
        RETURN FALSE;
    END IF;
    
    -- Separar número y dígito verificador
    rut_number := SUBSTRING(rut_clean FROM 1 FOR LENGTH(rut_clean) - 1);
    rut_dv := UPPER(SUBSTRING(rut_clean FROM LENGTH(rut_clean)));
    
    -- Verificar que el número sea válido
    IF NOT rut_number ~ '^[0-9]+$' THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar que el dígito verificador sea válido
    IF NOT rut_dv ~ '^[0-9K]$' THEN
        RETURN FALSE;
    END IF;
    
    -- Calcular dígito verificador
    multiplier := 2;
    FOR i IN REVERSE 1..LENGTH(rut_number) LOOP
        sum_total := sum_total + CAST(SUBSTRING(rut_number FROM i FOR 1) AS INTEGER) * multiplier;
        multiplier := multiplier + 1;
        IF multiplier > 7 THEN
            multiplier := 2;
        END IF;
    END LOOP;
    
    calculated_dv := (11 - (sum_total % 11))::TEXT;
    IF calculated_dv = '11' THEN
        calculated_dv := '0';
    ELSIF calculated_dv = '10' THEN
        calculated_dv := 'K';
    END IF;
    
    -- Comparar dígito verificador
    RETURN rut_dv = calculated_dv;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS Y FUNCIONES DE AUDITORÍA
-- =============================================

-- Función para registrar cambios en auditoría
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar registro de auditoría
    INSERT INTO audit_logs (
        user_id,
        action,
        resource,
        resource_id,
        details,
        created_at
    ) VALUES (
        COALESCE(current_setting('app.current_user_id', true), 'system'),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        json_build_object(
            'old', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
            'new', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
        ),
        NOW()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista para dashboard de estadísticas
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM vehicles WHERE is_active = true) as total_vehicles,
    (SELECT COUNT(*) FROM vehicle_entries WHERE DATE(entry_date) = CURRENT_DATE) as entries_today,
    (SELECT COUNT(*) FROM work_orders WHERE current_status = 'en_progreso') as active_work_orders,
    (SELECT COUNT(*) FROM spare_parts WHERE current_stock <= min_stock) as low_stock_items,
    (SELECT COUNT(*) FROM notifications WHERE is_read = false) as unread_notifications;

-- Vista para vehículos en taller
CREATE OR REPLACE VIEW vehicles_in_workshop AS
SELECT 
    v.id,
    v.license_plate,
    v.brand,
    v.model,
    ve.entry_date,
    ve.driver_name,
    ve.status,
    w.name as workshop_name,
    DATEDIFF('hour', ve.entry_date, NOW()) as hours_in_workshop
FROM vehicles v
JOIN vehicle_entries ve ON v.id = ve.vehicle_id
JOIN workshops w ON ve.workshop_id = w.id
WHERE ve.exit_date IS NULL;

-- =============================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
-- =============================================

-- Índices compuestos para consultas frecuentes
-- (Estos se crearán automáticamente con Prisma, pero se incluyen como referencia)

-- Índice para búsquedas de vehículos por placa
-- CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON vehicles(license_plate);

-- Índice para entradas de vehículos por fecha
-- CREATE INDEX IF NOT EXISTS idx_vehicle_entries_date ON vehicle_entries(entry_date);

-- Índice para órdenes de trabajo por estado
-- CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(current_status);

-- Índice para usuarios por rol
-- CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

COMMENT ON DATABASE taller_automotriz_db IS 'Sistema de gestión de talleres automotrices - PepsiCo Chile 2025';
COMMENT ON FUNCTION generate_entry_code() IS 'Genera códigos únicos para ingresos de vehículos';
COMMENT ON FUNCTION generate_work_order_number() IS 'Genera números únicos para órdenes de trabajo';
COMMENT ON FUNCTION validate_rut(TEXT) IS 'Valida formato y dígito verificador de RUT chileno';
COMMENT ON VIEW dashboard_stats IS 'Estadísticas generales para el dashboard del sistema';
COMMENT ON VIEW vehicles_in_workshop IS 'Vista de vehículos actualmente en talleres';

-- =============================================
-- MENSAJE DE FINALIZACIÓN
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Configuración de base de datos completada';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Base de datos: taller_automotriz_db';
    RAISE NOTICE 'Usuario: taller_user';
    RAISE NOTICE 'Zona horaria: America/Santiago';
    RAISE NOTICE 'Extensiones instaladas: uuid-ossp, pgcrypto, unaccent';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Próximos pasos:';
    RAISE NOTICE '1. Ejecutar migraciones de Prisma';
    RAISE NOTICE '2. Ejecutar script de seed';
    RAISE NOTICE '3. Verificar con Prisma Studio';
    RAISE NOTICE '=============================================';
END
$$;
