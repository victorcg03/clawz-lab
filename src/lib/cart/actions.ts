'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';

async function getUserId() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  return user.id;
}

// Helper function to verify cart item ownership
async function verifyCartItemOwnership(itemId: string, userId: string) {
  const supabase = await supabaseServer();

  const { data: cartItem } = await supabase
    .from('cart_items')
    .select(
      `
      id,
      carts!inner (user_id)
    `,
    )
    .eq('id', itemId)
    .single();

  if (!cartItem || !Array.isArray(cartItem.carts) || cartItem.carts.length === 0) {
    return { valid: false, error: 'Item no encontrado' };
  }

  const cart = cartItem.carts[0] as { user_id: string };
  if (cart.user_id !== userId) {
    return { valid: false, error: 'Item no encontrado' };
  }

  return { valid: true };
}

async function getOrCreateCart(userId: string) {
  const supabase = await supabaseServer();

  // Buscar carrito activo existente
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'cart')
    .single();

  // Si no existe, crear uno nuevo
  if (!cart) {
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({
        user_id: userId,
        status: 'cart',
      })
      .select('id')
      .single();

    if (error) throw error;
    cart = newCart;
  }

  return cart.id;
}

export async function addToCartAction(
  variantId: string,
  quantity: number = 1,
  sizeProfileId?: string,
  customSizes?: Record<string, number>,
) {
  try {
    const userId = await getUserId();
    const cartId = await getOrCreateCart(userId);
    const supabase = await supabaseServer();

    // Verificar si el item ya existe en el carrito
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, qty')
      .eq('cart_id', cartId)
      .eq('variant_id', variantId)
      .single();

    if (existingItem) {
      // Actualizar cantidad
      const { error } = await supabase
        .from('cart_items')
        .update({
          qty: existingItem.qty + quantity,
        })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      // Crear nuevo item
      const { error } = await supabase.from('cart_items').insert({
        cart_id: cartId,
        variant_id: variantId,
        qty: quantity,
        size_profile_id: sizeProfileId || null,
        custom_sizes: customSizes || null,
      });

      if (error) throw error;
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Add to cart error:', error);
    return { error: 'Error al añadir al carrito' };
  }
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  try {
    const userId = await getUserId();
    const supabase = await supabaseServer();

    if (quantity <= 0) {
      return removeCartItemAction(itemId);
    }

    // Verificar que el item pertenece al usuario
    const ownership = await verifyCartItemOwnership(itemId, userId);
    if (!ownership.valid) {
      return { error: ownership.error };
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ qty: quantity })
      .eq('id', itemId);

    if (error) throw error;

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Update cart item error:', error);
    return { error: 'Error al actualizar el carrito' };
  }
}

export async function removeCartItemAction(itemId: string) {
  try {
    const userId = await getUserId();
    const supabase = await supabaseServer();

    // Verificar que el item pertenece al usuario
    const ownership = await verifyCartItemOwnership(itemId, userId);
    if (!ownership.valid) {
      return { error: ownership.error };
    }

    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);

    if (error) throw error;

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Remove cart item error:', error);
    return { error: 'Error al eliminar del carrito' };
  }
}

export async function getCartAction() {
  try {
    const userId = await getUserId();
    const supabase = await supabaseServer();

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
      .eq('user_id', userId)
      .eq('status', 'cart')
      .single();

    return { cart: cart || null };
  } catch (error) {
    console.error('Get cart error:', error);
    return { cart: null };
  }
}

export async function clearCartAction() {
  try {
    const userId = await getUserId();
    const supabase = await supabaseServer();

    // Marcar carrito como abandonado en lugar de eliminar
    const { error } = await supabase
      .from('carts')
      .update({ status: 'abandoned' })
      .eq('user_id', userId)
      .eq('status', 'cart');

    if (error) throw error;

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Clear cart error:', error);
    return { error: 'Error al vaciar el carrito' };
  }
}
