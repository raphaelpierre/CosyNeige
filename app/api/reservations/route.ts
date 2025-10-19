import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmation, sendAdminNotification, sendAccountCreationInvite } from '@/lib/email';
import crypto from 'crypto';

// GET - Récupérer toutes les réservations
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle réservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      message,
      status = 'pending',
      paymentStatus = 'none',
      stripePaymentId,
      depositAmount
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { email }
    });

    // Si l'utilisateur n'existe pas, le créer automatiquement
    if (!user) {
      // Générer un token sécurisé pour la création du mot de passe
      const passwordToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 72); // Token valide 72h

      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          password: null, // Pas de mot de passe encore
          passwordSet: false,
          passwordResetToken: passwordToken,
          tokenExpiry,
          role: 'client'
        }
      });

      console.log(`✅ Nouvel utilisateur créé: ${email} avec token de setup`);
    }

    // Créer la réservation liée à l'utilisateur
    const reservation = await prisma.reservation.create({
      data: {
        guestName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        phone,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: parseInt(guests),
        totalPrice: parseFloat(totalPrice) || 0,
        message: message || null,
        status,
        paymentStatus,
        stripePaymentId: stripePaymentId || null,
        depositAmount: depositAmount ? parseFloat(depositAmount) : null,
        userId: user.id // Lier la réservation à l'utilisateur
      }
    });

    // Créer la période réservée
    await prisma.bookedPeriod.create({
      data: {
        startDate: new Date(checkIn),
        endDate: new Date(checkOut)
      }
    });

    // Envoyer les emails de confirmation
    try {
      // Email au client
      await sendBookingConfirmation({
        to: email,
        firstName,
        lastName,
        checkIn,
        checkOut,
        guests,
        totalPrice: parseFloat(totalPrice) || 0,
        reservationId: reservation.id
      });

      // Email à l'admin
      await sendAdminNotification({
        firstName,
        lastName,
        email,
        phone,
        checkIn,
        checkOut,
        guests,
        totalPrice: parseFloat(totalPrice) || 0,
        message,
        reservationId: reservation.id
      });

      // Si c'est un nouvel utilisateur sans mot de passe, envoyer l'email de création de compte
      if (user && !user.passwordSet && user.passwordResetToken) {
        await sendAccountCreationInvite({
          to: email,
          firstName,
          lastName,
          token: user.passwordResetToken
        });
        console.log(`📧 Email de création de compte envoyé à ${email}`);
      }
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Continue même si l'email échoue
    }

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
