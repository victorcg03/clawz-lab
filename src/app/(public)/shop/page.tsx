import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/layout/ui/Button';

async function getShopData() {
  const supabase = await supabaseServerReadonly();

  const [{ data: collections }, { data: featuredProducts }] = await Promise.all([
    supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),

    supabase
      .from('products')
      .select(
        `
        *,
        collection:collections(*),
        variants:product_variants(*)
      `,
      )
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(8),
  ]);

  return {
    collections: collections || [],
    featuredProducts: featuredProducts || [],
  };
}

function ShopSkeleton() {
  return (
    <main className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="animate-pulse space-y-8">
        {/* Hero skeleton */}
        <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>

        {/* Collections skeleton */}
        <div>
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-32 mb-4"></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
              ></div>
            ))}
          </div>
        </div>

        {/* Products skeleton */}
        <div>
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-40 mb-4"></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

async function ShopContent() {
  const { collections, featuredProducts } = await getShopData();

  return (
    <main className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="glass-card p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Diseños únicos para tus uñas
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl">
            Explora nuestra colección de diseños exclusivos o crea el tuyo personalizado
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary">Ver Catálogo</Button>
            <Link href="/custom">
              <Button variant="outline">Diseño Personalizado</Button>
            </Link>
          </div>
        </div>

        {/* Acento tribal sutil */}
        <div className="absolute top-4 right-4 w-16 h-16 opacity-10">
          <div className="w-full h-full border-2 border-current rounded-full"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border border-current rounded-full"></div>
        </div>
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold tracking-tight mb-4">Colecciones</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/shop/collections/${collection.slug}`}
                className="group surface-card overflow-hidden aspect-[4/3] relative"
              >
                {collection.image_url && (
                  <Image
                    src={collection.image_url}
                    alt={collection.name_i18n?.es || collection.name || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-medium text-sm">
                    {collection.name_i18n?.es || collection.name}
                  </h3>
                  {collection.description_i18n?.es && (
                    <p className="text-white/80 text-xs mt-1">
                      {collection.description_i18n.es}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Productos Destacados</h2>
          <Link
            href="/shop/products"
            className="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group surface-card overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-square bg-neutral-50 dark:bg-neutral-900 overflow-hidden relative">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name_i18n?.es || product.name || ''}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                    {product.name_i18n?.es || product.name}
                  </h3>
                  {product.description_i18n?.es && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-xs mb-2 line-clamp-2">
                      {product.description_i18n.es}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.variants && product.variants.length > 0 && (
                        <span className="text-sm font-semibold">
                          $
                          {Math.min(
                            ...product.variants.map((v: { price: number }) => v.price),
                          )}
                        </span>
                      )}
                      {product.collection && (
                        <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                          {product.collection.name_i18n?.es || product.collection.name}
                        </span>
                      )}
                    </div>

                    <svg
                      className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="surface-card p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-sm font-medium mb-2">No hay productos disponibles</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Pronto agregaremos nuevos diseños a nuestra colección
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="glass-card p-6 text-center">
        <h2 className="text-lg font-semibold mb-3">¿No encuentras lo que buscas?</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 max-w-2xl mx-auto">
          Crea un diseño completamente personalizado con nuestro servicio de encargos.
          Trabajamos contigo para crear las uñas perfectas para cualquier ocasión.
        </p>
        <Link href="/custom">
          <Button variant="primary">Crear Diseño Personalizado</Button>
        </Link>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
