import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAllTestData() {
  try {
    console.log('🧹 Nettoyage complet des données de test...\n');

    // Supprimer tous les messages de test (avec Marie, client.test@email.com, etc.)
    const messagesResult = await prisma.message.deleteMany({
      where: {
        OR: [
          { fromEmail: { contains: 'test@email.com' } },
          { fromEmail: { contains: '.test@' } },
          { fromName: { contains: 'Marie' } },
          { content: { contains: 'Local à ski chauffé avec cha' } },
        ]
      }
    });

    console.log(`✅ ${messagesResult.count} message(s) de test supprimé(s)`);

    // Lister les messages restants
    const remainingMessages = await prisma.message.count();
    console.log(`📬 Messages restants dans la base : ${remainingMessages}\n`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAllTestData();
