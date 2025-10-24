import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les logs d'emails (avec filtres et pagination)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Paramètres de filtres
    const emailType = searchParams.get('emailType');
    const status = searchParams.get('status');
    const to = searchParams.get('to');
    const reservationId = searchParams.get('reservationId');

    // Construire le filtre
    const where: any = {};
    if (emailType) where.emailType = emailType;
    if (status) where.status = status;
    if (to) where.to = { contains: to, mode: 'insensitive' };
    if (reservationId) where.reservationId = reservationId;

    // Récupérer les logs
    const [logs, total] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        select: {
          id: true,
          emailType: true,
          from: true,
          to: true,
          subject: true,
          status: true,
          smtpMessageId: true,
          errorMessage: true,
          reservationId: true,
          userId: true,
          sentAt: true,
          createdAt: true,
          // Ne pas inclure le contenu HTML par défaut pour alléger la réponse
        },
      }),
      prisma.emailLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email logs' },
      { status: 500 }
    );
  }
}
