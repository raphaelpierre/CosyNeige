import { Resend } from 'resend';
import { prisma } from './prisma';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Helper pour logger les emails en base de données
async function logEmail({
  emailType,
  from,
  to,
  replyTo,
  subject,
  htmlContent,
  textContent,
  reservationId,
  userId,
  status,
  resendId,
  errorMessage,
}: {
  emailType: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  reservationId?: string;
  userId?: string;
  status: 'pending' | 'sent' | 'failed';
  resendId?: string;
  errorMessage?: string;
}) {
  try {
    await prisma.emailLog.create({
      data: {
        emailType,
        from,
        to,
        replyTo,
        subject,
        htmlContent,
        textContent,
        reservationId,
        userId,
        status,
        resendId,
        errorMessage,
        sentAt: status === 'sent' ? new Date() : null,
      },
    });
  } catch (error) {
    console.error('Error logging email:', error);
    // Ne pas bloquer l'envoi d'email si le logging échoue
  }
}

// Email de confirmation de réservation pour le client
export async function sendBookingConfirmation({
  to,
  firstName,
  lastName,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  reservationId
}: {
  to: string;
  firstName: string;
  lastName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  reservationId: string;
}) {
  const checkInDate = new Date(checkIn).toLocaleDateString('fr-FR');
  const checkOutDate = new Date(checkOut).toLocaleDateString('fr-FR');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de réservation - Chalet-Balmotte810</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2d5016; margin-bottom: 10px;">🏔️ Chalet-Balmotte810</h1>
          <p style="color: #666; margin: 0;">Châtillon-sur-Cluses, Alpes Françaises</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2d5016; margin-top: 0;">Confirmation de votre réservation</h2>
          <p>Bonjour ${firstName} ${lastName},</p>
          <p>Nous avons bien reçu votre demande de réservation. Voici le récapitulatif :</p>
        </div>

        <div style="background-color: #fff; border: 2px solid #2d5016; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #2d5016; margin-top: 0;">Détails de la réservation</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Référence :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reservationId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Arrivée :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${checkInDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Départ :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${checkOutDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nombre de personnes :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${guests}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Prix total :</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #2d5016;">${totalPrice.toLocaleString('fr-FR')}€</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0;"><strong>⚠️ Important :</strong> Cette réservation est en attente de confirmation. Nous vous recontacterons sous 24h pour finaliser votre séjour.</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #2d5016; margin-top: 0;">Prochaines étapes</h3>
          <ul style="padding-left: 20px;">
            <li>Nous examinerons votre demande dans les plus brefs délais</li>
            <li>Vous recevrez un email de confirmation définitive avec les détails de paiement</li>
            <li>Une caution de 1 500€ sera demandée</li>
            <li>Nous vous enverrons le guide d'accès au chalet avant votre arrivée</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Pour toute question, contactez-nous :<br>
            <a href="mailto:contact@chalet-balmotte810.fr" style="color: #2d5016;">contact@chalet-balmotte810.fr</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Confirmation de réservation - Chalet-Balmotte810

Bonjour ${firstName} ${lastName},

Nous avons bien reçu votre demande de réservation.

Détails de la réservation :
- Référence : ${reservationId}
- Arrivée : ${checkInDate}
- Départ : ${checkOutDate}
- Nombre de personnes : ${guests}
- Prix total : ${totalPrice.toLocaleString('fr-FR')}€

Cette réservation est en attente de confirmation. Nous vous recontacterons sous 24h.

Cordialement,
L'équipe Chalet-Balmotte810
  `;

  const emailFrom = 'Chalet-Balmotte810 <noreply@chalet-balmotte810.com>';
  const emailSubject = 'Confirmation de votre réservation - Chalet-Balmotte810';

  try {
    if (!resend) {
      console.warn('Resend is not configured. Email sending is disabled.');
      await logEmail({
        emailType: 'booking_confirmation',
        from: emailFrom,
        to,
        subject: emailSubject,
        htmlContent: html,
        textContent: text,
        reservationId,
        status: 'failed',
        errorMessage: 'Resend not configured',
      });
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to,
      subject: emailSubject,
      html,
      text,
    });

    if (error) {
      console.error('Error sending booking confirmation email:', error);
      await logEmail({
        emailType: 'booking_confirmation',
        from: emailFrom,
        to,
        subject: emailSubject,
        htmlContent: html,
        textContent: text,
        reservationId,
        status: 'failed',
        errorMessage: JSON.stringify(error),
      });
      return { success: false, error };
    }

    // Logger le succès
    await logEmail({
      emailType: 'booking_confirmation',
      from: emailFrom,
      to,
      subject: emailSubject,
      htmlContent: html,
      textContent: text,
      reservationId,
      status: 'sent',
      resendId: data?.id,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    await logEmail({
      emailType: 'booking_confirmation',
      from: emailFrom,
      to,
      subject: emailSubject,
      htmlContent: html,
      textContent: text,
      reservationId,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error };
  }
}

// Email de notification pour l'admin
export async function sendAdminNotification({
  firstName,
  lastName,
  email,
  phone,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  message,
  reservationId
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  message?: string;
  reservationId: string;
}) {
  const checkInDate = new Date(checkIn).toLocaleDateString('fr-FR');
  const checkOutDate = new Date(checkOut).toLocaleDateString('fr-FR');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle réservation - Chalet-Balmotte810</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2d5016;">🏔️ Nouvelle réservation</h1>
        </div>
        
        <div style="background-color: #fff; border: 2px solid #2d5016; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2d5016; margin-top: 0;">Détails de la réservation</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Référence :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${reservationId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Client :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Téléphone :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Arrivée :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${checkInDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Départ :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${checkOutDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Personnes :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${guests}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Prix total :</strong></td>
              <td style="padding: 8px 0; font-weight: bold;">${totalPrice.toLocaleString('fr-FR')}€</td>
            </tr>
          </table>
          
          ${message ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="color: #2d5016; margin-top: 0;">Message du client :</h3>
            <p style="margin: 0;">${message}</p>
          </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" 
             style="background-color: #2d5016; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Gérer la réservation
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailFrom = 'Chalet-Balmotte810 <noreply@chalet-balmotte810.com>';
  const emailTo = process.env.ADMIN_EMAIL || 'info@chalet-balmotte810.com';
  const emailSubject = `Nouvelle réservation : ${firstName} ${lastName} - ${checkInDate}`;

  try {
    if (!resend) {
      console.warn('Resend is not configured. Email sending is disabled.');
      await logEmail({
        emailType: 'admin_notification',
        from: emailFrom,
        to: emailTo,
        subject: emailSubject,
        htmlContent: html,
        reservationId,
        status: 'failed',
        errorMessage: 'Resend not configured',
      });
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      html,
    });

    if (error) {
      console.error('Error sending admin notification email:', error);
      await logEmail({
        emailType: 'admin_notification',
        from: emailFrom,
        to: emailTo,
        subject: emailSubject,
        htmlContent: html,
        reservationId,
        status: 'failed',
        errorMessage: JSON.stringify(error),
      });
      return { success: false, error };
    }

    // Logger le succès
    await logEmail({
      emailType: 'admin_notification',
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      htmlContent: html,
      reservationId,
      status: 'sent',
      resendId: data?.id,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    await logEmail({
      emailType: 'admin_notification',
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      htmlContent: html,
      reservationId,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error };
  }
}

// Email de contact
export async function sendContactEmail({
  name,
  email,
  phone,
  subject,
  message
}: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouveau message de contact - Chalet-Balmotte810</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2d5016;">💬 Nouveau message de contact</h1>
        </div>

        <div style="background-color: #fff; border: 2px solid #2d5016; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2d5016; margin-top: 0;">Détails du message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nom :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Téléphone :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Sujet :</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="color: #2d5016; margin-top: 0;">Message :</h3>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="mailto:${email}" 
             style="background-color: #2d5016; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Répondre à ${name}
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailFrom = 'Chalet-Balmotte810 <noreply@chalet-balmotte810.com>';
  const emailTo = process.env.ADMIN_EMAIL || 'info@chalet-balmotte810.com';
  const emailSubject = `Contact: ${subject}`;

  try {
    if (!resend) {
      console.warn('Resend is not configured. Email sending is disabled.');
      await logEmail({
        emailType: 'contact',
        from: emailFrom,
        to: emailTo,
        replyTo: email,
        subject: emailSubject,
        htmlContent: html,
        status: 'failed',
        errorMessage: 'Resend not configured',
      });
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      html,
      replyTo: email,
    });

    if (error) {
      console.error('Error sending contact email:', error);
      await logEmail({
        emailType: 'contact',
        from: emailFrom,
        to: emailTo,
        replyTo: email,
        subject: emailSubject,
        htmlContent: html,
        status: 'failed',
        errorMessage: JSON.stringify(error),
      });
      return { success: false, error };
    }

    // Logger le succès
    await logEmail({
      emailType: 'contact',
      from: emailFrom,
      to: emailTo,
      replyTo: email,
      subject: emailSubject,
      htmlContent: html,
      status: 'sent',
      resendId: data?.id,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending contact email:', error);
    await logEmail({
      emailType: 'contact',
      from: emailFrom,
      to: emailTo,
      replyTo: email,
      subject: emailSubject,
      htmlContent: html,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error };
  }
}

// Email d'invitation à créer un compte après réservation
export async function sendAccountCreationInvite({
  to,
  firstName,
  lastName,
  token
}: {
  to: string;
  firstName: string;
  lastName: string;
  token: string;
}) {
  const setupUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/client/setup-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Créez votre compte - Chalet-Balmotte810</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #334155; margin-bottom: 10px;">🏔️ Chalet-Balmotte810</h1>
          <p style="color: #666; margin: 0;">Châtillon-sur-Cluses, Alpes Françaises</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #334155; margin-top: 0;">Bienvenue ${firstName} ${lastName} !</h2>
          <p>Merci pour votre réservation chez Chalet-Balmotte810.</p>
          <p>Nous avons créé un espace client pour vous permettre de gérer facilement vos réservations et messages.</p>
        </div>

        <div style="background-color: #fff; border: 2px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin-top: 0;">Créez votre mot de passe</h3>
          <p>Pour accéder à votre espace client, veuillez créer votre mot de passe en cliquant sur le bouton ci-dessous :</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupUrl}" style="display: inline-block; background-color: #334155; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Créer mon mot de passe
            </a>
          </div>

          <p style="font-size: 14px; color: #666;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
            <a href="${setupUrl}" style="color: #334155; word-break: break-all;">${setupUrl}</a>
          </p>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px;"><strong>⚠️ Ce lien est valable pendant 72 heures.</strong></p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #334155; margin-top: 0;">Avec votre espace client :</h3>
          <ul style="padding-left: 20px;">
            <li>Consultez vos réservations en temps réel</li>
            <li>Échangez des messages avec nous</li>
            <li>Accédez à l'historique de vos séjours</li>
            <li>Bénéficiez d'offres exclusives</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Pour toute question, contactez-nous :<br>
            <a href="mailto:contact@chalet-balmotte810.com" style="color: #334155;">contact@chalet-balmotte810.com</a><br>
            +33 6 85 85 84 91
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Créez votre compte - Chalet-Balmotte810

Bienvenue ${firstName} ${lastName} !

Merci pour votre réservation. Nous avons créé un espace client pour vous.

Pour accéder à votre espace, créez votre mot de passe en cliquant sur ce lien :
${setupUrl}

Ce lien est valable pendant 72 heures.

Avec votre espace client :
- Consultez vos réservations en temps réel
- Échangez des messages avec nous
- Accédez à l'historique de vos séjours
- Bénéficiez d'offres exclusives

Cordialement,
L'équipe Chalet-Balmotte810
  `;

  try {
    if (!resend) {
      console.warn('Resend is not configured. Email sending is disabled.');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: 'Chalet-Balmotte810 <noreply@chalet-balmotte810.com>',
      to,
      subject: 'Créez votre compte - Chalet-Balmotte810',
      html,
      text,
    });

    if (error) {
      console.error('Error sending account creation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending account creation email:', error);
    return { success: false, error };
  }
}