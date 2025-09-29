import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { CartPageClient } from './ui/CartPageClient';

async function getCartData() {
  const supabase = await supabaseServerReadonly();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/cart');
  }

  const { data: cart } = await supabase
    .from('carts')
    .select(
      `
      id,
      status,
      created_at,
      cart_items (
        id,
        qty,
        size_profile_id,
        custom_sizes,
        product_variants (
          id,
          sku,
          price,
          shape,
          length,
          finish,
          colorway,
          images,
          stock,
          active,
          products (
            id,
            slug,
            name_i18n,
            description_i18n
          )
        ),
        size_profiles (
          id,
          name
        )
      )
    `,
    )
    .eq('user_id', user.id)
    .eq('status', 'cart')
    .single();

  return { cart, user };
}

function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-metal-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-card rounded-lg p-6 border border-metal-200/20"
            >
              <div className="flex gap-4">
                <div className="h-20 w-20 bg-metal-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-metal-200 rounded w-3/4"></div>
                  <div className="h-3 bg-metal-200 rounded w-1/2"></div>
                  <div className="h-4 bg-metal-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-metal-900 mb-8">Tu Carrito</h1>

        <Suspense fallback={<CartLoading />}>
          <CartContent />
        </Suspense>
      </div>
    </div>
  );
}

async function CartContent() {
  const { cart } = await getCartData();

  return <CartPageClient cart={cart} />;
}
