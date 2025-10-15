import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';

// POST - Envoyer un message à un ou plusieurs utilisateurs
export async function POST(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { userIds, subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Sujet et contenu requis' },
        { status: 400 }
      );
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un destinataire est requis' },
        { status: 400 }
      );
    }

    // Récupérer les informations des destinataires
    const recipients = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Aucun destinataire valide trouvé' },
        { status: 400 }
      );
    }

    // Créer un message pour chaque destinataire
    const messages = await Promise.all(
      recipients.map(recipient =>
        prisma.message.create({
          data: {
            subject,
            content,
            fromEmail: user.email,
            fromName: `${user.firstName} ${user.lastName}`,
            isFromAdmin: true,
            read: false,
            fromUserId: user.id,
            // Associer le message à l'utilisateur destinataire si possible
            ...(recipient.id && { userId: recipient.id })
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      messagesSent: messages.length,
      recipients: recipients.map(r => ({
        id: r.id,
        email: r.email,
        name: `${r.firstName} ${r.lastName}`
      }))
    });
  } catch (error) {
    console.error('Error sending messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi des messages' },
      { status: 500 }
    );
  }
}
