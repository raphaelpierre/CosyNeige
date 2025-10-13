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

    // Récupérer toutes les réservations avec informations de paiement pour les factures
    const reservations = await prisma.reservation.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Formater les données pour les factures
    const invoices = reservations.map(reservation => ({
      id: reservation.id,
      invoiceNumber: `INV-${reservation.id.substring(0, 8).toUpperCase()}`,
      reservationId: reservation.id,
      clientName: `${reservation.firstName} ${reservation.lastName}`,
      clientEmail: reservation.email,
      clientPhone: reservation.phone,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guests: reservation.guests,
      totalAmount: reservation.totalPrice,
      depositAmount: 0, // À implémenter si nécessaire
      remainingAmount: reservation.totalPrice,
      paymentStatus: reservation.status === 'confirmed' ? 'paid' : 'pending',
      reservationStatus: reservation.status,
      createdAt: reservation.createdAt,
      stripePaymentId: null, // À implémenter plus tard
      message: reservation.message,
      user: reservation.user
    }));

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
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

    const { invoiceId, paymentStatus, notes } = await req.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'ID de facture requis' },
        { status: 400 }
      );
    }

    // Mettre à jour la réservation (statut et notes)
    const updatedReservation = await prisma.reservation.update({
      where: { id: invoiceId },
      data: {
        status: paymentStatus || undefined,
        message: notes || undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: updatedReservation.id,
        status: updatedReservation.status,
        notes: updatedReservation.message
      }
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la facture' },
      { status: 500 }
    );
  }
}