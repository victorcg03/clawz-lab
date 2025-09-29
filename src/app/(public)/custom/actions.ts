'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import { customRequestSchema, type CustomRequestData } from './schema';

export async function createCustomRequestAction(data: CustomRequestData) {
  try {
    // Validar datos
    const validatedData = customRequestSchema.parse(data);

    const supabase = await supabaseServer();

    // Obtener usuario actual (puede ser null para usuarios anónimos)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Crear el encargo personalizado
    const { data: customRequest, error } = await supabase
      .from('custom_requests')
      .insert({
        user_id: user?.id || null,
        contact_name: validatedData.contact_name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        shape: validatedData.shape,
        length: validatedData.length,
        colors: validatedData.colors,
        finish: validatedData.finish,
        theme: validatedData.theme || null,
        extras: validatedData.extras,
        target_date: validatedData.target_date
          ? new Date(validatedData.target_date)
          : null,
        urgency: validatedData.urgency,
        brief: validatedData.brief,
        measurement: {
          size_profile_id: validatedData.size_profile_id || null,
          custom_sizes: validatedData.custom_sizes || null,
        },
        communication_preference: validatedData.communication_preference,
        status: 'pending_quote',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating custom request:', error);
      return { error: 'Error al crear la solicitud. Intenta de nuevo.' };
    }

    // Si hay URLs de inspiración, crearlas
    if (validatedData.inspiration_urls.length > 0) {
      const mediaInserts = validatedData.inspiration_urls.map((url) => ({
        request_id: customRequest.id,
        file_url: url,
        kind: 'url',
        title: 'Inspiración',
      }));

      const { error: mediaError } = await supabase
        .from('custom_request_media')
        .insert(mediaInserts);

      if (mediaError) {
        console.error('Error creating inspiration URLs:', mediaError);
        // No fallar por esto, continuar
      }
    }

    // Log de auditoría
    await supabase.from('audit_logs').insert({
      entity: 'custom_request',
      entity_id: customRequest.id,
      action: 'created',
      actor_id: user?.id || null,
      meta: {
        contact_name: validatedData.contact_name,
        email: validatedData.email,
        shape: validatedData.shape,
        length: validatedData.length,
      },
    });

    revalidatePath('/custom');

    return { success: true, requestId: customRequest.id };
  } catch (error) {
    console.error('Custom request creation error:', error);
    return { error: 'Error inesperado. Intenta de nuevo.' };
  }
}

export async function uploadInspirationImageAction(requestId: string, file: File) {
  try {
    const supabase = await supabaseServer();

    // Verificar que el request existe y el usuario tiene acceso
    const { data: request, error: requestError } = await supabase
      .from('custom_requests')
      .select('id, user_id, email')
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      return { error: 'Solicitud no encontrada' };
    }

    // Obtener usuario actual
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Verificar permisos (usuario logueado debe ser el dueño, o email debe coincidir)
    if (user && request.user_id !== user.id) {
      return { error: 'No tienes permisos para subir archivos a esta solicitud' };
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${requestId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Subir archivo al bucket privado custom-media
    const { error: uploadError } = await supabase.storage
      .from('custom-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: 'Error al subir la imagen. Intenta de nuevo.' };
    }

    // Obtener URL del archivo
    const {
      data: { publicUrl },
    } = supabase.storage.from('custom-media').getPublicUrl(fileName);

    // Guardar referencia en la base de datos
    const { error: dbError } = await supabase.from('custom_request_media').insert({
      request_id: requestId,
      file_url: publicUrl,
      kind: 'image',
      title: file.name,
    });

    if (dbError) {
      console.error('Database error:', dbError);
      // Intentar eliminar el archivo subido
      await supabase.storage.from('custom-media').remove([fileName]);

      return { error: 'Error al guardar la referencia de la imagen' };
    }

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload inspiration image error:', error);
    return { error: 'Error inesperado al subir la imagen' };
  }
}

export async function getUserSizeProfiles() {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { profiles: [] };
    }

    const { data: profiles, error } = await supabase
      .from('size_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching size profiles:', error);
      return { profiles: [] };
    }

    return { profiles: profiles || [] };
  } catch (error) {
    console.error('Get user size profiles error:', error);
    return { profiles: [] };
  }
}
