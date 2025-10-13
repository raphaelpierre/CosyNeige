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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            reservations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { email, firstName, lastName, phone, role, password } = await req.json();

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: 'Email, prénom, nom et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: role || 'client'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || !role || !['client', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
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

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Empêcher la suppression de son propre compte
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}