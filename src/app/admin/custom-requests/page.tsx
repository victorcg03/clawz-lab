import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/layout/ui/Button';
import { AdminTable, StatusBadge } from '@/components/admin/AdminTable';
import type { Column } from '@/components/admin/AdminTable';

async function getCustomRequests() {
  const supabase = await supabaseServerReadonly();

  try {
    const { data: requests, error } = await supabase
      .from('custom_requests')
      .select(
        `
        id,
        contact_name,
        email,
        phone,
        shape,
        length,
        colors,
        finish,
        theme,
        brief,
        status,
        target_date,
        urgency,
        created_at
      `,
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching custom requests:', error);
      return { requests: [], error: error.message };
    }

    return { requests: requests || [], error: null };
  } catch (error) {
    console.error('Error fetching custom requests:', error);
    return { requests: [], error: 'Error inesperado' };
  }
}

function RequestActions({
  request,
}: Readonly<{ request: { id: string; status: string } }>) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <Button variant="outline" size="sm">
        Ver detalles
      </Button>
      {request.status === 'pending_quote' && <Button size="sm">Presupuestar</Button>}
    </div>
  );
}

export default async function AdminCustomRequestsPage() {
  const { requests, error } = await getCustomRequests();

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
      ready: {
        label: 'Listo',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      },
      shipped: {
        label: 'Enviado',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const formatUrgency = (urgency: string) => {
    const urgencyMap: Record<string, string> = {
      standard: 'Estándar',
      express: 'Express',
      urgent: 'Urgente',
    };
    return urgencyMap[urgency] || urgency;
  };

  const formatColors = (colors: unknown) => {
    if (Array.isArray(colors)) {
      return colors.join(', ');
    }
    return 'No especificado';
  };

  const getStatusVariant = (
    status: string,
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'accepted':
      case 'ready':
        return 'success';
      case 'pending_quote':
      case 'quoted':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'in_production':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns: Column<(typeof requests)[0]>[] = [
    {
      key: 'contact_name',
      label: 'Cliente',
      render: (_value, item) => (
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {item.contact_name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'shape',
      label: 'Diseño',
      render: (_value, item) => (
        <div className="text-sm">
          <div className="text-neutral-900 dark:text-neutral-100">
            {item.shape} • {item.length}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatColors(item.colors)}
          </div>
        </div>
      ),
    },
    {
      key: 'urgency',
      label: 'Urgencia',
      render: (value) => {
        const urgencyStr = typeof value === 'string' ? value : 'standard';
        const getUrgencyVariant = (): 'success' | 'warning' | 'error' => {
          if (urgencyStr === 'urgent') return 'error';
          if (urgencyStr === 'express') return 'warning';
          return 'success';
        };

        return (
          <StatusBadge status={formatUrgency(urgencyStr)} variant={getUrgencyVariant()} />
        );
      },
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
      key: 'target_date',
      label: 'Fecha objetivo',
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
          Encargos personalizados
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Gestiona las solicitudes de encargos personalizados
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error al cargar encargos: {error}
          </p>
        </div>
      )}

      {/* Requests table */}
      <AdminTable
        data={requests}
        columns={columns}
        emptyMessage="No hay encargos. Las solicitudes de encargos personalizados aparecerán aquí."
        actions={(request) => <RequestActions request={request} />}
      />
    </div>
  );
}
