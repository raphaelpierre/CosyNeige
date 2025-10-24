import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reservationId } = await params;
    const { paymentIntentId } = await request.json();

    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 503 }
      );
    }

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed', status: paymentIntent.status },
        { status: 400 }
      );
    }

    // Update reservation
    const reservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        paymentStatus: 'paid',
        stripePaymentId: paymentIntentId,
        status: 'confirmed',
      },
    });

    console.log(`✅ Payment confirmed for reservation ${reservationId} via client-side`);

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      {
        error: 'Failed to confirm payment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
