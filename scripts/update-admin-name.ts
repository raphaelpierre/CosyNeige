import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdminName() {
  try {
    // Trouver l'utilisateur admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@chalet-balmotte810.com' }
    });

    if (!existingAdmin) {
      console.log('Utilisateur admin non trouvé');
      return;
    }

    // Mettre à jour le nom
    const updatedAdmin = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { 
        firstName: 'Admin',
        lastName: 'Chalet-Balmotte810'
      }
    });

    console.log('Nom admin mis à jour:');
    console.log('- Prénom:', updatedAdmin.firstName);
    console.log('- Nom:', updatedAdmin.lastName);
    console.log('- Email:', updatedAdmin.email);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminName();