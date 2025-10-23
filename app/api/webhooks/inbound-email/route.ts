import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConversationMessageToAdmin } from '@/lib/conversation-emails';

/**
 * POST /api/webhooks/inbound-email
 * Webhook appelé par Resend quand un email est reçu sur le domaine
 *
 * Documentation Resend: https://resend.com/docs/api-reference/emails/receive-email
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('📧 Inbound email received:', {
      from: data.from,
      to: data.to,
      subject: data.subject,
      rawData: JSON.stringify(data).substring(0, 200),
    });

    // Extraire les informations de l'email avec gestion robuste
    let fromEmail: string;
    let fromName: string;

    // Support pour les deux formats : Resend {email, name} et notre VPS {email, name}
    if (typeof data.from === 'object' && data.from !== null) {
      fromEmail = data.from.email || '';
      fromName = data.from.name || '';
    } else if (typeof data.from === 'string') {
      fromEmail = data.from;
      fromName = '';
    } else {
      fromEmail = '';
      fromName = '';
    }

    // Si fromName est vide, utiliser la partie avant @ de l'email
    if (!fromName && fromEmail) {
      fromName = fromEmail.split('@')[0];
    }

    const toEmail = data.to || '';
    const subject = data.subject || 'Email sans sujet';
    const content = data.text || data.html || 'Email vide';

    // Validation
    if (!fromEmail || !toEmail) {
      console.error('❌ Missing from or to email', { fromEmail, toEmail, data });
      return NextResponse.json(
        { error: 'Missing required fields', received: { from: data.from, to: data.to } },
        { status: 400 }
      );
    }

    // Vérifier que l'email est destiné au domaine du chalet
    const validRecipients = [
      'admin@chalet-balmotte810.com',
      'contact@chalet-balmotte810.com',
      'info@chalet-balmotte810.com',
    ];

    if (!validRecipients.includes(toEmail.toLowerCase())) {
      console.log(`⚠️ Email not for us: ${toEmail}`);
      return NextResponse.json({ success: true, message: 'Email ignored' });
    }

    // Chercher si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { email: fromEmail },
    });

    if (!user) {
      // Créer un nouvel utilisateur pour cet email
      const nameParts = fromName.split(' ');
      const firstName = nameParts[0] || 'Guest';
      const lastName = nameParts.slice(1).join(' ') || fromEmail.split('@')[0];

      console.log(`👤 Creating new user: ${fromEmail}`);

      user = await prisma.user.create({
        data: {
          email: fromEmail,
          firstName,
          lastName,
          role: 'client',
          passwordSet: false, // Pas encore de mot de passe
        },
      });
    }

    // Chercher une conversation existante avec le même sujet (non archivée)
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId: user.id,
        subject: subject,
        status: { not: 'archived' },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!conversation) {
      // Créer une nouvelle conversation
      console.log(`💬 Creating new conversation: ${subject}`);

      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          subject,
          status: 'open',
          unreadByAdmin: 1,
          lastMessageFrom: 'client',
        },
      });
    } else {
      // Mettre à jour la conversation existante
      console.log(`💬 Updating existing conversation: ${conversation.id}`);

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          unreadByAdmin: { increment: 1 },
          lastMessageAt: new Date(),
          lastMessageFrom: 'client',
          status: 'open', // Rouvrir si fermée
        },
      });
    }

    // Créer le message dans la conversation
    const message = await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        fromUserId: user.id,
        fromEmail,
        fromName,
        isFromAdmin: false,
        content,
        read: false,
      },
    });

    console.log(`✅ Message created: ${message.id}`);

    // Envoyer une notification aux admins
    try {
      await sendConversationMessageToAdmin({
        conversationId: conversation.id,
        messageId: message.id,
        fromName,
        fromEmail,
        subject,
        content,
      });

      console.log('📧 Admin notification sent');
    } catch (emailError) {
      console.error('❌ Error sending admin notification:', emailError);
      // Ne pas bloquer le traitement si l'email échoue
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      messageId: message.id,
      userId: user.id,
    });
  } catch (error) {
    console.error('❌ Error processing inbound email:', error);
    return NextResponse.json(
      {
        error: 'Failed to process email',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Pour tester que le webhook est accessible
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Inbound email webhook is ready',
    timestamp: new Date().toISOString(),
  });
}
