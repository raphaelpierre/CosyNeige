import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminUser() {
  try {
    console.log('🧪 Test de l\'utilisateur admin...');
    
    // Récupérer l'utilisateur admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@chalet-balmotte810.com' }
    });

    if (!admin) {
      console.log('❌ Utilisateur admin non trouvé');
      return;
    }

    console.log('✅ Utilisateur admin trouvé:');
    console.log('- ID:', admin.id);
    console.log('- Email:', admin.email);
    console.log('- Nom complet:', admin.firstName, admin.lastName);
    console.log('- Rôle:', admin.role);

    // Test de la requête similaire à celle de l'API /api/auth/me
    const userForApi = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });

    console.log('\n📡 Données qui seraient retournées par l\'API /api/auth/me:');
    console.log(JSON.stringify(userForApi, null, 2));

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminUser();