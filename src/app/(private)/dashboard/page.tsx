import { Suspense } from 'react';
import Link from 'next/link';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';

async function getDashboardData() {
  const supabase = await supabaseServerReadonly();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Obtener datos del usuario
  const [
    { data: profile },
    { data: customRequests },
    { data: orders },
    { data: sizeProfiles },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),

    supabase
      .from('custom_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),

    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),

    supabase.from('size_profiles').select('*').eq('user_id', user.id),
  ]);

  return {
    profile,
    customRequests: customRequests || [],
    orders: orders || [],
    sizeProfiles: sizeProfiles || [],
  };
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const data = await getDashboardData();

  if (!data) {
    return <div>Error loading dashboard data</div>;
  }

  const { profile, customRequests, orders, sizeProfiles } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_quote':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'in_production':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-emerald-100 text-emerald-800';
      case 'shipped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Hola, {profile?.name || 'Usuario'}!
        </h1>
        <p className="text-gray-600">Bienvenida a tu panel de control personal</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/custom"
          className="group p-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Nuevo Encargo</h3>
              <p className="text-pink-100 text-sm">Diseña tus uñas personalizadas</p>
            </div>
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </Link>

        <Link
          href="/shop"
          className="group p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Catálogo</h3>
              <p className="text-blue-100 text-sm">Explora nuestros diseños</p>
            </div>
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </Link>

        <Link
          href="/measure"
          className="group p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Mis Medidas</h3>
              <p className="text-emerald-100 text-sm">
                {sizeProfiles.length > 0
                  ? `${sizeProfiles.length} perfiles`
                  : 'Agregar medidas'}
              </p>
            </div>
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Custom Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Encargos Recientes</h2>
            <Link
              href="/custom-requests"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Ver todos
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {customRequests.length > 0 ? (
              customRequests.map((request) => (
                <div key={request.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      Encargo #{request.id.slice(-6)}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {request.description?.slice(0, 100)}...
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(request.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay encargos
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza creando tu primer diseño personalizado
                </p>
                <div className="mt-6">
                  <Button variant="primary" size="sm">
                    <Link href="/custom">Nuevo Encargo</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h2>
            <Link
              href="/orders"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Ver todos
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      Pedido #{order.id.slice(-6)}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">${order.total_amount}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Explora nuestro catálogo y haz tu primer pedido
                </p>
                <div className="mt-6">
                  <Button variant="primary" size="sm">
                    <Link href="/shop">Ver Catálogo</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
