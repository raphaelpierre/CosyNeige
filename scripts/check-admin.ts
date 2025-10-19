import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'administration@chalet-balmotte810.com' }
    });

    if (!admin) {
      console.log('❌ Aucun admin trouvé avec cet email');
      return;
    }

    console.log('👤 Admin trouvé:');
    console.log('  - Email:', admin.email);
    console.log('  - Role:', admin.role);
    console.log('  - passwordSet:', admin.passwordSet);
    console.log('  - Mot de passe existe:', admin.password ? 'Oui' : 'Non');
    console.log('  - Créé le:', admin.createdAt);

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
