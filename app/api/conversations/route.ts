import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConversationMessageToAdmin } from '@/lib/conversation-emails';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// GET - Récupérer les conversations de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role?: string };

    // Si admin, récupérer toutes les conversations
    if (decoded.role === 'admin') {
      const conversations = await prisma.conversation.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          reservation: {
            select: {
              id: true,
              checkIn: true,
              checkOut: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });

      return NextResponse.json(conversations);
    }

    // Sinon, récupérer les conversations de l'utilisateur
    const conversations = await prisma.conversation.findMany({
      where: { userId: decoded.userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        reservation: {
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle conversation (avec premier message)
export async function POST(request: NextRequest) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const token = request.cookies.get('auth-token')?.value;

    const body = await request.json();
    const { subject, content, reservationId, fromEmail, fromName } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    let userId: string;
    let userEmail: string;
    let userName: string;

    // Si authentifié, récupérer l'utilisateur
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        userId = user.id;
        userEmail = user.email;
        userName = `${user.firstName} ${user.lastName}`;
      } catch (jwtError) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
    } else {
      // Si non authentifié, créer ou récupérer l'utilisateur par email
      if (!fromEmail || !fromName) {
        return NextResponse.json(
          { error: 'Email and name are required for unauthenticated users' },
          { status: 400 }
        );
      }

      // Vérifier si l'utilisateur existe déjà
      let user = await prisma.user.findUnique({
        where: { email: fromEmail },
      });

      // Si l'utilisateur n'existe pas, le créer
      if (!user) {
        const nameParts = fromName.split(' ');
        const firstName = nameParts[0] || fromName;
        const lastName = nameParts.slice(1).join(' ') || '';

        user = await prisma.user.create({
          data: {
            email: fromEmail,
            firstName,
            lastName,
            password: null,
            passwordSet: false,
            role: 'client',
          },
        });
      }

      userId = user.id;
      userEmail = user.email;
      userName = fromName;
    }

    // Créer la conversation avec le premier message
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        subject,
        reservationId: reservationId || null,
        status: 'open',
        unreadByAdmin: 1, // Premier message non lu par admin
        unreadByClient: 0,
        lastMessageFrom: 'client',
        messages: {
          create: {
            fromUserId: userId,
            fromEmail: userEmail,
            fromName: userName,
            isFromAdmin: false,
            content,
            read: false,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    // Envoyer l'email de notification à l'admin
    try {
      await sendConversationMessageToAdmin({
        conversationId: conversation.id,
        messageId: conversation.messages[0].id,
        fromName: userName,
        fromEmail: userEmail,
        subject,
        content,
        reservationId: reservationId || undefined,
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Ne pas bloquer la création de la conversation si l'email échoue
    }

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
