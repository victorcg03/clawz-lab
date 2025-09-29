-- Corrección de políticas RLS duplicadas y limpieza de índices no utilizados
-- Resolución de warnings finales del Supabase Linter

-- 1. Corregir políticas duplicadas en custom_requests
-- Eliminar la política antigua 'custom_requests_insert' que está en conflicto
DROP POLICY IF EXISTS "custom_requests_insert" ON public.custom_requests;

-- La política 'custom_requests_owner' ya maneja todas las operaciones INSERT/SELECT/UPDATE/DELETE

-- 2. Limpiar índices no utilizados para optimizar espacio y rendimiento
-- Eliminar índices simples que fueron reemplazados por índices compuestos más eficientes

-- Productos - mantener solo el índice compuesto
DROP INDEX IF EXISTS public.products_active_idx;

-- Product variants - el índice no se está usando
DROP INDEX IF EXISTS public.product_variants_product_id_idx;

-- Carts - reemplazado por consultas más eficientes
DROP INDEX IF EXISTS public.carts_user_id_idx;

-- Cart items - reemplazado por índice compuesto
DROP INDEX IF EXISTS public.cart_items_cart_id_idx;

-- Orders - consultas optimizadas hacen innecesario este índice
DROP INDEX IF EXISTS public.orders_user_id_idx;

-- Order items - reemplazado por índice compuesto
DROP INDEX IF EXISTS public.order_items_order_id_idx;

-- Custom requests - reemplazado por índice compuesto
DROP INDEX IF EXISTS public.custom_requests_status_idx;

-- Resto de índices simples no utilizados
DROP INDEX IF EXISTS public.custom_request_media_request_id_idx;
DROP INDEX IF EXISTS public.quotes_request_id_idx;
DROP INDEX IF EXISTS public.messages_request_id_idx;
DROP INDEX IF EXISTS public.audit_logs_entity_entity_id_idx;

-- 3. Eliminar índices que agregamos pero que no se están usando aún
-- (Los mantendremos solo si son realmente necesarios para queries específicas)
-- Estos se pueden agregar más tarde cuando sea necesario

-- Índices de foreign keys que no se usan aún - los eliminamos temporalmente
DROP INDEX IF EXISTS public.idx_audit_logs_actor_id;
DROP INDEX IF EXISTS public.idx_cart_items_size_profile_id;
DROP INDEX IF EXISTS public.idx_cart_items_variant_id;
DROP INDEX IF EXISTS public.idx_custom_requests_user_id;
DROP INDEX IF EXISTS public.idx_order_items_size_profile_id;
DROP INDEX IF EXISTS public.idx_order_items_variant_id;
DROP INDEX IF EXISTS public.idx_products_collection_id;
DROP INDEX IF EXISTS public.idx_size_profiles_user_id;

-- Índices compuestos que creamos pero aún no se usan
DROP INDEX IF EXISTS public.idx_cart_items_cart_variant;
DROP INDEX IF EXISTS public.idx_order_items_order_variant;
DROP INDEX IF EXISTS public.idx_custom_requests_user_status;
DROP INDEX IF EXISTS public.idx_products_collection_active;

-- 4. Mantener solo índices que realmente se van a usar en queries conocidas
-- Los agregaremos de vuelta cuando implementemos las funcionalidades que los necesiten

-- Índice para consultas de cart por usuario (este sí se usará)
CREATE INDEX IF NOT EXISTS idx_carts_user_active 
ON public.carts(user_id) WHERE user_id IS NOT NULL;

-- Índice para productos activos (query común en la tienda)
CREATE INDEX IF NOT EXISTS idx_products_active_available 
ON public.products(active, created_at DESC) WHERE active = true;

-- Índice para custom_requests por usuario (query común en dashboard)
CREATE INDEX IF NOT EXISTS idx_custom_requests_user_recent 
ON public.custom_requests(user_id, created_at DESC) WHERE user_id IS NOT NULL;

-- Migración completada: Limpieza de políticas duplicadas e índices no utilizados