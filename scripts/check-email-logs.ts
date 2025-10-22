/**
 * Script pour vérifier les logs d'emails en base de données
 */

import { prisma } from '../lib/prisma';

async function checkEmailLogs() {
  console.log('📧 Verification des logs d\'emails en base de donnees\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Compter les logs par statut
    const stats = await prisma.emailLog.groupBy({
      by: ['status'],
      _count: true,
    });

    console.log('📊 Statistiques:');
    stats.forEach(stat => {
      console.log(`   ${stat.status}: ${stat._count}`);
    });
    console.log('');

    // Afficher les 5 derniers logs
    const recentLogs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        emailType: true,
        to: true,
        subject: true,
        status: true,
        errorMessage: true,
        createdAt: true,
      },
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Les 5 derniers logs:\n');

    if (recentLogs.length === 0) {
      console.log('   Aucun log trouvé.');
    } else {
      recentLogs.forEach((log, index) => {
        console.log(`${index + 1}. [${log.status.toUpperCase()}] ${log.emailType}`);
        console.log(`   À: ${log.to}`);
        console.log(`   Sujet: ${log.subject}`);
        console.log(`   Date: ${log.createdAt.toLocaleString('fr-FR')}`);
        if (log.errorMessage) {
          console.log(`   Erreur: ${log.errorMessage.substring(0, 100)}...`);
        }
        console.log('');
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Vérification terminée!');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmailLogs();
