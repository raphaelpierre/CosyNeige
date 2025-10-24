/**
 * Configuration SMTP pour l'envoi d'emails via notre serveur VPS
 */

import nodemailer from 'nodemailer';

// Configuration du transporteur SMTP
const smtpPort = parseInt(process.env.SMTP_PORT || '25');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: smtpPort,
  secure: false, // false pour port 25 ou STARTTLS (port 587)
  requireTLS: smtpPort === 587, // TLS requis seulement pour port 587
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
  tls: {
    rejectUnauthorized: false, // Accepter les certificats auto-signés
  },
});

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
 * Envoie un email via SMTP
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const fromAddress = options.from || process.env.SMTP_FROM || 'noreply@chalet-balmotte810.com';

    const mailOptions = {
      from: fromAddress,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
    };

    console.log('📤 Sending email via SMTP:', {
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
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Vérifie la connexion SMTP
 */
export async function verifySMTPConnection() {
  try {
    await transporter.verify();
    console.log('✅ SMTP server is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ SMTP server connection failed:', error);
    return false;
  }
}
