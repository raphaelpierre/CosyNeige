import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          error: 'Email et mot de passe requis',
          errorEn: 'Email and password required'
        },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Email ou mot de passe incorrect',
          errorEn: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: 'Email ou mot de passe incorrect',
          errorEn: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Créer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retourner l'utilisateur et le token (sans le mot de passe)
    const { password: _password, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: userWithoutPassword,
      token
    });

    // Définir le cookie avec le token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    });

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      {
        error: 'Erreur de connexion. Veuillez réessayer.',
        errorEn: 'Connection error. Please try again.'
      },
      { status: 500 }
    );
  }
}
