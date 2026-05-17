import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, from, to } = await req.json();
    if (!text || !from || !to) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const targetLang = to === 'fr' ? 'FR' : 'EN';

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
      }),
    });

    const data = await response.json();
    const translation = data.translations?.[0]?.text ?? text;

    return NextResponse.json({ translation });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
