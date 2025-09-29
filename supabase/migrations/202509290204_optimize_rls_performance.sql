-- Optimización de políticas RLS y rendimiento de la base de datos
-- Soluciona warnings de Supabase Linter

-- 1. Optimizar políticas RLS existentes para evitar re-evaluación de auth.uid()
-- Reemplazar auth.uid() con (select auth.uid()) para mejor rendimiento

-- Profiles table policies
DROP POLICY IF EXISTS "profiles_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;

CREATE POLICY "profiles_self" ON public.profiles
  FOR SELECT TO anon, authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "profiles_self_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- 2. Consolidar y optimizar políticas de size_profiles
-- Eliminar políticas duplicadas y optimizar las restantes
DROP POLICY IF EXISTS "size_profiles_owner" ON public.size_profiles;
DROP POLICY IF EXISTS "size_profiles_select_own" ON public.size_profiles;
DROP POLICY IF EXISTS "size_profiles_insert_own" ON public.size_profiles;
DROP POLICY IF EXISTS "size_profiles_update_own" ON public.size_profiles;
DROP POLICY IF EXISTS "size_profiles_delete_own" ON public.size_profiles;

-- Crear políticas consolidadas y optimizadas
CREATE POLICY "size_profiles_all_operations" ON public.size_profiles
  FOR ALL TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- 3. Optimizar otras políticas RLS existentes
-- Carts
DROP POLICY IF EXISTS "carts_owner" ON public.carts;
CREATE POLICY "carts_owner" ON public.carts
  FOR ALL TO authenticated
  USING (user_id = (select auth.uid()));

-- Cart items (a través de la relación con cart)
DROP POLICY IF EXISTS "cart_items_cascade" ON public.cart_items;
CREATE POLICY "cart_items_cascade" ON public.cart_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE id = cart_items.cart_id AND user_id = (select auth.uid())
    )
  );

-- Orders
DROP POLICY IF EXISTS "orders_owner" ON public.orders;
CREATE POLICY "orders_owner" ON public.orders
  FOR ALL TO authenticated
  USING (user_id = (select auth.uid()));

-- Order items
DROP POLICY IF EXISTS "order_items_owner" ON public.order_items;
CREATE POLICY "order_items_owner" ON public.order_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_items.order_id AND user_id = (select auth.uid())
    )
  );

-- Custom requests
DROP POLICY IF EXISTS "custom_requests_owner_select" ON public.custom_requests;
DROP POLICY IF EXISTS "custom_requests_owner_update" ON public.custom_requests;
CREATE POLICY "custom_requests_owner" ON public.custom_requests
  FOR ALL TO authenticated
  USING (user_id = (select auth.uid()));

-- Custom request media
DROP POLICY IF EXISTS "custom_request_media_select" ON public.custom_request_media;
DROP POLICY IF EXISTS "custom_request_media_insert" ON public.custom_request_media;
CREATE POLICY "custom_request_media_owner" ON public.custom_request_media
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.custom_requests
      WHERE id = custom_request_media.request_id AND user_id = (select auth.uid())
    )
  );

-- Quotes
DROP POLICY IF EXISTS "quotes_owner" ON public.quotes;
CREATE POLICY "quotes_owner" ON public.quotes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.custom_requests
      WHERE id = quotes.request_id AND user_id = (select auth.uid())
    )
  );

-- Messages
DROP POLICY IF EXISTS "messages_owner" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_owner" ON public.messages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.custom_requests
      WHERE id = messages.request_id AND user_id = (select auth.uid())
    )
  );

-- 4. Crear índices para claves foráneas sin índices
-- Esto mejorará el rendimiento de las consultas

-- Audit logs actor_id
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id 
ON public.audit_logs(actor_id);

-- Cart items foreign keys
CREATE INDEX IF NOT EXISTS idx_cart_items_size_profile_id 
ON public.cart_items(size_profile_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id 
ON public.cart_items(variant_id);

-- Custom requests user_id
CREATE INDEX IF NOT EXISTS idx_custom_requests_user_id 
ON public.custom_requests(user_id);

-- Order items foreign keys
CREATE INDEX IF NOT EXISTS idx_order_items_size_profile_id 
ON public.order_items(size_profile_id);

CREATE INDEX IF NOT EXISTS idx_order_items_variant_id 
ON public.order_items(variant_id);

-- Products collection_id
CREATE INDEX IF NOT EXISTS idx_products_collection_id 
ON public.products(collection_id);

-- Size profiles user_id (ya existe pero verificamos)
CREATE INDEX IF NOT EXISTS idx_size_profiles_user_id 
ON public.size_profiles(user_id);

-- 5. Eliminar índices no utilizados (pero mantenemos algunos que podrían ser útiles en el futuro)
-- Solo eliminamos los que realmente no vamos a usar

-- Eliminar índice de size_profiles que es muy específico
DROP INDEX IF EXISTS idx_size_profiles_user_created_at;

-- 6. Crear índices compuestos más útiles para queries comunes
-- Estos reemplazarán algunos de los índices no utilizados

-- Para consultas de cart_items por cart_id y variant_id
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_variant 
ON public.cart_items(cart_id, variant_id);

-- Para consultas de order_items por order_id y variant_id
CREATE INDEX IF NOT EXISTS idx_order_items_order_variant 
ON public.order_items(order_id, variant_id);

-- Para consultas de custom_requests por user_id y status
CREATE INDEX IF NOT EXISTS idx_custom_requests_user_status 
ON public.custom_requests(user_id, status);

-- Para consultas de productos activos por colección
CREATE INDEX IF NOT EXISTS idx_products_collection_active 
ON public.products(collection_id, active);

-- Migración completada: Optimización de políticas RLS y rendimiento de la base de datos
-- Soluciona warnings de Supabase Linter