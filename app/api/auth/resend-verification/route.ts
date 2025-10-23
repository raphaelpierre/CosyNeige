import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmailVerification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          error: 'Email requis',
          errorEn: 'Email required'
        },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Pour des raisons de sécurité, ne pas révéler si l'email existe ou non
      return NextResponse.json({
        message: 'Si cet email existe, un nouveau lien de vérification a été envoyé.',
        messageEn: 'If this email exists, a new verification link has been sent.'
      });
    }

    // Vérifier si l'email est déjà vérifié
    if (!user.passwordResetToken) {
      return NextResponse.json({
        message: 'Cet email est déjà vérifié.',
        messageEn: 'This email is already verified.',
        alreadyVerified: true
      });
    }

    // Générer un nouveau token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valide 24h

    // Mettre à jour le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: verificationToken,
        tokenExpiry,
      }
    });

    // Renvoyer l'email
    try {
      await sendEmailVerification({
        to: email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: verificationToken
      });
      console.log(`📧 Email de vérification renvoyé à ${email}`);
    } catch (emailError) {
      console.error('Error resending verification email:', emailError);
      return NextResponse.json(
        {
          error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.',
          errorEn: 'Error sending email. Please try again.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Un nouveau lien de vérification a été envoyé à votre adresse email.',
      messageEn: 'A new verification link has been sent to your email address.',
      success: true
    });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors du renvoi de l\'email de vérification',
        errorEn: 'Error resending verification email'
      },
      { status: 500 }
    );
  }
}
