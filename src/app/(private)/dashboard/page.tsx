import { Suspense } from 'react';
import Link from 'next/link';
import ClientToast from './ui/ClientToast';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/layout/ui/Button';

// Esta página usa cookies (sesión) y no puede ser prerenderizada de forma estática
export const dynamic = 'force-dynamic';

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
    <main className="p-8 space-y-6 max-w-6xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-64"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
            ></div>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-64 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"></div>
          <div className="h-64 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"></div>
        </div>
      </div>
    </main>
  );
}

async function DashboardContent() {
  const data = await getDashboardData().catch((err) => {
    console.error('[dashboard] getDashboardData failed', err);
    return null;
  });

  if (!data) {
    return (
      <main className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <ClientToast message="No se pudo cargar tu panel" />
        <h1 className="text-xl font-semibold">No se pudo cargar tu panel</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Puede que tu sesión haya expirado o haya un problema temporal.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login?redirect=/dashboard"
            className="btn-base btn-outline h-10 px-5 text-sm"
          >
            Iniciar sesión de nuevo
          </Link>
          <Link href="/" className="btn-base btn-subtle h-10 px-5 text-sm">
            Ir al inicio
          </Link>
        </div>
      </main>
    );
  }

  const { profile, customRequests, orders, sizeProfiles } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_quote':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'quoted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'in_production':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'shipped':
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  return (
    <main className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          ¡Hola, {profile?.full_name || 'Usuario'}!
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Bienvenida a tu panel de control personal
        </p>
      </header>

      {/* Quick Actions */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: 'Nuevo Encargo',
            desc: 'Diseña tus uñas personalizadas',
            href: '/custom',
            icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
          },
          {
            title: 'Catálogo',
            desc: 'Explora nuestros diseños',
            href: '/shop',
            icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
          },
          {
            title: 'Mis Medidas',
            desc:
              sizeProfiles.length > 0
                ? `${sizeProfiles.length} perfiles`
                : 'Agregar medidas',
            href: '/measure',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group surface-card p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {card.desc}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={card.icon}
                />
              </svg>
            </div>
          </Link>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Custom Requests */}
        <div className="surface-card overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="text-sm font-medium">Encargos Recientes</h2>
            <Link
              href="/custom-requests"
              className="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {customRequests.length > 0 ? (
              customRequests.map((request) => (
                <div key={request.id} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xs font-medium">
                      Encargo #{request.id.slice(-6)}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  {request.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
                      {request.description.slice(0, 80)}...
                    </p>
                  )}
                  <p className="text-xs text-neutral-500">
                    {new Date(request.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <svg
                  className="mx-auto h-8 w-8 text-neutral-400 mb-2"
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
                <h3 className="text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                  No hay encargos
                </h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Comienza creando tu primer diseño personalizado
                </p>
                <Link href="/custom">
                  <Button variant="primary" size="sm">
                    Nuevo Encargo
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="surface-card overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="text-sm font-medium">Pedidos Recientes</h2>
            <Link
              href="/orders"
              className="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xs font-medium">Pedido #{order.id.slice(-6)}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      ${order.total}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(order.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <svg
                  className="mx-auto h-8 w-8 text-neutral-400 mb-2"
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
                <h3 className="text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                  No hay pedidos
                </h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Explora nuestro catálogo y haz tu primer pedido
                </p>
                <Link href="/shop">
                  <Button variant="primary" size="sm">
                    Ver Catálogo
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
