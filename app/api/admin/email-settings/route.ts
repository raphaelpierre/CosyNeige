import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';

// GET - Récupérer les paramètres d'email
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const user = await verifyToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé', errorEn: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Récupérer ou créer les paramètres
    let settings = await prisma.emailSettings.findFirst();

    if (!settings) {
      // Créer les paramètres par défaut s'ils n'existent pas
      settings = await prisma.emailSettings.create({
        data: {
          contactEmail: 'contact@chalet-balmotte810.com',
          forwardingEmails: ['contact@chalet-balmotte810.com'],
          fromName: 'Chalet-Balmotte810',
          fromEmail: 'noreply@chalet-balmotte810.com',
          replyToEmail: 'contact@chalet-balmotte810.com',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres', errorEn: 'Error fetching settings' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les paramètres d'email
export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const user = await verifyToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé', errorEn: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validation des emails de transfert
    if (data.forwardingEmails) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of data.forwardingEmails) {
        if (!emailRegex.test(email.trim())) {
          return NextResponse.json(
            { error: `Email invalide: ${email}`, errorEn: `Invalid email: ${email}` },
            { status: 400 }
          );
        }
      }
    }

    // Récupérer les paramètres existants
    let settings = await prisma.emailSettings.findFirst();

    if (!settings) {
      // Créer si n'existe pas
      settings = await prisma.emailSettings.create({
        data: {
          contactEmail: data.contactEmail || 'contact@chalet-balmotte810.com',
          forwardingEmails: data.forwardingEmails || [],
          fromName: data.fromName || 'Chalet-Balmotte810',
          fromEmail: data.fromEmail || 'noreply@chalet-balmotte810.com',
          replyToEmail: data.replyToEmail || 'contact@chalet-balmotte810.com',
          notifyOnNewBooking: data.notifyOnNewBooking ?? true,
          notifyOnNewMessage: data.notifyOnNewMessage ?? true,
          notifyOnPayment: data.notifyOnPayment ?? true,
          notifyOnContact: data.notifyOnContact ?? true,
        },
      });
    } else {
      // Mettre à jour
      settings = await prisma.emailSettings.update({
        where: { id: settings.id },
        data: {
          contactEmail: data.contactEmail,
          forwardingEmails: data.forwardingEmails,
          fromName: data.fromName,
          fromEmail: data.fromEmail,
          replyToEmail: data.replyToEmail,
          notifyOnNewBooking: data.notifyOnNewBooking,
          notifyOnNewMessage: data.notifyOnNewMessage,
          notifyOnPayment: data.notifyOnPayment,
          notifyOnContact: data.notifyOnContact,
        },
      });
    }

    return NextResponse.json({
      message: 'Paramètres mis à jour avec succès',
      messageEn: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Error updating email settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres', errorEn: 'Error updating settings' },
      { status: 500 }
    );
  }
}
