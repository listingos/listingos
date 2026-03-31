import Stripe from 'stripe';
import { NextRequest } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { priceId, email } = await req.json();

    if (!priceId) {
      return Response.json({ error: 'No price ID provided' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      customer_email: email,
    });

    return Response.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}