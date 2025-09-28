# Prompt para GitHub Copilot — **E‑commerce de Uñas (Next.js + Supabase)**

**Rol:** Eres un _Senior Full‑Stack Engineer & Designer_. Vas a construir desde cero una web para una empresa de uñas que ofrece **encargos personalizados** y **tienda de modelos prediseñados**. Debe tener **panel de administración**, **i18n (es/en)**, **SEO completo**, **accesibilidad**, **tests**, **migraciones de BD** y **calidad enterprise**. El proyecto está recién creado con **Next.js (App Router) + Tailwind (última versión)**.

---

## Stack y reglas base

- **Next.js (App Router)** con TypeScript **estricto**.
- **Tailwind CSS** (ya instalado).
- **Supabase** local en marcha. Tú debes:
  - Generar **migraciones SQL** completas.
  - Ejecutar `npx supabase db reset` tras crearlas.
  - Generar tipos: `npx supabase gen types typescript --local > src/types/supabase.ts`.
- **Forms**: `react-hook-form` + `zod`.
- **Data/Cache**: `@tanstack/react-query` (cliente) cuando aporte valor.
- **i18n**: `next-intl` (rutas `/es` y `/en`, namespaces).
- **Tests**: Vitest + Testing Library (unit/integración) y **Playwright** (e2e smoke).
- **Calidad**: ESLint (`@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-sonarjs`), Prettier, **Husky** + **lint-staged**, **jscpd** (duplicados).
- **Commits**: Conventional Commits (commitlint opcional).
- Código **DRY**, documentado con **JSDoc/TSDoc** y arquitectura **modular por features**.
- No uses librerías **deprecated**. Usa APIs actuales de Next.js **App Router** (rutas en `app/`, `route.ts`, `generateMetadata`, `sitemap.ts`, `robots.ts`).

> Importante: **No asumas versión EOL**. Usa patrones estables del App Router y `@supabase/ssr` vigentes.

---

## Limpieza inicial (automatiza)

1. Elimina archivos de plantilla que trae Next + Tailwind (página demo, SVGs, etc.).
2. Crea scripts npm para: `dev`, `build`, `start`, `typecheck`, `lint`, `format`, `test`, `test:watch`, `e2e`, `dup` (jscpd), `prepare` (husky).

---

## Arquitectura de carpetas

```
src/
  app/
    (public)/
      layout.tsx
      page.tsx              # landing
      measure/page.tsx      # guía de medición
      shop/page.tsx         # catálogo
      product/[slug]/page.tsx
      custom/page.tsx       # wizard de encargos personalizados
      login/page.tsx
      register/page.tsx
      forgot-password/page.tsx
    (private)/
      account/page.tsx      # pedidos, perfiles de talla
      checkout/page.tsx
    admin/
      layout.tsx
      page.tsx
      products/page.tsx
      products/new/page.tsx
      custom-requests/page.tsx
      orders/page.tsx
    api/
      upload/route.ts       # (ejemplo) manejo subidas si hace falta
  components/
    ui/                     # Button, Input, Select, Modal, Stepper, Tabs, DataTable...
    forms/                  # wrappers RHF+Zod
    layout/                 # Header, Footer, LocaleSwitcher, ThemeToggle
    product/                # PDP widgets (VariantSelector, Gallery, Price)
    cart/                   # CartDrawer, CartIcon
  lib/
    supabase/
      client.ts             # browser
      server.ts             # server helpers
    i18n/
      request.ts            # next-intl request (locale)
      config.ts             # next-intl setup
    router.ts               # protecciones cliente (fallback)
    auth.ts                 # helpers comunes
    queryClient.ts          # react-query
    storage.ts              # helpers Supabase Storage
    seo.ts                  # helpers metadata
  styles/
    globals.css
  config/
    env.ts                  # validación Zod de variables
    constants.ts
  types/
    supabase.ts             # generado
    domain.ts
  tests/
    unit/
    integration/
    e2e/
locales/
  en/{common.json,shop.json,custom.json}
  es/{common.json,shop.json,custom.json}
middleware.ts
app.d.ts
sitemap.ts                  # raíz (multi-locale)
robots.ts
```

