import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        {
          error: 'Token manquant',
          errorEn: 'Missing token'
        },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur avec ce token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        tokenExpiry: {
          gte: new Date() // Token pas encore expiré
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Token invalide ou expiré',
          errorEn: 'Invalid or expired token'
        },
        { status: 400 }
      );
    }

    // Vérifier l'email de l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: null, // Supprimer le token
        tokenExpiry: null,
        // On pourrait ajouter un champ emailVerified: true si nécessaire
      }
    });

    return NextResponse.json({
      message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.',
      messageEn: 'Email verified successfully! You can now log in.',
      success: true
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la vérification de l\'email',
        errorEn: 'Error verifying email'
      },
      { status: 500 }
    );
  }
}
