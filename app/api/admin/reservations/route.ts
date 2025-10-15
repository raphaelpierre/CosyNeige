import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';

export async function GET(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const reservations = await prisma.reservation.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const {
      reservationId,
      status,
      paymentStatus,
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      depositAmount,
      message
    } = await req.json();

    if (!reservationId) {
      return NextResponse.json(
        { error: 'ID de réservation requis' },
        { status: 400 }
      );
    }

    // Construire l'objet de mise à jour
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (checkIn) updateData.checkIn = new Date(checkIn);
    if (checkOut) updateData.checkOut = new Date(checkOut);
    if (guests !== undefined) updateData.guests = guests;
    if (totalPrice !== undefined) updateData.totalPrice = totalPrice;
    if (depositAmount !== undefined) updateData.depositAmount = depositAmount;
    if (message !== undefined) updateData.message = message;

    // Mettre à jour guestName si firstName ou lastName sont fournis
    if (firstName || lastName) {
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId }
      });
      const newFirstName = firstName || reservation?.firstName || '';
      const newLastName = lastName || reservation?.lastName || '';
      updateData.guestName = `${newFirstName} ${newLastName}`.trim();
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { reservationId } = await req.json();

    if (!reservationId) {
      return NextResponse.json(
        { error: 'ID de réservation requis' },
        { status: 400 }
      );
    }

    await prisma.reservation.delete({
      where: { id: reservationId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la réservation' },
      { status: 500 }
    );
  }
}