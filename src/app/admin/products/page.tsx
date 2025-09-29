import Link from 'next/link';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/layout/ui/Button';
import { AdminTable, StatusBadge } from '@/components/admin/AdminTable';
import type { Column } from '@/components/admin/AdminTable';

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

function ProductActions({
  product,
}: Readonly<{ product: { id: string; slug: string } }>) {
  return (
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
  );
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

  const columns: Column<(typeof products)[0]>[] = [
    {
      key: 'name_i18n',
      label: 'Producto',
      render: (_value, item) => (
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {getProductName(item.name_i18n)}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'collections',
      label: 'Colección',
      render: (_value, item) => (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {getCollectionName(item.collections)}
        </span>
      ),
    },
    {
      key: 'base_price',
      label: 'Precio base',
      render: (value) => (
        <span className="text-sm text-neutral-900 dark:text-neutral-100">
          €{typeof value === 'number' ? value.toFixed(2) : '0.00'}
        </span>
      ),
    },
    {
      key: 'active',
      label: 'Estado',
      render: (value) => (
        <StatusBadge
          status={value === true ? 'Activo' : 'Inactivo'}
          variant={value === true ? 'success' : 'error'}
        />
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha',
      render: (value) => (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {typeof value === 'string' ? new Date(value).toLocaleDateString('es-ES') : '-'}
        </span>
      ),
    },
  ];

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
      <AdminTable
        data={products}
        columns={columns}
        emptyMessage="No hay productos. Comienza creando tu primer producto para el catálogo."
        actions={(product) => <ProductActions product={product} />}
      />
    </div>
  );
}
