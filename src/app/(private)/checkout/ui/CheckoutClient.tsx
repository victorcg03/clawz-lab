'use client';

import { useState } from 'react';
import { Button } from '@/components/layout/ui/Button';

interface CheckoutClientProps {
  cart: {
    id: string;
    cart_items: {
      id: string;
      qty: number;
      product_variants: {
        id: string;
        sku: string;
        price: number;
        products: {
          name_i18n: Record<string, string>;
        }[];
      }[];
    }[];
  };
  profile: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  } | null;
}

export function CheckoutClient({ cart, profile }: Readonly<CheckoutClientProps>) {
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.cart_items.reduce(
    (sum, item) => sum + (item.product_variants[0]?.price || 0) * item.qty,
    0,
  );

  const itemCount = cart.cart_items.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Checkout implementation will be completed in future iterations
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Placeholder for checkout completion
    alert(
      'Pedido procesado con éxito! Se implementará la lógica completa en futuras iteraciones.',
    );
    setIsProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Información de envío */}
      <div className="space-y-6">
        <div className="bg-surface-card rounded-lg p-6 border border-metal-200/20">
          <h2 className="text-xl font-semibold text-metal-900 mb-4">
            Información de Envío
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-metal-700 mb-2"
              >
                Nombre Completo
              </label>
              <input
                id="name"
                type="text"
                defaultValue={profile?.name || ''}
                className="w-full px-3 py-2 border border-metal-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-metal-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue={profile?.email || ''}
                className="w-full px-3 py-2 border border-metal-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-metal-700 mb-2"
              >
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                defaultValue={profile?.phone || ''}
                className="w-full px-3 py-2 border border-metal-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-metal-700 mb-2"
              >
                Dirección
              </label>
              <textarea
                id="address"
                defaultValue={profile?.address || ''}
                rows={3}
                className="w-full px-3 py-2 border border-metal-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Método de pago */}
        <div className="bg-surface-card rounded-lg p-6 border border-metal-200/20">
          <h2 className="text-xl font-semibold text-metal-900 mb-4">Método de Pago</h2>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="card"
                defaultChecked
                className="text-blue-600"
              />
              <span className="text-metal-700">Tarjeta de Crédito/Débito</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="paypal"
                className="text-blue-600"
              />
              <span className="text-metal-700">PayPal</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="transfer"
                className="text-blue-600"
              />
              <span className="text-metal-700">Transferencia Bancaria</span>
            </label>
          </div>
        </div>
      </div>

      {/* Resumen del pedido */}
      <div className="space-y-6">
        <div className="bg-surface-card rounded-lg p-6 border border-metal-200/20">
          <h2 className="text-xl font-semibold text-metal-900 mb-4">
            Resumen del Pedido
          </h2>

          <div className="space-y-4 mb-6">
            {cart.cart_items.map((item) => {
              const variant = item.product_variants[0];
              const product = variant?.products[0];

              if (!variant || !product) return null;

              return (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-metal-900">
                      {product.name_i18n.es || 'Producto'}
                    </p>
                    <p className="text-sm text-metal-600">
                      Cantidad: {item.qty} × €{variant.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-metal-900">
                    €{(variant.price * item.qty).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <hr className="border-metal-200 mb-4" />

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-metal-600">
              <span>Subtotal ({itemCount} artículos)</span>
              <span>€{total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-metal-600">
              <span>Envío</span>
              <span>€0.00</span>
            </div>

            <div className="flex justify-between text-metal-600">
              <span>IVA (21%)</span>
              <span>€{(total * 0.21).toFixed(2)}</span>
            </div>

            <hr className="border-metal-200" />

            <div className="flex justify-between text-lg font-semibold text-metal-900">
              <span>Total</span>
              <span>€{(total * 1.21).toFixed(2)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Finalizar Pedido'}
          </Button>
        </div>
      </div>
    </div>
  );
}
