import { redirect } from 'next/navigation';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { CheckoutClient } from './ui/CheckoutClient';

async function getCheckoutData() {
  const supabase = await supabaseServerReadonly();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get cart
  const { data: cart } = await supabase
    .from('carts')
    .select(
      `
      id,
      cart_items (
        id,
        qty,
        product_variants (
          id,
          sku,
          price,
          products (
            name_i18n
          )
        )
      )
    `,
    )
    .eq('user_id', user.id)
    .eq('status', 'cart')
    .single();

  // If no cart or empty cart, redirect to cart
  if (!cart || cart.cart_items.length === 0) {
    redirect('/cart');
  }

  return { cart, profile, user };
}

export default async function CheckoutPage() {
  const { cart, profile } = await getCheckoutData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-metal-900 mb-8">Checkout</h1>
        <CheckoutClient cart={cart} profile={profile} />
      </div>
    </div>
  );
}
