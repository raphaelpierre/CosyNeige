import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// GET - Récupérer les messages de l'utilisateur ou tous les messages si admin
export async function GET(request: NextRequest) {
  try {
    // Vérifier d'abord le token dans les headers (pour admin)
    let token = request.headers.get('authorization')?.replace('Bearer ', '');
    const isHeaderAuth = !!token;
    
    // Si pas de token dans les headers, vérifier les cookies (pour client)
    if (!token) {
      token = request.cookies.get('auth-token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role?: string };

    // Si c'est un admin avec authentification par header, récupérer tous les messages
    if (isHeaderAuth && decoded.role === 'admin') {
      const messages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ messages });
    }

    // Sinon, récupérer les messages de l'utilisateur
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: decoded.userId },
          { fromEmail: (await prisma.user.findUnique({ where: { id: decoded.userId } }))?.email || '' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau message
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { subject, content, replyTo } = await request.json();

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        subject,
        content,
        fromUserId: user.id,
        fromEmail: user.email,
        fromName: `${user.firstName} ${user.lastName}`,
        isFromAdmin: false,
        replyTo: replyTo || null
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
