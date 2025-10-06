import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Basic validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    // In production this will show up in Coolify logs
    console.log('[client-log]', body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api/logs] Failed to log entry', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
