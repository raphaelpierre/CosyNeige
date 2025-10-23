/**
 * Fonctions d'envoi d'emails pour le système de conversations
 */

import { prisma } from './prisma';
import { sendEmail } from './smtp';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@chalet-balmotte810.com';

// Helper function to get forwarding emails from database
async function getForwardingEmails(): Promise<string[]> {
  try {
    const settings = await prisma.emailSettings.findFirst();
    if (settings && settings.forwardingEmails && settings.forwardingEmails.length > 0) {
      return settings.forwardingEmails;
    }
  } catch (error) {
    console.error('Error fetching forwarding emails:', error);
  }
  // Fallback to env variable
  return [ADMIN_EMAIL];
}

// Helper pour logger les emails
async function logConversationEmail({
  emailType,
  from,
  to,
  subject,
  htmlContent,
  conversationId,
  messageId,
  status,
  smtpMessageId,
  errorMessage,
}: {
  emailType: string;
  from: string;
  to: string;
  subject: string;
  htmlContent: string;
  conversationId?: string;
  messageId?: string;
  status: 'pending' | 'sent' | 'failed';
  smtpMessageId?: string;
  errorMessage?: string;
}) {
  try {
    const emailLog = await prisma.emailLog.create({
      data: {
        emailType,
        from,
        to,
        subject,
        htmlContent,
        status,
        resendId: smtpMessageId, // Utiliser resendId pour stocker le messageId SMTP
        errorMessage,
        sentAt: status === 'sent' ? new Date() : null,
      },
    });

    // Lier l'email au message de conversation si fourni
    if (messageId && status === 'sent') {
      await prisma.conversationMessage.update({
        where: { id: messageId },
        data: { emailLogId: emailLog.id },
      });
    }

    return emailLog;
  } catch (error) {
    console.error('Error logging conversation email:', error);
  }
}

// Email de notification pour un nouveau message client → admin
export async function sendConversationMessageToAdmin({
  conversationId,
  messageId,
  fromName,
  fromEmail,
  subject,
  content,
  reservationId,
}: {
  conversationId: string;
  messageId: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  content: string;
  reservationId?: string;
}) {
  const emailFrom = 'Chalet-Balmotte810 <noreply@chalet-balmotte810.com>';
  const emailSubject = `Nouveau message: ${subject}`;

  // Get forwarding emails from settings
  const forwardingEmails = await getForwardingEmails();
  const adminEmailDisplay = forwardingEmails[0]; // For display in logs

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouveau message - Chalet-Balmotte810</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #334155; margin-bottom: 10px;">💬 Nouveau Message</h1>
        </div>

        <div style="background-color: #fff; border: 2px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #334155; margin-top: 0;">Message de ${fromName}</h2>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>De:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${fromName} (${fromEmail})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Sujet:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td>
            </tr>
            ${reservationId ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Réservation:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reservationId}</td>
            </tr>
            ` : ''}
          </table>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h3 style="color: #334155; margin-top: 0;">Message:</h3>
            <p style="margin: 0; white-space: pre-wrap;">${content}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/conversations/${conversationId}"
             style="background-color: #334155; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Répondre au message
          </a>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Pour répondre, utilisez le panneau d'administration ou répondez directement à cet email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Envoyer via SMTP
    const result = await sendEmail({
      from: emailFrom,
      to: ADMIN_EMAIL, // Primary recipient
      bcc: forwardingEmails, // Send as BCC (cci)
      replyTo: fromEmail,
      subject: emailSubject,
      html,
    });

    if (!result.success) {
      console.error('Error sending conversation email to admin:', result.error);
      await logConversationEmail({
        emailType: 'conversation_to_admin',
        from: emailFrom,
        to: forwardingEmails.join(', '),
        subject: emailSubject,
        htmlContent: html,
        conversationId,
        messageId,
        status: 'failed',
        errorMessage: result.error,
      });
      return { success: false, error: result.error };
    }

    // Logger le succès
    await logConversationEmail({
      emailType: 'conversation_to_admin',
      from: emailFrom,
      to: forwardingEmails.join(', '),
      subject: emailSubject,
      htmlContent: html,
      conversationId,
      messageId,
      status: 'sent',
      smtpMessageId: result.messageId,
    });

    console.log(`📧 Conversation message sent to: ${forwardingEmails.join(', ')}`);

    return { success: true, data: { id: result.messageId } };
  } catch (error) {
    console.error('Error sending conversation email to admin:', error);
    await logConversationEmail({
      emailType: 'conversation_to_admin',
      from: emailFrom,
      to: forwardingEmails.join(', '),
      subject: emailSubject,
      htmlContent: html,
      conversationId,
      messageId,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error };
  }
}

// Email de notification pour une réponse admin → client
export async function sendConversationMessageToClient({
  conversationId,
  messageId,
  toEmail,
  toName,
  subject,
  content,
  reservationId,
}: {
  conversationId: string;
  messageId: string;
  toEmail: string;
  toName: string;
  subject: string;
  content: string;
  reservationId?: string;
}) {
  const emailFrom = 'Chalet-Balmotte810 <noreply@chalet-balmotte810.com>';
  const adminEmail = process.env.ADMIN_EMAIL || 'contact@chalet-balmotte810.com';
  const emailSubject = `Réponse: ${subject}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle réponse - Chalet-Balmotte810</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #334155; margin-bottom: 10px;">🏔️ Chalet-Balmotte810</h1>
          <p style="color: #666; margin: 0;">Châtillon-sur-Cluses, Alpes Françaises</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #334155; margin-top: 0;">Bonjour ${toName},</h2>
          <p>Nous avons répondu à votre message concernant: <strong>${subject}</strong></p>
        </div>

        <div style="background-color: #fff; border: 2px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin-top: 0;">Notre réponse:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${content}</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/client/conversations/${conversationId}"
             style="background-color: #334155; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Voir la conversation complète
          </a>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Pour nous contacter:<br>
            <a href="mailto:${adminEmail}" style="color: #334155;">${adminEmail}</a><br>
            +33 6 85 85 84 91
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Envoyer via SMTP
    const result = await sendEmail({
      from: emailFrom,
      to: toEmail,
      replyTo: adminEmail,
      subject: emailSubject,
      html,
    });

    if (!result.success) {
      console.error('Error sending conversation email to client:', result.error);
      await logConversationEmail({
        emailType: 'conversation_to_client',
        from: emailFrom,
        to: toEmail,
        subject: emailSubject,
        htmlContent: html,
        conversationId,
        messageId,
        status: 'failed',
        errorMessage: result.error,
      });
      return { success: false, error: result.error };
    }

    // Logger le succès
    await logConversationEmail({
      emailType: 'conversation_to_client',
      from: emailFrom,
      to: toEmail,
      subject: emailSubject,
      htmlContent: html,
      conversationId,
      messageId,
      status: 'sent',
      smtpMessageId: result.messageId,
    });

    return { success: true, data: { id: result.messageId } };
  } catch (error) {
    console.error('Error sending conversation email to client:', error);
    await logConversationEmail({
      emailType: 'conversation_to_client',
      from: emailFrom,
      to: toEmail,
      subject: emailSubject,
      htmlContent: html,
      conversationId,
      messageId,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error };
  }
}
