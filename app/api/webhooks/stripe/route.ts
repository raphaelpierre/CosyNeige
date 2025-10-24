import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook: Missing configuration');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Stripe webhook: Missing signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`Stripe webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent);
        break;
      }

      case 'payment_intent.processing': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment processing: ${paymentIntent.id}`);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge succeeded: ${charge.id}`);
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge failed: ${charge.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const reservationId = paymentIntent.metadata?.bookingId;

    if (!reservationId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Update reservation in database
    const reservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        paymentStatus: 'paid',
        stripePaymentId: paymentIntent.id,
        status: 'confirmed',
      },
    });

    console.log(`✅ Payment successful for reservation ${reservationId}`);
    console.log(`Amount: ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`);

    // TODO: Send confirmation email to client
    // TODO: Send notification to admin

  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const reservationId = paymentIntent.metadata?.bookingId;

    if (!reservationId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Update reservation status
    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        paymentStatus: 'failed',
        stripePaymentId: paymentIntent.id,
      },
    });

    console.log(`❌ Payment failed for reservation ${reservationId}`);
    console.log(`Error: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`);

    // TODO: Send failure notification to client
    // TODO: Send notification to admin

  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}
