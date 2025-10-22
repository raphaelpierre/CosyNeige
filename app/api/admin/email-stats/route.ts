import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les statistiques des emails
export async function GET() {
  try {
    // Statistiques globales
    const [
      totalSent,
      totalFailed,
      totalPending,
      byType,
      recentErrors,
    ] = await Promise.all([
      // Total envoyés
      prisma.emailLog.count({ where: { status: 'sent' } }),

      // Total échoués
      prisma.emailLog.count({ where: { status: 'failed' } }),

      // Total en attente
      prisma.emailLog.count({ where: { status: 'pending' } }),

      // Par type d'email
      prisma.emailLog.groupBy({
        by: ['emailType', 'status'],
        _count: true,
      }),

      // Dernières erreurs (10)
      prisma.emailLog.findMany({
        where: { status: 'failed' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          emailType: true,
          to: true,
          subject: true,
          errorMessage: true,
          createdAt: true,
        },
      }),
    ]);

    // Statistiques des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7Days = await prisma.emailLog.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: true,
    });

    // Organiser les stats par type
    const statsByType: Record<string, { sent: number; failed: number; pending: number }> = {};
    byType.forEach((stat) => {
      if (!statsByType[stat.emailType]) {
        statsByType[stat.emailType] = { sent: 0, failed: 0, pending: 0 };
      }
      statsByType[stat.emailType][stat.status as 'sent' | 'failed' | 'pending'] = stat._count;
    });

    return NextResponse.json({
      global: {
        sent: totalSent,
        failed: totalFailed,
        pending: totalPending,
        total: totalSent + totalFailed + totalPending,
        successRate: totalSent + totalFailed > 0
          ? ((totalSent / (totalSent + totalFailed)) * 100).toFixed(2) + '%'
          : 'N/A',
      },
      byType: statsByType,
      last7Days: {
        sent: last7Days.find(s => s.status === 'sent')?._count || 0,
        failed: last7Days.find(s => s.status === 'failed')?._count || 0,
        pending: last7Days.find(s => s.status === 'pending')?._count || 0,
      },
      recentErrors,
    });
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email stats' },
      { status: 500 }
    );
  }
}
