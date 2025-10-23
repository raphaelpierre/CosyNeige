import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';
import { sendConversationMessageToClient } from '@/lib/conversation-emails';

/**
 * POST /api/admin/send-message
 * Envoie un message à plusieurs utilisateurs (crée une conversation pour chaque)
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const user = await verifyToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé', errorEn: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userIds, subject, content } = await request.json();

    // Validation
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Aucun destinataire sélectionné', errorEn: 'No recipients selected' },
        { status: 400 }
      );
    }

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Sujet et contenu requis', errorEn: 'Subject and content required' },
        { status: 400 }
      );
    }

    let messagesSent = 0;
    const errors: string[] = [];

    // Pour chaque utilisateur, créer une conversation et envoyer un message
    for (const userId of userIds) {
      try {
        // Récupérer les infos de l'utilisateur
        const recipient = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!recipient) {
          errors.push(`User ${userId} not found`);
          continue;
        }

        // Créer une nouvelle conversation
        const conversation = await prisma.conversation.create({
          data: {
            userId: recipient.id,
            subject,
            status: 'open',
            unreadByClient: 1,
            lastMessageFrom: 'admin',
          },
        });

        // Créer le message dans la conversation
        const message = await prisma.conversationMessage.create({
          data: {
            conversationId: conversation.id,
            fromEmail: user.email,
            fromName: `${user.firstName} ${user.lastName}`,
            isFromAdmin: true,
            content,
          },
        });

        // Envoyer l'email au client
        const emailResult = await sendConversationMessageToClient({
          conversationId: conversation.id,
          messageId: message.id,
          toEmail: recipient.email,
          toName: `${recipient.firstName} ${recipient.lastName}`,
          subject,
          content,
        });

        if (emailResult.success) {
          messagesSent++;
        } else {
          errors.push(`Failed to send email to ${recipient.email}`);
        }
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
        errors.push(`Error with user ${userId}: ${error}`);
      }
    }

    // Réponse
    if (messagesSent === 0) {
      return NextResponse.json(
        {
          error: 'Aucun message envoyé',
          errorEn: 'No messages sent',
          details: errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messagesSent,
      totalRecipients: userIds.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error in send-message route:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'envoi des messages',
        errorEn: 'Error sending messages',
      },
      { status: 500 }
    );
  }
}
