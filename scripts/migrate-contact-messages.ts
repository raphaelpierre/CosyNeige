/**
 * Script pour migrer les anciens ContactMessage vers Conversations
 */

import { prisma } from '../lib/prisma';

async function migrateContactMessages() {
  console.log('📧 Migration des anciens ContactMessage vers Conversations\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Récupérer tous les ContactMessage
    const contactMessages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'asc' },
    });

    console.log(`Trouvé ${contactMessages.length} message(s) à migrer\n`);

    if (contactMessages.length === 0) {
      console.log('✅ Aucune donnée à migrer.');
      return;
    }

    let migrated = 0;
    let skipped = 0;

    for (const msg of contactMessages) {
      console.log(`\nMigration: ${msg.name} - ${msg.subject}`);

      try {
        // Vérifier si l'utilisateur existe
        let user = await prisma.user.findUnique({
          where: { email: msg.email },
        });

        // Créer l'utilisateur s'il n'existe pas
        if (!user) {
          const nameParts = msg.name.split(' ');
          const firstName = nameParts[0] || msg.name;
          const lastName = nameParts.slice(1).join(' ') || '';

          user = await prisma.user.create({
            data: {
              email: msg.email,
              firstName,
              lastName,
              password: null,
              passwordSet: false,
              role: 'client',
            },
          });
          console.log(`  ✅ Utilisateur créé: ${user.email}`);
        } else {
          console.log(`  ℹ️  Utilisateur existant: ${user.email}`);
        }

        // Vérifier si une conversation similaire existe déjà
        const existingConv = await prisma.conversation.findFirst({
          where: {
            userId: user.id,
            subject: msg.subject,
            createdAt: msg.createdAt,
          },
        });

        if (existingConv) {
          console.log(`  ⚠️  Conversation déjà migrée (skip)`);
          skipped++;
          continue;
        }

        // Créer la conversation
        const conversation = await prisma.conversation.create({
          data: {
            userId: user.id,
            subject: msg.subject,
            status: 'open',
            unreadByAdmin: msg.read ? 0 : 1,
            unreadByClient: 0,
            lastMessageFrom: 'client',
            lastMessageAt: msg.createdAt,
            createdAt: msg.createdAt,
            messages: {
              create: {
                fromUserId: user.id,
                fromEmail: msg.email,
                fromName: msg.name,
                isFromAdmin: false,
                content: msg.message,
                read: msg.read,
                readAt: msg.read ? msg.createdAt : null,
                createdAt: msg.createdAt,
              },
            },
          },
        });

        console.log(`  ✅ Conversation créée: ${conversation.id}`);
        migrated++;
      } catch (error) {
        console.error(`  ❌ Erreur pour ${msg.email}:`, error);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n✨ Migration terminée!`);
    console.log(`   Migrés: ${migrated}`);
    console.log(`   Ignorés: ${skipped}`);
    console.log(`\n⚠️  Vous pouvez maintenant supprimer la table ContactMessage`);
    console.log(`   npx prisma migrate dev --name remove_legacy_message_models\n`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateContactMessages();
