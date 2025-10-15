import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listMessages() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    console.log(`\n📬 Messages dans la base de données (${messages.length} derniers):\n`);

    if (messages.length === 0) {
      console.log('   Aucun message trouvé.\n');
    } else {
      messages.forEach((msg, index) => {
        console.log(`${index + 1}. [${msg.isFromAdmin ? 'ADMIN' : 'CLIENT'}] ${msg.subject}`);
        console.log(`   De: ${msg.fromName} (${msg.fromEmail})`);
        console.log(`   Contenu: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`);
        console.log(`   Date: ${msg.createdAt.toLocaleString('fr-FR')}`);
        console.log(`   Archivé: ${msg.archived ? 'Oui' : 'Non'}, Lu: ${msg.read ? 'Oui' : 'Non'}\n`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listMessages();
