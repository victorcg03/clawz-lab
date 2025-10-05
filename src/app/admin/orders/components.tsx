/**
 * @fileoverview Order-specific components for admin panel
 * @author Clawz Lab Team
 * @version 1.0.0
 */

'use client';

import { Button } from '@/components/layout/ui/Button';
import { StatusBadge } from '@/components/admin/AdminTable';

/**
 * Order data interface
 */
export interface OrderData {
  id: string;
  status: string;
  total: number;
  shipping_address?: Record<string, unknown>;
  notes?: string;
  created_at: string;
  profiles?: {
    id: string;
    full_name?: string;
  };
}

/**
 * Order ID cell component
 */
export function OrderIdCell({ order }: Readonly<{ order: OrderData }>) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
    </div>
  );
}

/**
 * Customer cell component
 */
export function CustomerCell({ order }: Readonly<{ order: OrderData }>) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">
        {order.profiles?.full_name || 'Cliente desconocido'}
      </span>
      <span className="text-sm text-gray-500">
        ID: {order.profiles?.id?.slice(0, 8) || 'N/A'}
      </span>
    </div>
  );
}

/**
 * Total cell component
 */
export function TotalCell({ order }: Readonly<{ order: OrderData }>) {
  return <span className="font-medium">${order.total.toFixed(2)}</span>;
}

/**
 * Status cell component
 */
export function OrderStatusCell({ order }: Readonly<{ order: OrderData }>) {
  return <StatusBadge status={order.status} />;
}

/**
 * Date cell component
 */
export function DateCell({ order }: Readonly<{ order: OrderData }>) {
  return (
    <span className="text-sm">
      {new Date(order.created_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}
    </span>
  );
}

/**
 * Order actions component
 */
export function OrderActions({ order }: Readonly<{ order: OrderData }>) {
  const handleViewOrder = () => {
    console.log('View order:', order.id);
    // Navigate to order details page
    window.location.href = `/admin/orders/${order.id}`;
  };

  const handleUpdateStatus = () => {
    console.log('Update status for order:', order.id);
    // Open status update modal (placeholder for future implementation)
    alert(`Actualizar estado del pedido ${order.id}`);
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleViewOrder}>
        Ver
      </Button>
      <Button size="sm" variant="outline" onClick={handleUpdateStatus}>
        Estado
      </Button>
    </div>
  );
}
