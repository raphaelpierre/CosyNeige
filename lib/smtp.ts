/**
 * Configuration SMTP pour l'envoi d'emails via notre serveur VPS
 */

import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// En développement, utiliser Resend (le port 25 est bloqué par les FAI)
// En production, utiliser notre serveur SMTP
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const USE_SMTP = process.env.USE_SMTP === 'true' || IS_PRODUCTION;

// Resend pour le développement
const resend = process.env.RESEND_API_KEY && !USE_SMTP
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Configuration du transporteur SMTP pour la production
const transporter = USE_SMTP ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || '51.83.99.118',
  port: parseInt(process.env.SMTP_PORT || '25'),
  secure: false, // true pour port 465, false pour autres ports (25, 587)
  // Pour l'instant, pas d'authentification (relay local)
  // On peut ajouter auth plus tard si nécessaire
  tls: {
    rejectUnauthorized: false, // Accepter les certificats auto-signés
  },
}) : null;

export interface EmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  bcc?: string | string[];
}

/**
 * Envoie un email via SMTP ou Resend selon le mode
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const fromAddress = options.from || process.env.SMTP_FROM || 'noreply@chalet-balmotte810.com';

    // Mode développement : utiliser Resend
    if (!USE_SMTP && resend) {
      console.log('📤 Sending email via Resend (dev mode):', {
        from: fromAddress,
        to: options.to,
        subject: options.subject,
      });

      const emailPayload: any = {
        from: fromAddress,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
      };

      if (options.html) emailPayload.html = options.html;
      if (options.text) emailPayload.text = options.text;
      if (options.replyTo) emailPayload.replyTo = options.replyTo;
      if (options.bcc) emailPayload.bcc = Array.isArray(options.bcc) ? options.bcc : [options.bcc];

      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        console.error('❌ Error sending email via Resend:', error);
        return {
          success: false,
          error: JSON.stringify(error),
        };
      }

      console.log('✅ Email sent successfully via Resend:', {
        messageId: data?.id,
      });

      return {
        success: true,
        messageId: data?.id,
        response: 'Sent via Resend',
      };
    }

    // Mode production : utiliser SMTP
    if (USE_SMTP && transporter) {
      const mailOptions = {
        from: fromAddress,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      };

      console.log('📤 Sending email via SMTP (production mode):', {
        from: fromAddress,
        to: options.to,
        subject: options.subject,
      });

      const info = await transporter.sendMail(mailOptions);

      console.log('✅ Email sent successfully via SMTP:', {
        messageId: info.messageId,
        response: info.response,
      });

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    }

    // Aucun service d'email configuré
    const error = 'No email service configured (neither Resend nor SMTP)';
    console.error('❌', error);
    return {
      success: false,
      error,
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Vérifie la connexion SMTP (seulement en mode production)
 */
export async function verifySMTPConnection() {
  if (!USE_SMTP) {
    console.log('ℹ️ In development mode, using Resend (skipping SMTP verification)');
    return true;
  }

  if (!transporter) {
    console.error('❌ SMTP transporter not initialized');
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ SMTP server is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ SMTP server connection failed:', error);
    return false;
  }
}
