import { supabaseServerReadonly } from '@/lib/supabase/server';
import { AdminTable, StatusBadge } from '@/components/admin/AdminTable';
import type { Column } from '@/components/admin/AdminTable';
import { Button } from '@/components/layout/ui/Button';

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

function OrderActions({ order }: Readonly<{ order: { id: string; status: string } }>) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <Button variant="outline" size="sm">
        Ver detalles
      </Button>
      {order.status !== 'delivered' && order.status !== 'cancelled' && (
        <Button size="sm">Actualizar estado</Button>
      )}
    </div>
  );
}

function renderOrderActions(order: { id: string; status: string }) {
  return <OrderActions order={order} />;
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

  const getStatusVariant = (
    status: string,
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'paid':
      case 'delivered':
        return 'success';
      case 'placed':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'in_production':
      case 'shipped':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns: Column<(typeof orders)[0]>[] = [
    {
      key: 'id',
      label: 'Pedido',
      render: (value) => (
        <span className="text-sm font-mono text-neutral-900 dark:text-neutral-100">
          #{typeof value === 'string' ? value.slice(-8) : ''}
        </span>
      ),
    },
    {
      key: 'profiles',
      label: 'Cliente',
      render: (_value, item) => (
        <span className="text-sm text-neutral-900 dark:text-neutral-100">
          {getCustomerName(item.profiles)}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (value) => (
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          €{typeof value === 'number' ? value.toFixed(2) : '0.00'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => {
        const statusStr = typeof value === 'string' ? value : '';
        const statusInfo = formatStatus(statusStr);
        return (
          <StatusBadge status={statusInfo.label} variant={getStatusVariant(statusStr)} />
        );
      },
    },
    {
      key: 'created_at',
      label: 'Fecha',
      render: (value) => (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {value && typeof value === 'string'
            ? new Date(value).toLocaleDateString('es-ES')
            : '-'}
        </span>
      ),
    },
  ];

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
      <AdminTable
        data={orders}
        columns={columns}
        emptyMessage="No hay pedidos. Los pedidos de la tienda aparecerán aquí."
        actions={renderOrderActions}
      />
    </div>
  );
}
