import { describe, it, expect } from 'vitest';
import { sizeProfileSchema } from '@/app/measure/schema';

describe('sizeProfileSchema', () => {
  it('acepta un nombre y sin medidas', () => {
    const parsed = sizeProfileSchema.safeParse({ name: 'Perfil 1' });
    expect(parsed.success).toBe(true);
  });

  it('rechaza nombre vacío', () => {
    const parsed = sizeProfileSchema.safeParse({ name: '' });
    expect(parsed.success).toBe(false);
  });

  it('acepta valores en rango', () => {
    const parsed = sizeProfileSchema.safeParse({
      name: 'Ok',
      left_thumb: 10,
      right_pinky: 25,
    });
    expect(parsed.success).toBe(true);
  });

  it('rechaza valor fuera de rango', () => {
    const parsed = sizeProfileSchema.safeParse({ name: 'X', left_thumb: 100 });
    expect(parsed.success).toBe(false);
  });
});
