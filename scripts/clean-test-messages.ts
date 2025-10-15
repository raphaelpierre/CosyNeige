import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanTestMessages() {
  try {
    console.log('🧹 Nettoyage des messages de test...');

    // Supprimer les messages contenant "Marie" ou d'autres indicateurs de messages de test
    const result = await prisma.message.deleteMany({
      where: {
        OR: [
          { content: { contains: 'Bonjour Marie' } },
          { content: { contains: 'Local à ski chauffé' } },
          { subject: { contains: 'Confirmation de réservation' } },
          { fromName: { contains: 'Équipe Chalet-Balmotte810' } },
        ]
      }
    });

    console.log(`✅ ${result.count} message(s) de test supprimé(s)`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanTestMessages();
