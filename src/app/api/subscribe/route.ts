import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, language } = await req.json();
    if (!email || !email.includes('@')) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    const supabase = createClient();
    await supabase.from('subscriptions').insert({ email: email.trim(), language: language ?? 'fr', source: 'experience_page' });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
