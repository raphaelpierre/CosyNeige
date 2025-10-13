import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const messageId = params.id;

    // Vérifier que le message existe
    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Supprimer le message
    await prisma.message.delete({
      where: { id: messageId }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}