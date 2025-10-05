/**
 * Products page - displays all products with filtering
 * @author Clawz Lab Team
 * @version 1.0.0
 */

import { Suspense } from 'react';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, Spinner } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  image_url?: string;
  is_active: boolean;
  collection?: {
    name: string;
    slug: string;
  };
}

async function getProducts(): Promise<Product[]> {
  const supabase = await supabaseServerReadonly();

  const { data: products, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      description,
      base_price,
      image_url,
      is_active,
      collections (
        name,
        slug
      )
    `,
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products.map((product) => ({
    ...product,
    collection:
      Array.isArray(product.collections) && product.collections.length > 0
        ? {
            name: product.collections[0].name,
            slug: product.collections[0].slug,
          }
        : undefined,
  }));
}

function ProductCard({ product }: Readonly<{ product: Product }>) {
  return (
    <Card className="h-full" interactive>
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{product.name}</CardTitle>
          {product.collection && (
            <p className="text-sm text-gray-500">{product.collection.name}</p>
          )}
        </CardHeader>
        <CardContent>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-purple-600">
              ${product.base_price}
            </span>
            <span className="text-sm text-gray-500">Ver detalles</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

function ProductsGrid({ products }: Readonly<{ products: Product[] }>) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay productos disponibles
        </h3>
        <p className="text-gray-500">Pronto añadiremos nuevos diseños increíbles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function ProductsContent() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos los Productos</h1>
        <p className="text-gray-600">
          Descubre nuestra colección completa de diseños de uñas
        </p>
      </div>

      <ProductsGrid products={products} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </main>
  );
}
