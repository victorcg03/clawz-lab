import { z } from 'zod';

// Paso 1: Información de contacto
export const contactSchema = z.object({
  contact_name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{9}$/.test(val), {
      message: 'El teléfono debe tener exactamente 9 dígitos',
    }),
  communication_preference: z.enum(['email', 'phone', 'whatsapp']).default('email'),
});

export type ContactData = z.infer<typeof contactSchema>;

// Paso 2: Diseño
export const designSchema = z.object({
  shape: z
    .enum(['coffin', 'almond', 'square', 'round', 'stiletto', 'ballerina'])
    .refine((val) => val, 'Selecciona una forma'),
  length: z
    .enum(['short', 'medium', 'long', 'extra_long'])
    .refine((val) => val, 'Selecciona un largo'),
  colors: z
    .array(z.string())
    .min(1, 'Selecciona al menos un color')
    .max(5, 'Máximo 5 colores'),
  finish: z
    .enum(['matte', 'glossy', 'chrome', 'holographic', 'textured'])
    .refine((val) => val, 'Selecciona un acabado'),
  theme: z.string().optional(),
  extras: z
    .array(z.enum(['rhinestones', 'charms', 'glitter', 'foil', 'hand_painted']))
    .default([]),
  target_date: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      return date >= today;
    }, 'La fecha no puede ser anterior a hoy'),
  urgency: z.enum(['standard', 'express', 'urgent']).default('standard'),
});

export type DesignData = z.infer<typeof designSchema>;

// Paso 3: Descripción
export const descriptionSchema = z.object({
  brief: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
});

export type DescriptionData = z.infer<typeof descriptionSchema>;

// Paso 4: Inspiración
export const inspirationSchema = z.object({
  inspiration_urls: z
    .array(z.string().url('URL inválida').or(z.literal('')))
    .max(5, 'Máximo 5 enlaces')
    .default([])
    .transform((urls) => urls.filter(url => url.length > 0)), // Remove empty strings
  // Las imágenes se manejan por separado con FileList
});

export type InspirationData = z.infer<typeof inspirationSchema>;

// Paso 5: Medidas
export const measurementSchema = z.object({
  size_profile_id: z.string().uuid().optional(),
  custom_sizes: z
    .object({
      left_thumb: z.number().min(1).max(30).optional(),
      left_index: z.number().min(1).max(30).optional(),
      left_middle: z.number().min(1).max(30).optional(),
      left_ring: z.number().min(1).max(30).optional(),
      left_pinky: z.number().min(1).max(30).optional(),
      right_thumb: z.number().min(1).max(30).optional(),
      right_index: z.number().min(1).max(30).optional(),
      right_middle: z.number().min(1).max(30).optional(),
      right_ring: z.number().min(1).max(30).optional(),
      right_pinky: z.number().min(1).max(30).optional(),
    })
    .optional(),
  skip_measurements: z.boolean().default(false),
});

export type MeasurementData = z.infer<typeof measurementSchema>;

// Schema completo del wizard (sin el refine que complica el merge)
const customRequestBaseSchema = contactSchema
  .merge(designSchema)
  .merge(descriptionSchema)
  .merge(inspirationSchema)
  .merge(
    z.object({
      size_profile_id: z.string().uuid().optional(),
      custom_sizes: z
        .object({
          left_thumb: z.number().min(1).max(30).optional(),
          left_index: z.number().min(1).max(30).optional(),
          left_middle: z.number().min(1).max(30).optional(),
          left_ring: z.number().min(1).max(30).optional(),
          left_pinky: z.number().min(1).max(30).optional(),
          right_thumb: z.number().min(1).max(30).optional(),
          right_index: z.number().min(1).max(30).optional(),
          right_middle: z.number().min(1).max(30).optional(),
          right_ring: z.number().min(1).max(30).optional(),
          right_pinky: z.number().min(1).max(30).optional(),
        })
        .optional(),
    }),
  );

export const customRequestSchema = customRequestBaseSchema
  .merge(z.object({
    skip_measurements: z.boolean().default(false),
  }))
  .refine(
    (data) => data.skip_measurements || data.size_profile_id || data.custom_sizes,
    'Debes seleccionar un perfil de medidas, introducir medidas personalizadas o saltar este paso',
  );

export type CustomRequestData = z.infer<typeof customRequestBaseSchema>;

// Constantes para opciones
export const SHAPES = [
  { value: 'coffin', label: 'Ataúd' },
  { value: 'almond', label: 'Almendra' },
  { value: 'square', label: 'Cuadrada' },
  { value: 'round', label: 'Redonda' },
  { value: 'stiletto', label: 'Stiletto' },
  { value: 'ballerina', label: 'Bailarina' },
] as const;

export const LENGTHS = [
  { value: 'short', label: 'Corta' },
  { value: 'medium', label: 'Media' },
  { value: 'long', label: 'Larga' },
  { value: 'extra_long', label: 'Extra larga' },
] as const;

export const FINISHES = [
  { value: 'matte', label: 'Mate' },
  { value: 'glossy', label: 'Brillante' },
  { value: 'chrome', label: 'Cromado' },
  { value: 'holographic', label: 'Holográfico' },
  { value: 'textured', label: 'Texturizado' },
] as const;

export const EXTRAS = [
  { value: 'rhinestones', label: 'Pedrería' },
  { value: 'charms', label: 'Charms' },
  { value: 'glitter', label: 'Purpurina' },
  { value: 'foil', label: 'Foil' },
  { value: 'hand_painted', label: 'Pintado a mano' },
] as const;

export const URGENCY_OPTIONS = [
  { value: 'standard', label: 'Estándar (2-3 semanas)', price: 0 },
  { value: 'express', label: 'Express (1-2 semanas)', price: 15 },
  { value: 'urgent', label: 'Urgente (5-7 días)', price: 30 },
] as const;

export const COMMUNICATION_PREFERENCES = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Teléfono' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const;
