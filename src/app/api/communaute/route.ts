import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BLOCK = [/\b(spam|promo|http|www\.)/gi, /<script/gi];

export async function POST(req: NextRequest) {
  try {
    const { content, language } = await req.json();
    if (!content || content.trim().length < 15 || content.trim().length > 300) {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }
    const unsafe = BLOCK.some(p => p.test(content));
    const status = unsafe ? 'rejected' : 'pending';
    const supabase = createClient();
    await supabase.from('community_posts').insert({
      content: content.trim(),
      language: language ?? 'fr',
      status,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
