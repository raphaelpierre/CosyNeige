import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBankTransferConfirmation, sendAdminNotification } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupérer la réservation
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée', errorEn: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de paiement
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        paymentStatus: 'pending_bank_transfer',
        status: 'pending',
      },
    });

    // Envoyer l'email de confirmation au client avec les détails bancaires
    const depositAmount = reservation.depositAmount || reservation.totalPrice * 0.3;

    try {
      await sendBankTransferConfirmation({
        to: reservation.email,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        checkIn: reservation.checkIn.toISOString(),
        checkOut: reservation.checkOut.toISOString(),
        guests: reservation.guests,
        totalPrice: reservation.totalPrice,
        depositAmount,
        reservationId: reservation.id,
      });
      console.log(`📧 Email de confirmation de virement envoyé à ${reservation.email}`);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      // Continue même si l'email échoue
    }

    // Envoyer une notification à l'admin
    try {
      await sendAdminNotification({
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        email: reservation.email,
        phone: reservation.phone,
        checkIn: reservation.checkIn.toISOString(),
        checkOut: reservation.checkOut.toISOString(),
        guests: reservation.guests,
        totalPrice: reservation.totalPrice,
        message: reservation.message || '',
        reservationId: reservation.id,
      });
      console.log(`📧 Notification admin envoyée pour la réservation ${reservation.id}`);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de la notification admin:', emailError);
    }

    return NextResponse.json({
      message: 'Statut de paiement mis à jour avec succès',
      messageEn: 'Payment status updated successfully',
      reservation: updatedReservation,
      success: true,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de paiement:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la mise à jour du statut de paiement',
        errorEn: 'Error updating payment status',
      },
      { status: 500 }
    );
  }
}
