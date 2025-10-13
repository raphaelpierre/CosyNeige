import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer une réservation par ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour une réservation
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { status, checkIn, checkOut, guests, message, ...updateData } = body;

    // Vérifier que la réservation existe
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: params.id }
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Pour les modifications client, vérifier le statut
    if (checkIn || checkOut || guests || message !== undefined) {
      // Seules les réservations pending ou confirmed peuvent être modifiées par le client
      if (!['pending', 'confirmed'].includes(existingReservation.status)) {
        return NextResponse.json(
          { error: 'This reservation cannot be modified. Please contact us for assistance.' },
          { status: 400 }
        );
      }
    }

    // Calculer le nouveau prix si les dates changent
    let totalPrice = existingReservation.totalPrice;
    if (checkIn && checkOut) {
      // Import de calculatePrice si disponible
      try {
        const { calculatePrice } = await import('@/lib/utils');
        const priceCalculation = calculatePrice(checkIn, checkOut);
        if (priceCalculation) {
          totalPrice = priceCalculation.total;
        }
      } catch (error) {
        console.log('Price calculation not available');
      }
    }

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...(status && { status }),
        ...(checkIn && { checkIn }),
        ...(checkOut && { checkOut }),
        ...(guests && { guests }),
        ...(message !== undefined && { message }),
        ...(checkIn && checkOut && totalPrice !== existingReservation.totalPrice && { totalPrice }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une réservation
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await prisma.reservation.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
