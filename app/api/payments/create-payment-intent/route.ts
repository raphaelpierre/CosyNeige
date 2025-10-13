import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'eur', metadata = {} } = await request.json();

    // Validation
    if (!amount || amount < 50) { // Minimum 0.50 EUR
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is 0.50 EUR' },
        { status: 400 }
      );
    }

    // Créer le Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe attend le montant en centimes
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        source: 'chalet-reservation'
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}