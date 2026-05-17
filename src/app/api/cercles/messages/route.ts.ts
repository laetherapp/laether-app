import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const circleId = searchParams.get('circle_id');
    if (!circleId) return NextResponse.json({ error: 'Missing circle_id' }, { status: 400 });

    const supabase = createClient();
    const { data } = await supabase
      .from('circle_messages')
      .select('*')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: true })
      .limit(100);

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { circle_id, pseudo, content, language } = await req.json();
    if (!circle_id || !content?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const supabase = createClient();
    const { data } = await supabase
      .from('circle_messages')
      .insert({
        circle_id,
        pseudo: pseudo ?? 'Anonyme',
        content: content.trim().slice(0, 600),
        language: language ?? 'fr',
      })
      .select()
      .single();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
