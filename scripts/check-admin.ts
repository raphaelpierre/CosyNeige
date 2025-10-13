import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('🔍 Vérification de l\'utilisateur admin...');
    
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@chalet-balmotte810.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    if (!admin) {
      console.log('❌ Aucun utilisateur admin trouvé');
      return;
    }

    console.log('✅ Utilisateur admin trouvé:');
    console.log('- ID:', admin.id);
    console.log('- Email:', admin.email);
    console.log('- Nom:', admin.firstName, admin.lastName);
    console.log('- Rôle:', admin.role);
    console.log('- Créé le:', admin.createdAt);

    // Vérifier si le rôle est bien 'admin'
    if (admin.role !== 'admin') {
      console.log('⚠️  Le rôle n\'est pas "admin", correction en cours...');
      
      await prisma.user.update({
        where: { id: admin.id },
        data: { role: 'admin' }
      });
      
      console.log('✅ Rôle corrigé vers "admin"');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();