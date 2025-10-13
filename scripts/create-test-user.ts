import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🧪 Création d\'un utilisateur de test...');
    
    // Vérifier si l'utilisateur existe déjà
    const existing = await prisma.user.findUnique({
      where: { email: 'test@chalet-balmotte810.com' }
    });

    if (existing) {
      console.log('✅ Utilisateur de test existe déjà');
      console.log('- Email: test@chalet-balmotte810.com');
      console.log('- Mot de passe: test123!');
      console.log('- Rôle:', existing.role);
      return;
    }

    // Créer l'utilisateur de test
    const hashedPassword = await bcrypt.hash('test123!', 12);
    
    const testUser = await prisma.user.create({
      data: {
        email: 'test@chalet-balmotte810.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        phone: '+33987654321',
        role: 'client'
      }
    });

    console.log('✅ Utilisateur de test créé:');
    console.log('- Email: test@chalet-balmotte810.com');
    console.log('- Mot de passe: test123!');
    console.log('- Rôle:', testUser.role);
    
    // Tester la connexion
    console.log('\n🔐 Test de connexion...');
    const isPasswordValid = await bcrypt.compare('test123!', testUser.password);
    console.log('- Mot de passe valide:', isPasswordValid ? '✅' : '❌');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();