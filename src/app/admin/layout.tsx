import Link from 'next/link';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function checkAdminAccess() {
  const supabase = await supabaseServerReadonly();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/');
  }

  return { user, profile };
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
  },
  {
    name: 'Productos',
    href: '/admin/products',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10',
  },
  {
    name: 'Encargos',
    href: '/admin/custom-requests',
    icon: 'M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m4 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m4 0v4',
  },
  {
    name: 'Pedidos',
    href: '/admin/orders',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  },
];

interface Props {
  readonly children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  await checkAdminAccess();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Panel Admin
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Gestión de la tienda
            </p>
          </div>

          <nav className="px-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Administración
              </h2>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Volver a la tienda
                </Link>
              </div>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
