import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un log d'email spécifique avec tout son contenu
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const log = await prisma.emailLog.findUnique({
      where: { id },
    });

    if (!log) {
      return NextResponse.json(
        { error: 'Email log not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error fetching email log:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email log' },
      { status: 500 }
    );
  }
}
