import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// GET - Récupérer une conversation avec tous ses messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role?: string };

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
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
            guestName: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            emailLog: {
              select: {
                id: true,
                status: true,
                sentAt: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur a le droit d'accéder à cette conversation
    const isAdmin = decoded.role === 'admin';
    const isOwner = conversation.userId === decoded.userId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Marquer les messages comme lus selon qui consulte
    if (isAdmin) {
      // Marquer les messages non lus du client comme lus
      await prisma.conversationMessage.updateMany({
        where: {
          conversationId: conversationId,
          isFromAdmin: false,
          read: false,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      // Réinitialiser le compteur unreadByAdmin
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadByAdmin: 0 },
      });
    } else {
      // Marquer les messages non lus de l'admin comme lus
      await prisma.conversationMessage.updateMany({
        where: {
          conversationId: conversationId,
          isFromAdmin: true,
          read: false,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      // Réinitialiser le compteur unreadByClient
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadByClient: 0 },
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le statut de la conversation (admin uniquement)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role?: string };

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { status } = await request.json();

    if (!['open', 'closed', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: open, closed, or archived' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}
