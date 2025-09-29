import { supabaseServerReadonly } from '@/lib/supabase/server';

async function getOrders() {
  const supabase = await supabaseServerReadonly();

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        status,
        total,
        shipping_address,
        notes,
        created_at,
        profiles (
          id,
          full_name
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return { orders: [], error: error.message };
    }

    return { orders: orders || [], error: null };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], error: 'Error inesperado' };
  }
}

export default async function AdminOrdersPage() {
  const { orders, error } = await getOrders();

  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      placed: {
        label: 'Realizado',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      },
      paid: {
        label: 'Pagado',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      },
      in_production: {
        label: 'En producción',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      },
      shipped: {
        label: 'Enviado',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      },
      delivered: {
        label: 'Entregado',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      },
      cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getCustomerName = (profile: unknown) => {
    if (!profile || typeof profile !== 'object') return 'Cliente anónimo';
    const fullName = (profile as { full_name?: string }).full_name;
    return fullName || 'Cliente anónimo';
  };

  const formatAddress = (address: unknown) => {
    if (!address || typeof address !== 'object') return 'Sin dirección';
    const addr = address as Record<string, string>;
    const parts = [addr.street, addr.city, addr.postal_code].filter(Boolean);
    return parts.join(', ') || 'Sin dirección';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Pedidos
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Gestiona los pedidos de productos de la tienda
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error al cargar pedidos: {error}
          </p>
        </div>
      )}

      {/* Orders table */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {orders.length === 0 ? (
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No hay pedidos
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Los pedidos de la tienda aparecerán aquí
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Total
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
                  {orders.map((order) => {
                    const statusInfo = formatStatus(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              #{order.id.slice(0, 8)}
                            </p>
                            {order.notes && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                                {order.notes}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {getCustomerName(order.profiles)}
                            </p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                              {formatAddress(order.shipping_address)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          €{order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {new Date(order.created_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                              Ver detalles
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
