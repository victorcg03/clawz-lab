'use client';

import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useTransition } from 'react';
import { Button } from '@/components/layout/ui/Button';
import { updateCartItemAction, removeCartItemAction } from '@/lib/cart/actions';
import { cn } from '@/lib/cn';

interface CartDrawerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart: any;
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ cart, isOpen, onClose }: Readonly<CartDrawerProps>) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    startTransition(async () => {
      await updateCartItemAction(itemId, newQty);
    });
  };

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      await removeCartItemAction(itemId);
    });
  };

  const total =
    cart?.cart_items.reduce(
      (sum: number, item: { product_variants: { price: number }[]; qty: number }) =>
        sum + item.product_variants[0]?.price * item.qty,
      0,
    ) || 0;

  const itemCount =
    cart?.cart_items.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0) ||
    0;

  return (
    <>
      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-screen w-full max-w-md z-50',
          'bg-white dark:bg-neutral-900 backdrop-blur-xl',
          'transform transition-transform duration-300 ease-in-out',
          'border-l border-neutral-300/20 shadow-2xl',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-neutral-300/20">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Carrito ({itemCount})
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {!cart || cart.cart_items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div>
                <ShoppingCart className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                  Tu carrito está vacío
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  Agrega algunos productos para comenzar
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.cart_items.map(
                  (item: {
                    id: string;
                    qty: number;
                    product_variants: {
                      sku: string;
                      price: number;
                      products: { name_i18n: { es: string } }[];
                    }[];
                    size_profiles?: { name: string }[];
                  }) => (
                    <div
                      key={item.id}
                      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-lg p-4 border border-neutral-200/20 dark:border-neutral-700/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                            {item.product_variants[0]?.products[0]?.name_i18n?.es ||
                              'Producto'}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                            SKU: {item.product_variants[0]?.sku || 'N/A'}
                          </p>
                          {item.size_profiles?.[0] && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                              Medidas: {item.size_profiles[0].name}
                            </p>
                          )}
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            €{(item.product_variants[0]?.price || 0).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}
                            disabled={isPending || item.qty <= 1}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="w-8 text-center text-sm font-medium">
                            {item.qty}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                            disabled={isPending}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-neutral-300/20 dark:border-neutral-700/20 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Total
                  </span>
                  <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    €{total.toFixed(2)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => {
                    window.location.href = '/checkout';
                  }}
                >
                  Proceder al Pago
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
