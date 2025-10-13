import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';

export async function GET(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Récupérer les messages de contact et les messages internes
    const [contactMessages, internalMessages] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.findMany({
        include: {
          fromUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Combiner et normaliser les messages
    const allMessages = [
      ...contactMessages.map(msg => ({
        id: msg.id,
        type: 'contact',
        subject: msg.subject,
        content: msg.message,
        fromName: msg.name,
        fromEmail: msg.email,
        read: msg.read,
        createdAt: msg.createdAt,
        // Propriétés pour compatibilité avec l'interface
        name: msg.name,
        email: msg.email,
        message: msg.message,
        date: msg.createdAt.toISOString(),
        isFromAdmin: false
      })),
      ...internalMessages.map(msg => ({
        id: msg.id,
        type: 'internal',
        subject: msg.subject,
        content: msg.content,
        fromName: msg.fromName,
        fromEmail: msg.fromEmail,
        read: msg.read,
        createdAt: msg.createdAt,
        fromUser: msg.fromUser,
        // Propriétés pour compatibilité avec l'interface
        name: msg.fromName,
        email: msg.fromEmail,
        message: msg.content,
        date: msg.createdAt.toISOString(),
        isFromAdmin: msg.isFromAdmin
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(allMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { messageId, type, read } = await req.json();

    if (!messageId || !type) {
      return NextResponse.json(
        { error: 'ID et type de message requis' },
        { status: 400 }
      );
    }

    let updatedMessage;
    
    if (type === 'contact') {
      updatedMessage = await prisma.contactMessage.update({
        where: { id: messageId },
        data: { read: read ?? true }
      });
    } else {
      updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: { read: read ?? true }
      });
    }

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du message' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { messageId, type } = await req.json();

    if (!messageId || !type) {
      return NextResponse.json(
        { error: 'ID et type de message requis' },
        { status: 400 }
      );
    }

    if (type === 'contact') {
      await prisma.contactMessage.delete({
        where: { id: messageId }
      });
    } else {
      await prisma.message.delete({
        where: { id: messageId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du message' },
      { status: 500 }
    );
  }
}

// POST - Répondre à un message
export async function POST(req: NextRequest) {
  try {
    // Vérification de l'authentification et du rôle admin
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { messageId, type, replyContent, recipientEmail } = await req.json();

    if (!messageId || !replyContent || !recipientEmail) {
      return NextResponse.json(
        { error: 'Données manquantes pour la réponse' },
        { status: 400 }
      );
    }

    // Créer une réponse dans la table Message
    const reply = await prisma.message.create({
      data: {
        subject: `Re: ${type === 'contact' ? 'Votre message' : 'Message'}`,
        content: replyContent,
        fromEmail: user.email,
        fromName: `${user.firstName} ${user.lastName}`,
        isFromAdmin: true,
        read: false,
        replyTo: messageId
      }
    });

    // Marquer le message original comme lu
    if (type === 'contact') {
      await prisma.contactMessage.update({
        where: { id: messageId },
        data: { read: true }
      });
    } else {
      await prisma.message.update({
        where: { id: messageId },
        data: { read: true }
      });
    }

    return NextResponse.json(reply);
  } catch (error) {
    console.error('Error replying to message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la réponse' },
      { status: 500 }
    );
  }
}