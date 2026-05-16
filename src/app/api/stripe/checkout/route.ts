import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { priceId, locale } = await req.json();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.justecontinuer.com';

    // Stripe integration — configure STRIPE_SECRET_KEY in env
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      // Development fallback
      return NextResponse.json({ url: `/${locale}/premium?demo=true` });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/${locale}/premium?success=true`,
      cancel_url: `${siteUrl}/${locale}/premium`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[stripe]', err);
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 });
  }
}
