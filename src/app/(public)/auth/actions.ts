'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './schema';
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './schema';

export async function loginAction(input: LoginInput) {
  const supabase = await supabaseServer();

  // Validación del lado del servidor
  const validatedFields = loginSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: 'Datos inválidos',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === 'Invalid login credentials'
          ? 'Credenciales inválidas'
          : 'Error al iniciar sesión. Intenta de nuevo.',
    };
  }

  // Insert audit log for successful login (now we should have a session cookies set)
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (userId) {
      await supabase.from('audit_logs').insert({
        entity: 'user',
        entity_id: userId,
        action: 'login',
        actor_id: userId,
        meta: { method: 'password' },
      });
    }
  } catch (e) {
    console.warn('[audit] could not record login event', e);
  }

  // Evitamos redirect() desde server action porque el cliente la invoca imperativamente
  // y el redirect lanza una excepción controlada que el cliente interpreta como error.
  return { success: true } as const;
}

export async function registerAction(input: RegisterInput) {
  const supabase = await supabaseServer();

  // Validación del lado del servidor
  const validatedFields = registerSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: 'Datos inválidos',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, phone } = validatedFields.data;

  // Registrar usuario
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone,
      },
    },
  });

  if (authError) {
    return {
      error:
        authError.message === 'User already registered'
          ? 'Este email ya está registrado'
          : 'Error al crear la cuenta. Intenta de nuevo.',
    };
  }

  if (!authData.user) {
    return {
      error: 'Error al crear la cuenta. Intenta de nuevo.',
    };
  }

  // El perfil se crea automáticamente via trigger de base de datos

  // Marcar registro reciente con cookie efímera (para /register/success)
  try {
    const cookieStore = await cookies();
    cookieStore.set('just_registered', '1', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 5, // 5 minutos
    });
  } catch (e) {
    console.warn('[auth] could not set just_registered cookie', e);
  }

  return {
    success: true,
    message: 'Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.',
  };
}

export async function forgotPasswordAction(input: ForgotPasswordInput) {
  const supabase = await supabaseServer();

  // Validación del lado del servidor
  const validatedFields = forgotPasswordSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: 'Email inválido',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return {
      error: 'Error al enviar el email. Intenta de nuevo.',
    };
  }

  return {
    success: true,
    message: 'Te hemos enviado un link para restablecer tu contraseña.',
  };
}

export async function resetPasswordAction(input: ResetPasswordInput) {
  const supabase = await supabaseServer();

  // Validación del lado del servidor
  const validatedFields = resetPasswordSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: 'Datos inválidos',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { password } = validatedFields.data;

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      error: 'Error al actualizar la contraseña. Intenta de nuevo.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logoutAction() {
  const supabase = await supabaseServer();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error);
    // En caso de error, aún así redirigimos al login
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}
