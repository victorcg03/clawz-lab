'use client';

import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/layout/ui/Button';
import { CartDrawer } from './CartDrawer';
import { getCartAction } from '@/lib/cart/actions';
import { cn } from '@/lib/cn';

export function CartIcon() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cart, setCart] = useState<{ cart_items: { qty: number }[] } | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = async () => {
    try {
      const result = await getCartAction();
      if (result.cart) {
        setCart(result.cart);
        const count = result.cart.cart_items.reduce(
          (sum: number, item: { qty: number }) => sum + item.qty,
          0,
        );
        setItemCount(count);
      } else {
        setCart(null);
        setItemCount(0);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart(null);
      setItemCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Reload cart when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      loadCart();
    }
  }, [isDrawerOpen]);

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleDrawer}
        disabled={isLoading}
        className="relative hover:bg-metal-100"
        aria-label={`Carrito de compras (${itemCount} artículos)`}
      >
        <ShoppingCart className="w-5 h-5 text-metal-700" />
        {itemCount > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1 min-w-[18px] h-[18px]',
              'bg-red-500 text-white text-xs font-medium',
              'rounded-full flex items-center justify-center',
              'shadow-lg border border-red-600',
            )}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Button>

      <CartDrawer
        cart={cart}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
