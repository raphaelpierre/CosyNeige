import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConversationMessageToAdmin } from '@/lib/conversation-emails';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validation du téléphone (optionnel, mais doit être valide s'il est fourni)
    if (phone && phone.trim()) {
      const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'Invalid phone format' },
          { status: 400 }
        );
      }
    }

    // Vérifier si l'utilisateur existe, sinon le créer
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || '';

      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone: phone || null,
          password: null,
          passwordSet: false,
          role: 'client',
        },
      });
    }

    // Mapper le subject du formulaire vers un sujet lisible
    const subjectMap: Record<string, string> = {
      general: 'Demande générale',
      booking: 'Question sur une réservation',
      facilities: 'Question sur les équipements',
      location: 'Question sur la localisation',
      pricing: 'Question sur les tarifs',
      other: 'Autre demande',
    };

    const conversationSubject = subjectMap[subject] || subject;

    // Créer la conversation avec le premier message
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        subject: conversationSubject,
        status: 'open',
        unreadByAdmin: 1,
        unreadByClient: 0,
        lastMessageFrom: 'client',
        messages: {
          create: {
            fromUserId: user.id,
            fromEmail: email,
            fromName: name,
            isFromAdmin: false,
            content: message,
            read: false,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    // Envoyer l'email de notification à l'admin
    try {
      await sendConversationMessageToAdmin({
        conversationId: conversation.id,
        messageId: conversation.messages[0].id,
        fromName: name,
        fromEmail: email,
        subject: conversationSubject,
        content: message,
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Ne pas bloquer la création de la conversation si l'email échoue
    }

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        conversationId: conversation.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}