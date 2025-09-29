import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';

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

  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'urgent')
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    if (urgency === 'express')
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

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
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {requests.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m4 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m4 0v4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No hay encargos
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Las solicitudes de encargos personalizados aparecerán aquí
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {requests.length} {requests.length === 1 ? 'encargo' : 'encargos'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Especificaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Urgencia
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
                  {requests.map((request) => {
                    const statusInfo = formatStatus(request.status);
                    return (
                      <tr
                        key={request.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {request.contact_name}
                            </p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                              {request.email}
                            </p>
                            {request.phone && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                                {request.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-neutral-900 dark:text-neutral-100">
                              {request.shape} • {request.length}
                            </p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                              {formatColors(request.colors)}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                              {request.finish}
                            </p>
                            {request.theme && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                                Tema: {request.theme}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}
                          >
                            {formatUrgency(request.urgency)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <p>
                            {new Date(request.created_at).toLocaleDateString('es-ES')}
                          </p>
                          {request.target_date && (
                            <p className="text-xs text-neutral-500">
                              Objetivo:{' '}
                              {new Date(request.target_date).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="outline" className="text-xs px-2 py-1">
                              Ver detalles
                            </Button>
                            {request.status === 'pending_quote' && (
                              <Button variant="primary" className="text-xs px-2 py-1">
                                Presupuestar
                              </Button>
                            )}
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
