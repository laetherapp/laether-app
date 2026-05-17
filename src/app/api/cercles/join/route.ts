import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, pseudo, language } = await req.json();

    if (!email || !email.includes('@') || !pseudo?.trim()) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const supabase = createClient();

    // Check if user already in queue or circle
    const { data: existing } = await supabase
      .from('circle_queue')
      .select('id')
      .eq('email', email.trim())
      .single();

    if (existing) {
      return NextResponse.json({ ok: true, status: 'already_queued' });
    }

    // Add to queue
    await supabase.from('circle_queue').insert({
      email: email.trim(),
      pseudo: pseudo.trim().slice(0, 30),
      language: language ?? 'fr',
    });

    // Check if we can form a circle (3 people waiting)
    const { data: queue } = await supabase
      .from('circle_queue')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: true })
      .limit(3);

    if (queue && queue.length >= 3) {
      const three = queue.slice(0, 3);

      // Create circle
      const { data: circle } = await supabase
        .from('circles')
        .insert({ language: 'mixed', status: 'active' })
        .select()
        .single();

      if (circle) {
        // Add members
        await supabase.from('circle_members').insert(
          three.map(m => ({
            circle_id: circle.id,
            user_email: m.email,
            pseudo: m.pseudo,
            language: m.language,
          }))
        );

        // Mark queue entries as matched
        await supabase
          .from('circle_queue')
          .update({ status: 'matched', circle_id: circle.id })
          .in('id', three.map(m => m.id));
      }
    }

    return NextResponse.json({ ok: true, status: 'queued' });
  } catch (err) {
    console.error('[cercles/join]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
