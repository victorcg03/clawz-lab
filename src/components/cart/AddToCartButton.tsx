'use client';

import { ShoppingCart, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Button } from '@/components/layout/ui/Button';
import { addToCartAction } from '@/lib/cart/actions';

interface AddToCartButtonProps {
  productVariantId: string;
  sizeProfileId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customSizes?: any;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function AddToCartButton({
  productVariantId,
  sizeProfileId,
  customSizes,
  className,
  showIcon = true,
  children,
}: Readonly<AddToCartButtonProps>) {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addToCartAction(
        productVariantId,
        1,
        sizeProfileId,
        customSizes,
      );

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    });
  };

  if (showSuccess) {
    return (
      <Button variant="outline" disabled className={className}>
        <Plus className="w-4 h-4 mr-2 text-green-600" />
        ¡Añadido!
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending}
      className={className}
      variant="primary"
    >
      {showIcon && <ShoppingCart className="w-4 h-4 mr-2" />}
      {children || (isPending ? 'Añadiendo...' : 'Añadir al carrito')}
    </Button>
  );
}
