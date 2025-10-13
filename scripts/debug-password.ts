import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function debugPasswordIssue() {
  try {
    console.log('🔍 Debug du problème de mot de passe...\n');
    
    // Récupérer l'utilisateur admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@chalet-balmotte810.com' }
    });

    if (!admin) {
      console.log('❌ Utilisateur admin non trouvé');
      return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log('- Email:', admin.email);
    console.log('- Hash stocké:', admin.password);
    console.log('- Longueur du hash:', admin.password.length);
    console.log('- Commence par $2a ou $2b:', admin.password.startsWith('$2'));

    // Tester différentes variantes du mot de passe
    const passwords = ['admin123!', 'admin123', 'Admin123!', 'ADMIN123!'];
    
    console.log('\n🔐 Test des mots de passe:');
    for (const pwd of passwords) {
      try {
        const isValid = await bcrypt.compare(pwd, admin.password);
        console.log(`- "${pwd}": ${isValid ? '✅ VALIDE' : '❌ INVALIDE'}`);
      } catch (error) {
        console.log(`- "${pwd}": ❌ ERREUR - ${error}`);
      }
    }

    console.log('\n🔧 Réinitialisation du mot de passe...');
    
    // Créer un nouveau hash avec bcryptjs
    const newPassword = 'admin123!';
    const newHash = await bcrypt.hash(newPassword, 12);
    
    console.log('- Nouveau hash:', newHash);
    console.log('- Longueur:', newHash.length);
    
    // Tester le nouveau hash avant de l'enregistrer
    const testNewHash = await bcrypt.compare(newPassword, newHash);
    console.log('- Test du nouveau hash:', testNewHash ? '✅ OK' : '❌ ERREUR');
    
    if (testNewHash) {
      // Mettre à jour dans la base
      await prisma.user.update({
        where: { id: admin.id },
        data: { password: newHash }
      });
      
      console.log('✅ Mot de passe mis à jour avec succès!');
      
      // Vérification finale
      const updatedAdmin = await prisma.user.findUnique({
        where: { email: 'admin@chalet-balmotte810.com' }
      });
      
      const finalTest = await bcrypt.compare('admin123!', updatedAdmin!.password);
      console.log('🎯 Test final:', finalTest ? '✅ SUCCESS' : '❌ FAILED');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugPasswordIssue();