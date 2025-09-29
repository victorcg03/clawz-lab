import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as serverModule from '@/lib/supabase/server';
import { createSizeProfile } from '@/app/measure/actions';

// Mock supabase client shape mínimo utilizado en la acción
interface MockInsertReturn {
  error: { message: string } | null;
}
interface MockSupabaseClient {
  auth: { getUser: () => Promise<{ data: { user: { id: string } } }> };
  from: (table: string) => { insert: (row: unknown) => Promise<MockInsertReturn> };
}

function mockClient(overrides: Partial<MockSupabaseClient> = {}): MockSupabaseClient {
  const baseInsert = vi.fn().mockResolvedValue({ error: null });
  const base: MockSupabaseClient = {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
    from: vi.fn().mockReturnValue({ insert: baseInsert }),
  };
  return { ...base, ...overrides } as MockSupabaseClient;
}

vi.mock('@/lib/supabase/server', () => ({
  supabaseServer: vi.fn(),
}));

// revalidatePath se puede mockear para no romper
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

describe('createSizeProfile action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('crea un perfil válido', async () => {
    (
      serverModule as unknown as {
        supabaseServer: { mockResolvedValue: (c: MockSupabaseClient) => void };
      }
    ).supabaseServer.mockResolvedValue(mockClient());
    const res = await createSizeProfile({ name: 'Perfil A' });
    expect(res.ok).toBe(true);
  });

  it('falla validación con nombre vacío', async () => {
    const res = await createSizeProfile({ name: '' });
    expect(res.ok).toBe(false);
  });

  it('propaga error de base de datos', async () => {
    const client = mockClient({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: { message: 'db error' } }),
      }),
    });
    (
      serverModule as unknown as {
        supabaseServer: { mockResolvedValue: (c: MockSupabaseClient) => void };
      }
    ).supabaseServer.mockResolvedValue(client);
    const res = await createSizeProfile({ name: 'Perfil X' });
    expect(res.ok).toBe(false);
    expect(res.error).toMatchObject({ _db: ['db error'] });
  });
});
