import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Mettre à jour le statut de paiement
    const reservation = await prisma.reservation.update({
      where: { id: id },
      data: { 
        paymentStatus: 'pending_bank_transfer'
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}