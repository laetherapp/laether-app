import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { fragment_id, post_id, language, anonymous_id } = await req.json();
    const supabase = createClient();
    await supabase.from('reactions').insert({
      fragment_id: fragment_id ?? null,
      post_id: post_id ?? null,
      type: 'feather',
      language: language ?? 'fr',
      anonymous_id: anonymous_id ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
