import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        passwordSet: true,
        createdAt: true
      }
    });

    console.log(`\n📋 Total: ${users.length} utilisateur(s)\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Nom: ${user.firstName} ${user.lastName}`);
      console.log(`   - Mot de passe défini: ${user.passwordSet ? 'Oui' : 'Non'}`);
      console.log(`   - Créé le: ${user.createdAt}`);
      console.log('');
    });

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