---

## Patrones _Next.js + Supabase_ (actualizados)

### Cliente en navegador — `src/lib/supabase/client.ts`

```ts
// file: src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

### Helper en servidor — `src/lib/supabase/server.ts`

```ts
// file: src/lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {}, // Next gestiona escritura en acciones/handlers
        remove: () => {}, // Evita mutaciones fuera de handlers
      },
    },
  );
}
```

### Middleware para sincronizar sesión (protege rutas privadas)

```ts
// file: middleware.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: Request) {
  const res = NextResponse.next();

  // Fuerza la lectura de la sesión para mantener cookies en sync
  // (No escribe cookies aquí para evitar conflictos con Next)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  await createServerClient(url, anon, {
    cookies: { get: (name: string) => req.headers.get('cookie') ?? '' },
  }).auth.getUser();

  return res;
}

// Protege rutas privadas y admin
export const config = {
  matcher: ['/(private/:path*)', '/admin/:path*'],
};
```

> En **acciones del servidor** (`"use server"`) y **route handlers** (`app/**/route.ts`) puedes usar `supabaseServer()` con lectura/escritura real de cookies si lo necesitas.

---

## Dominio funcional

### 1) Encargos personalizados (presupuesto)

- Wizard `/custom` con pasos:
  1. **Contacto** (nombre, email, teléfono opcional, preferencia).
  2. **Diseño** (forma, largo, color/es, acabado, temática, extras, urgencia).
  3. **Descripción libre**.
  4. **Inspiración**: subida de imágenes (Supabase Storage **bucket `custom-media`** privado) y enlaces.
  5. **Medidas**: guía + formulario o selección de **perfil de medidas** guardado (ver abajo).
- Inserta `custom_requests` con estado `pending_quote`. Panel admin: calcular **presupuesto**, enviar email (simulado) y avanzar estados (`quoted` → `accepted`/`rejected` → `in_production` → `ready` → `shipped`). **Mensajería** cliente↔tienda por request.

### 2) Tienda de productos prediseñados

- Catálogo `/shop` con **filtros** por **forma**, **largo**, **acabado**, **colección** y **precio**.
- PDP `/product/[slug]` con **variantes** y **galería**. Antes de **Añadir al carrito**: **paso obligatorio de medidas** (seleccionar perfil o introducir medidas `custom_sizes`). Persistir en `cart_items`.
- Carrito y checkout en `/ (private)/checkout`. Estados de `orders`: `placed` → `paid` (simulado) → `in_production` → `shipped`.

### 3) Mediciones

- Página `/measure` con **instrucciones accesibles** (texto + imágenes). Formulario de medidas por dedo (ambas manos). Guardar como **`size_profiles`** por usuario, reutilizables.

### 4) Contenido y SEO

- Landing `/` con hero, colecciones destacadas, testimonios, FAQ, CTA a Custom y Shop.
- **SEO serio**: `generateMetadata`, `sitemap.ts`, `robots.ts`, OpenGraph por producto/colección, JSON‑LD (Product/Offer).
- **i18n**: `next-intl` con switches de locale y archivos en `locales/es|en`.

### 5) Panel Administrativo

- CRUD de **productos**, **variantes** e **imágenes** (bucket `product-media` público lectura).
- Gestión de **pedidos**, **solicitudes personalizadas**, **presupuestos** y **mensajes**.
- **Cupones** y descuentos (opcional).
- **Export CSV**.
- **Auditoría** (cambios de estado y actor).

---

## Modelo de datos (migraciones)

> Crea migraciones compatibles con Postgres/Supabase, índices y **RLS Policies**. Tras crearlas, ejecuta los comandos `db reset` y generación de tipos.

- `profiles` (1:1 `auth.users`): `id uuid pk`, `full_name`, `avatar_url`, `phone`, `is_admin boolean default false`, `created_at`.
- `size_profiles`: `id`, `user_id fk`, `name`, `left_thumb..left_pinky`, `right_thumb..right_pinky`, `created_at`.
- `collections`: `id`, `slug unique`, `name_i18n jsonb`, `description_i18n jsonb`, `hero_image`.
- `products`: `id`, `slug unique`, `name_i18n jsonb`, `description_i18n jsonb`, `base_price`, `active`, `collection_id fk`, `created_at`.
- `product_variants`: `id`, `product_id fk`, `shape text`, `length text`, `finish text`, `colorway text`, `sku unique`, `price`, `stock`, `images jsonb`, `active`.
- `carts`: `id`, `user_id`, `status text check (status in ('cart','abandoned','converted'))`, `created_at`.
- `cart_items`: `id`, `cart_id`, `variant_id`, `qty`, `size_profile_id fk`, `custom_sizes jsonb`.
- `orders`: `id`, `user_id`, `status text check (... )`, `total`, `shipping_address jsonb`, `notes text`, `created_at`.
- `order_items`: `id`, `order_id`, `variant_id`, `qty`, `unit_price`, `size_profile_id fk`, `custom_sizes jsonb`.
- `custom_requests`: `id`, `user_id nullable`, `contact_name`, `email`, `phone`, `shape`, `length`, `colors jsonb`, `finish`, `theme`, `extras jsonb`, `target_date date`, `brief text`, `measurement jsonb`, `status text`, `created_at`.
- `custom_request_media`: `id`, `request_id fk`, `file_url`, `kind text`, `title`.
- `quotes`: `id`, `request_id fk`, `amount numeric`, `currency text`, `message text`, `expires_at timestamptz`, `status text`, `created_at`.
- `messages`: `id`, `request_id fk`, `author text check (author in ('client','admin'))`, `content text`, `created_at`.
- `discounts` (opcional): `id`, `code unique`, `type text`, `value numeric`, `starts_at`, `ends_at`, `active`.
- `audit_logs`: `id`, `entity text`, `entity_id uuid`, `action text`, `actor_id uuid`, `meta jsonb`, `created_at`.

**RLS Policies (resumen):**

- Usuarios solo ven/gestionan **sus** `profiles`, `size_profiles`, `carts`, `orders`, `custom_requests`, `messages` (si son autores).
- Admin (`profiles.is_admin = true`) tiene acceso total.
- Buckets Storage: `product-media` (**public read**, write admin); `custom-media` (**private**; write autenticado autor/admin).

---

## UI/UX y diseño

- Estética **minimalista** con toques **cromo/metal líquido/tribal** (gradientes sutiles, glass suave). Modo oscuro opcional.
- Componentes **reutilizables** (Token design en Tailwind: colores, radii, sombras, spacing).
- Accesibilidad: contraste AA, focus ring visible, roles/aria consistentes, navegación teclado.

---

## Librerías adicionales

- `next-intl`, `lucide-react`, `framer-motion` (micro-animaciones), `recharts` (gráficas admin básicas).
- `@hookform/resolvers`, `zod`, `clsx`, `tailwind-merge`.
- Testing: `@testing-library/react`, `@testing-library/jest-dom`.
- Calidad: `eslint-plugin-sonarjs`, `jscpd`.

---

## SEO

- `generateMetadata` en páginas clave (title, description, OG).
- OG dinámico por PDP (puedes usar `next/og` para imágenes si procede).
- `sitemap.ts` multi‑locale e `i18n` alternates, `robots.ts`, JSON‑LD (Product/Offer).
- Canonicals, breadcrumbs (opcional).

---

## Entregables y _formato de respuesta_

- Trabaja en **PRs pequeños** y testeables. Cada PR **compila**, pasa **linters** y **tests**.
- **Siempre responde** con **archivos completos** en formato:

```ts
// file: <ruta>
// contenido completo
```

- Incluye **tests** en `src/tests` (unit/integración) y **Playwright** (e2e smoke: login, crear solicitud custom, comprar PDP con medidas).
- Añade **README.md** con scripts, estructura y decisiones.
- Cada PR debe incluir **commits siguiendo Conventional Commits** (feat, fix, chore, etc.) para facilitar revertir cambios y mantener un versionado semántico (SemVer) claro de la aplicación.
- Configura commitlint + husky para validar mensajes en commit-msg y rechazar commits no válidos automáticamente.

### Archivos que Copilot debe generar al respecto

1. **`commitlint.config.js`** en la raíz:

```js
export default { extends: ['@commitlint/config-conventional'] };
```

2. Husky hook .husky/commit-msg:
   #!/bin/sh
   . "$(dirname "$0")/\_/husky.sh"

npx --no-install commitlint --edit "$1" 3. Actualizar package.json:

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "@commitlint/cli": "^19.2.2",
    "@commitlint/config-conventional": "^19.2.2",
    "husky": "^9.0.10"
  }
}
```

