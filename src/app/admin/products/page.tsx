import Link from 'next/link';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';

async function getProducts() {
  const supabase = await supabaseServerReadonly();

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(
        `
        id,
        slug,
        name_i18n,
        description_i18n,
        base_price,
        active,
        created_at,
        collections (
          id,
          name_i18n
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return { products: [], error: error.message };
    }

    return { products: products || [], error: null };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], error: 'Error inesperado' };
  }
}

export default async function AdminProductsPage() {
  const { products, error } = await getProducts();

  const getProductName = (nameI18n: unknown) => {
    if (typeof nameI18n === 'object' && nameI18n !== null) {
      return (
        (nameI18n as Record<string, string>)?.es ||
        (nameI18n as Record<string, string>)?.en ||
        'Sin nombre'
      );
    }
    return 'Sin nombre';
  };

  const getCollectionName = (collection: unknown) => {
    if (!collection || typeof collection !== 'object') return 'Sin colección';
    const nameI18n = (collection as { name_i18n?: unknown }).name_i18n;
    if (typeof nameI18n === 'object' && nameI18n !== null) {
      return (
        (nameI18n as Record<string, string>)?.es ||
        (nameI18n as Record<string, string>)?.en ||
        'Sin nombre'
      );
    }
    return 'Sin nombre';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Productos
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Gestiona el catálogo de productos de la tienda
          </p>
        </div>
        <Button>
          <Link href="/admin/products/new" className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Nuevo producto</span>
          </Link>
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error al cargar productos: {error}
          </p>
        </div>
      )}

      {/* Products table */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No hay productos
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Comienza creando tu primer producto para el catálogo
            </p>
            <Button>
              <Link href="/admin/products/new">Crear primer producto</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {products.length} {products.length === 1 ? 'producto' : 'productos'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Colección
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Precio base
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {getProductName(product.name_i18n)}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            /{product.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {getCollectionName(product.collections)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                        €{product.base_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}
                        >
                          {product.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(product.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/product/${product.slug}`}
                            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                            target="_blank"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
