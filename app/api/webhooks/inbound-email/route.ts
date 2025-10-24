import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConversationMessageToAdmin } from '@/lib/conversation-emails';

/**
 * Decode quoted-printable encoded text
 */
function decodeQuotedPrintable(text: string): string {
  if (!text) return '';

  let decoded = text;

  // Remove soft line breaks (= at end of line)
  decoded = decoded.replace(/=\r?\n/g, '');

  // Replace =XX with the corresponding character (hex codes)
  decoded = decoded.replace(/=([0-9A-F]{2})/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Decode UTF-8 sequences
  try {
    // Convert to bytes and decode as UTF-8
    const bytes = new Uint8Array(
      decoded.split('').map(char => char.charCodeAt(0))
    );
    const decoder = new TextDecoder('utf-8', { fatal: false });
    decoded = decoder.decode(bytes);
  } catch (e) {
    // If UTF-8 decoding fails, keep the current decoded string
    console.log('UTF-8 decoding not needed or failed, using direct decode');
  }

  return decoded;
}

/**
 * Extract plain text from HTML email
 */
function extractTextFromHtml(html: string): string {
  if (!html) return '';

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up multiple spaces and newlines
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Parse and clean email content
 */
function parseEmailContent(data: any): string {
  let content = '';

  // Try to get text content first
  if (data.text) {
    content = typeof data.text === 'string' ? data.text : String(data.text);
  } else if (data.html) {
    content = typeof data.html === 'string' ? data.html : String(data.html);
    content = extractTextFromHtml(content);
  } else if (data.plain) {
    content = typeof data.plain === 'string' ? data.plain : String(data.plain);
  }

  // Decode if it's quoted-printable encoded (check for common patterns)
  if (content.includes('=C') || content.includes('=E') || content.includes('=3D') || content.includes('=\n')) {
    content = decodeQuotedPrintable(content);
  }

  // Remove MIME boundaries and headers
  content = content
    .replace(/--[a-f0-9]+\s*Content-Transfer-Encoding:.*?(?=\n\n)/gis, '')
    .replace(/Content-Type:.*?\n/gi, '')
    .replace(/Content-Transfer-Encoding:.*?\n/gi, '')
    .replace(/Mime-Version:.*?\n/gi, '')
    .replace(/--[a-f0-9]+--/g, '')
    .replace(/--[a-f0-9]{32,}/g, '');

  // Clean up URLs - shorten long Airbnb/tracking URLs
  content = content.replace(/https?:\/\/[^\s]+/g, (url) => {
    // Keep short, meaningful URLs
    if (url.length < 80) return url;
    // For long URLs, extract domain and shorten
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}...`;
    } catch {
      return '[URL]';
    }
  });

  // Remove excessive whitespace while preserving paragraph breaks
  content = content
    .replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single space
    .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double newline
    .trim();

  return content || 'Email vide';
}

/**
 * POST /api/webhooks/inbound-email
 * Webhook appelé par Postfix quand un email est reçu sur le domaine
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

    // Support pour les deux formats : {email, name} et string
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
    const content = parseEmailContent(data);

    // Validation
    if (!fromEmail || !toEmail) {
      console.error('❌ Missing from or to email', { fromEmail, toEmail, data });
      return NextResponse.json(
        { error: 'Missing required fields', received: { from: data.from, to: data.to } },
        { status: 400 }
      );
    }

    // Empêcher les boucles de notifications (emails automatiques renvoyés)
    if (
      subject.includes('Nouveau message:') ||
      subject.includes('Réponse:') ||
      fromEmail.includes('noreply@chalet-balmotte810.com')
    ) {
      console.log(`⚠️ Email automatique ignoré: ${subject}`);
      return NextResponse.json({
        success: true,
        message: 'Automatic email ignored to prevent loops',
      });
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
          passwordSet: false,
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
          status: 'open',
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

    console.log(`✅ Message created: ${message.id} with content length: ${content.length}`);

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
