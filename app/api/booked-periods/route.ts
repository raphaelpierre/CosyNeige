import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bookedPeriods = await prisma.bookedPeriod.findMany({
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json(bookedPeriods);
  } catch (error) {
    console.error('Error fetching booked periods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booked periods' },
      { status: 500 }
    );
  }
}