- El versionado de la aplicación debe seguir **SemVer** (major.minor.patch) y actualizarse automáticamente según el tipo de commit (`feat` = minor, `fix` = patch, `breaking change` = major).

---

## Plan de ejecución (iterativo)

1. **Bootstrap & Tooling**
   - Limpieza plantilla, ESLint/Prettier/Husky/jscpd/Vitest/Playwright, `env.ts` con Zod.
2. **Infra Next**
   - Layouts, `globals.css`, tokens Tailwind, router (grupos `(public)/(private)`), `next-intl` configurado.
3. **Supabase + Auth**
   - `supabaseServer`, `supabase` (browser), páginas `login/register/forgot-password`, guards en layouts privados.
4. **BD & Seeds**
   - Migraciones completas + seeds (formas/largos/colecciones).
5. **Catálogo & PDP**
   - Listado con filtros; PDP con variantes y **interceptor de medidas** antes de carrito.
6. **Carrito & Checkout**
   - Carrito persistente; checkout simulado; orden creada.
7. **Custom Wizard**
   - Pasos + uploads a Storage; creación de `custom_requests`; notificación/pseudo-email; hilo de mensajes.
8. **Admin Panel**
   - CRUD de productos/variantes; gestión de pedidos/solicitudes; presupuestos (quotes).
