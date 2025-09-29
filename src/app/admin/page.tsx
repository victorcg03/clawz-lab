import { supabaseServerReadonly } from '@/lib/supabase/server';

async function getAdminStats() {
  const supabase = await supabaseServerReadonly();

  try {
    // Obtener estadísticas básicas
    const [
      { count: productsCount },
      { count: customRequestsCount },
      { count: ordersCount },
      { count: activeRequestsCount },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('custom_requests').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase
        .from('custom_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_quote'),
    ]);

    // Obtener solicitudes recientes
    const { data: recentRequests } = await supabase
      .from('custom_requests')
      .select('id, contact_name, email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Obtener productos activos
    const { data: activeProducts } = await supabase
      .from('products')
      .select('id, name_i18n, active')
      .eq('active', true)
      .limit(5);

    return {
      stats: {
        products: productsCount || 0,
        customRequests: customRequestsCount || 0,
        orders: ordersCount || 0,
        activeRequests: activeRequestsCount || 0,
      },
      recentRequests: recentRequests || [],
      activeProducts: activeProducts || [],
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      stats: { products: 0, customRequests: 0, orders: 0, activeRequests: 0 },
      recentRequests: [],
      activeProducts: [],
    };
  }
}

export default async function AdminDashboard() {
  const { stats, recentRequests, activeProducts } = await getAdminStats();

  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending_quote: {
        label: 'Pendiente presupuesto',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      },
      quoted: {
        label: 'Presupuestado',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      },
      accepted: {
        label: 'Aceptado',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      },
      rejected: {
        label: 'Rechazado',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      },
      in_production: {
        label: 'En producción',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Resumen de la actividad de tu tienda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Productos</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {stats.products}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Encargos</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {stats.customRequests}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m4 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m4 0v4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Pedidos</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {stats.orders}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Pendientes</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {stats.activeRequests}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Custom Requests */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Encargos recientes
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Últimas solicitudes de encargos personalizados
            </p>
          </div>
          <div className="p-6">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                No hay encargos recientes
              </p>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request) => {
                  const statusInfo = formatStatus(request.status);
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {request.contact_name}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {request.email}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          {new Date(request.created_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Productos activos
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Productos disponibles en la tienda
            </p>
          </div>
          <div className="p-6">
            {activeProducts.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                No hay productos activos
              </p>
            ) : (
              <div className="space-y-4">
                {activeProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {typeof product.name_i18n === 'object' &&
                        product.name_i18n !== null
                          ? (product.name_i18n as Record<string, string>)?.es ||
                            (product.name_i18n as Record<string, string>)?.en ||
                            'Sin nombre'
                          : 'Sin nombre'}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      Activo
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
