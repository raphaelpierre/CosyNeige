import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function setAdminPassword() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@chalet-balmotte810.com' }
    });

    if (!admin) {
      console.log('❌ Admin non trouvé');
      return;
    }

    console.log('👤 Admin trouvé:', admin.email);
    console.log('');

    const password = await question('🔐 Entrez le nouveau mot de passe admin: ');

    if (!password || password.length < 6) {
      console.log('❌ Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const confirm = await question('🔐 Confirmez le mot de passe: ');

    if (password !== confirm) {
      console.log('❌ Les mots de passe ne correspondent pas');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour l'admin
    await prisma.user.update({
      where: { email: 'admin@chalet-balmotte810.com' },
      data: {
        password: hashedPassword,
        passwordSet: true
      }
    });

    console.log('');
    console.log('✅ Mot de passe admin défini avec succès!');
    console.log('');
    console.log('Vous pouvez maintenant vous connecter avec:');
    console.log('  Email: admin@chalet-balmotte810.com');
    console.log('  Mot de passe: [le mot de passe que vous venez de définir]');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

setAdminPassword();
