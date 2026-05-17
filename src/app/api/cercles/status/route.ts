import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ status: 'none' });

    const supabase = createClient();

    // Check queue
    const { data: queue } = await supabase
      .from('circle_queue')
      .select('*')
      .eq('email', email)
      .single();

    if (!queue) return NextResponse.json({ status: 'none' });

    if (queue.status === 'waiting') {
      return NextResponse.json({ status: 'waiting', pseudo: queue.pseudo });
    }

    if (queue.status === 'matched' && queue.circle_id) {
      // Get circle members
      const { data: members } = await supabase
        .from('circle_members')
        .select('pseudo, language')
        .eq('circle_id', queue.circle_id);

      return NextResponse.json({
        status: 'active',
        circle_id: queue.circle_id,
        pseudo: queue.pseudo,
        language: queue.language,
        members: members ?? [],
      });
    }

    return NextResponse.json({ status: 'none' });
  } catch {
    return NextResponse.json({ status: 'none' });
  }
}