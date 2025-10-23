import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/smtp';
import { verifyToken } from '@/lib/utils/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/send-custom-email
 * Send custom email to one or more recipients
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await verifyToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { recipients, subject, message, recipientType } = body;

    // Validation
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Recipients are required' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Resolve recipients (if user IDs provided, fetch emails)
    let recipientEmails: string[] = [];
    let recipientNames: { email: string; name: string }[] = [];

    if (recipientType === 'users' || recipientType === 'clients') {
      // Fetch user emails from database
      const users = await prisma.user.findMany({
        where: {
          id: { in: recipients },
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      recipientEmails = users.map(u => u.email);
      recipientNames = users.map(u => ({
        email: u.email,
        name: `${u.firstName} ${u.lastName}`,
      }));
    } else {
      // Direct email addresses
      recipientEmails = recipients;
      recipientNames = recipients.map((email: string) => ({ email, name: email }));
    }

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { error: 'No valid recipients found' },
        { status: 400 }
      );
    }

    // Create HTML email
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #334155; margin-bottom: 10px;">🏔️ Chalet-Balmotte810</h1>
            <p style="color: #666; margin: 0;">Châtillon-sur-Cluses, Alpes Françaises</p>
          </div>

          <div style="background-color: #fff; border: 2px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #334155; margin-top: 0;">${subject}</h2>
            <div style="white-space: pre-wrap;">${message}</div>
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

    // Send emails (one by one to personalize if needed, or BCC for bulk)
    const results = [];

    if (recipientEmails.length === 1) {
      // Single recipient - direct email
      const result = await sendEmail({
        from: 'Chalet-Balmotte810 <noreply@chalet-balmotte810.com>',
        to: recipientEmails[0],
        subject,
        html,
        text: message,
        replyTo: process.env.ADMIN_EMAIL,
      });

      results.push({
        email: recipientEmails[0],
        success: result.success,
        error: result.error,
      });
    } else {
      // Multiple recipients - use BCC
      const result = await sendEmail({
        from: 'Chalet-Balmotte810 <noreply@chalet-balmotte810.com>',
        to: process.env.ADMIN_EMAIL || 'contact@chalet-balmotte810.com',
        bcc: recipientEmails,
        subject,
        html,
        text: message,
        replyTo: process.env.ADMIN_EMAIL,
      });

      results.push({
        emails: recipientEmails,
        success: result.success,
        error: result.error,
      });
    }

    // Log the email in database (optional)
    try {
      await prisma.emailLog.create({
        data: {
          emailType: 'custom_admin_email',
          from: 'noreply@chalet-balmotte810.com',
          to: recipientEmails.join(', '),
          subject,
          htmlContent: html,
          status: results.every(r => r.success) ? 'sent' : 'failed',
          sentAt: new Date(),
        },
      });
    } catch (logError) {
      console.error('Error logging email:', logError);
      // Don't fail the request if logging fails
    }

    const allSuccessful = results.every(r => r.success);

    return NextResponse.json({
      success: allSuccessful,
      results,
      message: allSuccessful
        ? `Email sent successfully to ${recipientEmails.length} recipient(s)`
        : 'Some emails failed to send',
    });

  } catch (error) {
    console.error('Error sending custom email:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
