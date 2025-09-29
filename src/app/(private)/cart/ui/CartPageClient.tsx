'use client';

import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/layout/ui/Button';
import {
  updateCartItemAction,
  removeCartItemAction,
  clearCartAction,
} from '@/lib/cart/actions';

interface CartPageClientProps {
  cart: {
    id: string;
    cart_items: {
      id: string;
      qty: number;
      size_profile_id?: string;
      custom_sizes?: Record<string, number>;
      product_variants: {
        id: string;
        sku: string;
        price: number;
        shape: string;
        length: string;
        finish: string;
        colorway: string;
        images: string[];
        products: {
          id: string;
          slug: string;
          name_i18n: Record<string, string>;
          description_i18n: Record<string, string>;
        }[];
      }[];
      size_profiles?: {
        id: string;
        name: string;
      }[];
    }[];
  } | null;
}

export function CartPageClient({ cart }: Readonly<CartPageClientProps>) {
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

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      startTransition(async () => {
        await clearCartAction();
      });
    }
  };

  if (!cart || cart.cart_items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="w-16 h-16 text-metal-400 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-metal-700 mb-4">
          Tu carrito está vacío
        </h2>
        <p className="text-metal-600 mb-8">
          Descubre nuestros productos y añade algunos a tu carrito
        </p>
        <Link href="/shop">
          <Button variant="primary" size="lg">
            Ir a la Tienda
          </Button>
        </Link>
      </div>
    );
  }

  const total = cart.cart_items.reduce(
    (sum, item) => sum + (item.product_variants[0]?.price || 0) * item.qty,
    0,
  );

  const itemCount = cart.cart_items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Lista de productos */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-metal-900">
            Productos ({itemCount})
          </h2>
          {cart.cart_items.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearCart}
              disabled={isPending}
              className="text-red-600 hover:text-red-700"
            >
              Vaciar carrito
            </Button>
          )}
        </div>

        {cart.cart_items.map((item) => {
          const variant = item.product_variants[0];
          const product = variant?.products[0];
          const sizeProfile = item.size_profiles?.[0];

          if (!variant || !product) return null;

          return (
            <div
              key={item.id}
              className="bg-surface-card rounded-lg p-6 border border-metal-200/20 shadow-sm"
            >
              <div className="flex gap-6">
                {/* Imagen del producto */}
                <div className="w-24 h-24 bg-metal-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {variant.images && variant.images.length > 0 ? (
                    <Image
                      src={variant.images[0]}
                      alt={product.name_i18n.es || 'Producto'}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-metal-400">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className="flex-1">
                  <h3 className="font-semibold text-metal-900 mb-2">
                    {product.name_i18n.es || 'Producto sin nombre'}
                  </h3>

                  <div className="text-sm text-metal-600 space-y-1 mb-4">
                    <p>SKU: {variant.sku}</p>
                    <p>Forma: {variant.shape}</p>
                    <p>Longitud: {variant.length}</p>
                    <p>Acabado: {variant.finish}</p>
                    {variant.colorway && <p>Color: {variant.colorway}</p>}
                    {sizeProfile && <p>Medidas: {sizeProfile.name}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}
                        disabled={isPending || item.qty <= 1}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <span className="w-8 text-center font-medium">{item.qty}</span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                        disabled={isPending}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-metal-900">
                        €{(variant.price * item.qty).toFixed(2)}
                      </p>
                      <p className="text-sm text-metal-600">
                        €{variant.price.toFixed(2)} cada uno
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen del pedido */}
      <div className="lg:col-span-1">
        <div className="bg-surface-card rounded-lg p-6 border border-metal-200/20 shadow-sm sticky top-20">
          <h2 className="text-xl font-semibold text-metal-900 mb-6">
            Resumen del Pedido
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-metal-600">
              <span>Subtotal ({itemCount} artículos)</span>
              <span>€{total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-metal-600">
              <span>Envío</span>
              <span>Calculado en el checkout</span>
            </div>

            <hr className="border-metal-200" />

            <div className="flex justify-between text-lg font-semibold text-metal-900">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mb-4"
            disabled={isPending}
            onClick={() => {
              window.location.href = '/checkout';
            }}
          >
            Proceder al Pago
          </Button>

          <Link href="/shop">
            <Button variant="outline" className="w-full">
              Seguir Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
