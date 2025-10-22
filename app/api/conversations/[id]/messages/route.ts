import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConversationMessageToAdmin, sendConversationMessageToClient } from '@/lib/conversation-emails';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST - Ajouter un message à une conversation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role?: string };
    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Vérifier que la conversation existe
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const isAdmin = decoded.role === 'admin';
    const isOwner = conversation.userId === decoded.userId;

    // Vérifier les droits d'accès
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Récupérer les infos de l'expéditeur
    let fromUserId: string;
    let fromEmail: string;
    let fromName: string;
    let isFromAdmin: boolean;

    if (isAdmin) {
      // Admin envoie le message
      const admin = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!admin) {
        return NextResponse.json(
          { error: 'Admin user not found' },
          { status: 404 }
        );
      }

      fromUserId = admin.id;
      fromEmail = admin.email;
      fromName = `${admin.firstName} ${admin.lastName}`;
      isFromAdmin = true;
    } else {
      // Client envoie le message
      fromUserId = conversation.user.id;
      fromEmail = conversation.user.email;
      fromName = `${conversation.user.firstName} ${conversation.user.lastName}`;
      isFromAdmin = false;
    }

    // Créer le message
    const message = await prisma.conversationMessage.create({
      data: {
        conversationId: params.id,
        fromUserId,
        fromEmail,
        fromName,
        isFromAdmin,
        content,
        read: false,
      },
    });

    // Mettre à jour la conversation
    const updateData: any = {
      lastMessageAt: new Date(),
      lastMessageFrom: isFromAdmin ? 'admin' : 'client',
    };

    if (isFromAdmin) {
      updateData.unreadByClient = { increment: 1 };
    } else {
      updateData.unreadByAdmin = { increment: 1 };
    }

    await prisma.conversation.update({
      where: { id: params.id },
      data: updateData,
    });

    // Envoyer l'email de notification
    try {
      if (isFromAdmin) {
        // Admin répond → notifier le client
        await sendConversationMessageToClient({
          conversationId: conversation.id,
          messageId: message.id,
          toEmail: conversation.user.email,
          toName: `${conversation.user.firstName} ${conversation.user.lastName}`,
          subject: conversation.subject,
          content,
          reservationId: conversation.reservationId || undefined,
        });
      } else {
        // Client envoie → notifier l'admin
        await sendConversationMessageToAdmin({
          conversationId: conversation.id,
          messageId: message.id,
          fromName,
          fromEmail,
          subject: conversation.subject,
          content,
          reservationId: conversation.reservationId || undefined,
        });
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Ne pas bloquer la création du message si l'email échoue
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
