import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmailVerification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        {
          error: 'Tous les champs obligatoires doivent être remplis',
          errorEn: 'All required fields must be filled'
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'Un compte existe déjà avec cet email',
          errorEn: 'An account with this email already exists'
        },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un token de vérification d'email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valide 24h

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        passwordSet: true, // Le mot de passe est défini
        passwordResetToken: verificationToken, // On réutilise ce champ pour la vérification
        tokenExpiry,
      }
    });

    // Envoyer l'email de vérification
    try {
      await sendEmailVerification({
        to: email,
        firstName,
        lastName,
        token: verificationToken
      });
      console.log(`📧 Email de vérification envoyé à ${email}`);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Continue même si l'email échoue
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json({
      ...userWithoutPassword,
      message: 'Un email de vérification a été envoyé à votre adresse',
      messageEn: 'A verification email has been sent to your address'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la création du compte. Veuillez réessayer.',
        errorEn: 'Error creating account. Please try again.'
      },
      { status: 500 }
    );
  }
}
