import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function fixAdminPassword() {
  try {
    console.log('🔍 Vérification du mot de passe admin...');
    
    // Récupérer l'utilisateur admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@chalet-balmotte810.com' }
    });

    if (!admin) {
      console.log('❌ Utilisateur admin non trouvé');
      return;
    }

    console.log('✅ Admin trouvé:', admin.email);

    // Tester le mot de passe actuel
    const testPassword = 'admin123!';
    const isCurrentPasswordValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log('🔐 Test du mot de passe actuel:', isCurrentPasswordValid ? '✅ VALIDE' : '❌ INVALIDE');

    if (!isCurrentPasswordValid) {
      console.log('🔧 Réinitialisation du mot de passe...');
      
      // Créer un nouveau hash pour le mot de passe
      const newHashedPassword = await bcrypt.hash(testPassword, 12);
      
      // Mettre à jour le mot de passe dans la base
      await prisma.user.update({
        where: { id: admin.id },
        data: { password: newHashedPassword }
      });

      console.log('✅ Mot de passe réinitialisé avec succès !');
      
      // Re-tester
      const admin2 = await prisma.user.findUnique({
        where: { email: 'admin@chalet-balmotte810.com' }
      });
      
      const isNewPasswordValid = await bcrypt.compare(testPassword, admin2!.password);
      console.log('🔐 Test du nouveau mot de passe:', isNewPasswordValid ? '✅ VALIDE' : '❌ INVALIDE');
    }

    console.log('\n📝 Informations de connexion admin:');
    console.log('- Email: admin@chalet-balmotte810.com');
    console.log('- Mot de passe: admin123!');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminPassword();