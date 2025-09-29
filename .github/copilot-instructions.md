# Copilot Instructions for Clawz Lab

## Project Overview

**Clawz Lab** is a Next.js 15 (App Router) + Supabase e-commerce platform for custom nail designs. Uses route groups `(public)`, `(private)`, `admin` for authorization boundaries.

## Architecture Patterns

### Authentication & Authorization

- **Supabase clients**: Use `supabaseServer()` for server actions/route handlers, `supabaseServerReadonly()` for RSCs, `supabase` for client components
- **Middleware**: Protects `/account`, `/checkout`, `/admin` routes with redirect to `/login?redirect=path`
- **Route groups**: `(private)` requires auth, `admin` requires admin role in `profiles.is_admin`

### Database Schema

- **Core tables**: `profiles`, `size_profiles`, `collections`, `products`, `product_variants`, `custom_requests`, `orders`, `quotes`, `messages`, `audit_logs`
- **Extended tables**: `carts`, `cart_items`, `order_items`, `custom_request_media`, `discounts` (optional)
- **Key patterns**: JSONB for i18n content (`name_i18n`, `description_i18n`), status enums with CHECK constraints
- **Relations**: `profiles` 1:1 with `auth.users`, size profiles linked to cart/order items
- **RLS policies**: Users access own data, admins (`profiles.is_admin = true`) have full access
- **Migrations**: Use `npm run db:reset` to reset local DB and `npm run db:types` to regenerate TypeScript types

### i18n Setup

- **next-intl**: Currently hardcoded to Spanish (`es`), future multi-locale support planned
- **Messages**: Located in `src/locales/{locale}/common.json`, imported in layouts
- **Route structure**: Single locale for now, expandable to `/[locale]` pattern

### Component System

- **Design tokens**: CSS custom properties in `globals.css` with metal/glass/tribal aesthetic
- **UI components**: In `src/components/ui/` with consistent props (variant, size, loading states)
- **Button example**: Supports `primary|outline|ghost|subtle` variants and `sm|md|lg` sizes
- **Utility**: `cn()` function combines `clsx` and `tailwind-merge` for conditional classes

### Form Handling

- **react-hook-form + zod**: Standard pattern for all forms
- **Schema location**: Co-located with forms or in dedicated `schema.ts` files
- **Validation**: Client-side with zod, server-side validation in actions

### Testing Strategy

- **Unit tests**: Vitest + Testing Library in `src/tests/unit/`
- **Integration tests**: Component integration in `src/tests/integration/`
- **E2E tests**: Playwright in `src/tests/e2e/` (smoke tests for critical flows)
- **Quality gates**: ESLint with SonarJS, jscpd for duplication, lint-staged with Husky

## Development Workflow

### Essential Commands

```bash
npm run dev                 # Start dev server with Turbopack
npm run build              # Production build with Turbopack
npm run db:reset           # Reset Supabase DB + regenerate types
npm run db:types           # Generate TypeScript types from Supabase schema
npm run typecheck          # TypeScript validation
npm run lint               # ESLint with SonarJS rules
npm run format             # Prettier formatting
npm run test:watch         # Unit tests in watch mode
npm run e2e                # Run Playwright e2e tests
npm run e2e:headful        # Run Playwright with UI
npm run dup                # Check code duplication with jscpd (threshold: 3 lines)
```

### File Conventions

- **Actions**: Server actions in `actions.ts` files co-located with pages
- **Schemas**: Zod schemas in `schema.ts` files, often co-located with forms
- **Types**: Generated types in `src/types/supabase.ts`, domain types in `src/types/domain.ts`
- **Environment**: Validated in `src/config/env.ts` using zod
- **Helpers**: Dedicated files in `src/lib/` for storage, auth, SEO, query client
- **Components**: Organized by domain (`ui/`, `forms/`, `layout/`, `product/`, `cart/`)
- **Localization**: Namespaced JSON files in `locales/{locale}/` (common.json, shop.json, custom.json)

### Code Quality Standards

- **Conventional Commits**: Enforced with commitlint + Husky
- **Linting**: Strict TypeScript with ESLint plugins for React, hooks, and SonarJS
- **Testing**: Minimum viable tests for UI components and critical business logic
- **DRY principle**: Use jscpd to detect and eliminate code duplication (threshold: 3 lines)

## Business Domain

### Core Features

1. **Custom requests**: Multi-step wizard in `/custom` with image uploads to private Storage bucket
   - Steps: Contact → Design (shape, length, colors, finish, theme) → Description → Inspiration media → Size measurements
   - States: `pending_quote` → `quoted` → `accepted`/`rejected` → `in_production` → `ready` → `shipped`
   - Messaging system between client and admin per request
2. **Product catalog**: `/shop` with filtering, PDP with variants, mandatory size measurements
   - Filters: shape, length, finish, collection, price
   - **Mandatory size step** before adding to cart (select profile or enter custom sizes)
3. **Size profiles**: Reusable finger measurements stored per user (both hands, all 10 fingers)
4. **Admin panel**: CRUD for products, custom request management, order tracking
   - Quote calculation and approval workflow
   - CSV export functionality
   - Audit logs for state changes

### Key Workflows

- **Product purchase**: Shop → PDP → Size selection → Cart → Checkout
- **Custom request**: Wizard → Upload media → Size input → Admin quote → Client approval
- **Admin operations**: Manage products/variants, process custom requests, track orders

### Storage Buckets

- `product-media`: Public read, admin write for product images
- `custom-media`: Private bucket for custom request inspiration images

## Common Patterns

### Server Component Data Fetching

```typescript
// Use supabaseServerReadonly() in RSCs
const supabase = await supabaseServerReadonly();
const { data } = await supabase.from('products').select('*');
```

### Client State Management

- **React Query**: For server state caching when beneficial
- **Local state**: useState/useReducer for component state
- **Form state**: react-hook-form for complex forms

### Error Handling

- **Zod validation**: Both client and server-side
- **Supabase errors**: Handle auth, RLS, and database errors gracefully
- **User feedback**: Toast notifications or inline error states

## SEO & Performance

### SEO Implementation

- Use `generateMetadata` for dynamic metadata on products and collections
- Implement `sitemap.ts` and `robots.ts` in app root
- Add OpenGraph images and JSON-LD structured data (Product/Offer schema)
- Include proper canonical URLs and breadcrumbs
- Support multi-locale alternates for future expansion

### Performance Optimization

- Turbopack for development and production builds
- Lighthouse scores target: ≥90 in Performance/Best-Practices/SEO/A11y
- Image optimization with Next.js Image component
- Code splitting and lazy loading where appropriate

## Dependencies & Stack

### Core Libraries

- `next-intl` for internationalization
- `lucide-react` for icons
- `framer-motion` for micro-animations
- `recharts` for admin dashboards
- `@tanstack/react-query` for client state management

### Code Quality Tools

- TypeScript strict mode enabled
- ESLint with SonarJS plugin for code quality
- Prettier for consistent formatting
- jscpd for duplication detection (3-line threshold)
- Husky + lint-staged for pre-commit hooks
- Commitlint for conventional commit validation

When implementing features, follow the established patterns for authentication, data fetching, form handling, and component structure. Always add corresponding tests and ensure TypeScript strict mode compliance.
