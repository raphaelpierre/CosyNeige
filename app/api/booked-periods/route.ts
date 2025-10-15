import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer les réservations confirmées (pas annulées)
    const confirmedReservations = await prisma.reservation.findMany({
      where: {
        status: {
          in: ['confirmed', 'pending'] // Bloquer les dates pour les réservations confirmées et en attente
        }
      },
      orderBy: { checkIn: 'asc' },
      select: {
        checkIn: true,
        checkOut: true
      }
    });

    // Transformer en format attendu par le calendrier
    const bookedPeriods = confirmedReservations.map(reservation => ({
      startDate: reservation.checkIn,
      endDate: reservation.checkOut
    }));

    return NextResponse.json(bookedPeriods);
  } catch (error) {
    console.error('Error fetching booked periods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booked periods' },
      { status: 500 }
    );
  }
}
