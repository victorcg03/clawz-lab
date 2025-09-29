import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Hero skeleton */}
        <div className="h-64 bg-gray-200 rounded-lg mb-12"></div>

        {/* Collections skeleton */}
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
          ))}
        </div>

        {/* Products skeleton */}
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function ShopContent() {
  const { collections, featuredProducts } = await getShopData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white mb-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl">
              Diseños únicos para tus uñas
            </h1>
            <p className="text-xl text-pink-100 mb-8">
              Explora nuestra colección de diseños exclusivos o crea el tuyo personalizado
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Ver Catálogo
              </Button>
              <Link
                href="/custom"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                Diseño Personalizado
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Collections */}
      {collections.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Colecciones</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/shop/collections/${collection.slug}`}
                className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3] hover:shadow-lg transition-all duration-200"
              >
                {collection.image_url && (
                  <Image
                    src={collection.image_url}
                    alt={collection.name_i18n?.es || collection.name || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {collection.name_i18n?.es || collection.name}
                  </h3>
                  {collection.description_i18n?.es && (
                    <p className="text-white/80 text-sm mt-1">
                      {collection.description_i18n.es}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
          <Link
            href="/shop/products"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name_i18n?.es || product.name || ''}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12"
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

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {product.name_i18n?.es || product.name}
                  </h3>
                  {product.description_i18n?.es && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description_i18n.es}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.variants && product.variants.length > 0 && (
                        <span className="text-lg font-bold text-purple-600">
                          $
                          {Math.min(
                            ...product.variants.map((v: { price: number }) => v.price),
                          )}
                        </span>
                      )}
                      {product.collection && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.collection.name_i18n?.es || product.collection.name}
                        </span>
                      )}
                    </div>

                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors"
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
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay productos disponibles
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Pronto agregaremos nuevos diseños a nuestra colección
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Crea un diseño completamente personalizado con nuestro servicio de encargos.
          Trabajamos contigo para crear las uñas perfectas para cualquier ocasión.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="bg-white text-purple-600 hover:bg-gray-100"
        >
          <Link href="/custom">Crear Diseño Personalizado</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