9. **Pulido**
   - A11y, SEO, i18n completa, e2e smoke, métricas Lighthouse.
10. **Docs**

- README final, decisiones técnicas, checklists de calidad.

---

## Criterios de aceptación

- Lighthouse ≥ 90 en Performance/Best‑Practices/SEO/A11y (desktop).
- 0 dependencias deprecated; 0 vulnerabilidades **high/critical**.
- Cobertura inicial ≥ 60% (mejorable).
- RLS verificadas; subida segura a Storage.
- Flujo **custom** completo (solicitud → presupuesto → aceptación).
- Tienda operativa con **mediciones obligatorias** y filtros por **forma/largo**.

---

## Tareas para ejecutar **YA** (por ti, Copilot)

1. Genera **migraciones** de todas las tablas + **RLS policies** + seeds.
2. Configura **tooling** y scripts npm.
3. Implementa `supabaseServer`, `supabase` (browser), `middleware.ts`, i18n base (`next-intl`).
4. Crea páginas de **Auth** con RHF+Zod + tests.
5. Implementa `/measure`, `/shop`, `/product/[slug]`, `/custom` (wizard + uploads).
6. Monta **admin** mínimo (CRUD productos/variantes, gestión de solicitudes).
7. Añade **tests** unit/integración y **Playwright** e2e (smoke).
8. Entrega **README** y snapshots.

> A partir de ahora, producirás archivos completos y testeados siguiendo el formato indicado, justificando decisiones clave y manteniendo los estándares de calidad.
