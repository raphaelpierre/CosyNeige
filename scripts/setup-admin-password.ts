import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupAdminPassword() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@chalet-balmotte810.com' }
    });

    if (!admin) {
      console.log('❌ Admin non trouvé');
      return;
    }

    console.log('👤 Admin trouvé:', admin.email);
    console.log('📝 Définition du mot de passe admin...');

    // Mot de passe par défaut : "Admin123!"
    // IMPORTANT: Changez ce mot de passe après la première connexion
    const defaultPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

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
    console.log('🔐 Informations de connexion:');
    console.log('   Email: admin@chalet-balmotte810.com');
    console.log('   Mot de passe: Admin123!');
    console.log('');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdminPassword();
