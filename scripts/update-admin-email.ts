import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdminEmail() {
  try {
    // Trouver l'utilisateur admin existant
    const existingAdmin = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@cosyneige.fr' },
          { role: 'admin' }
        ]
      }
    });

    if (!existingAdmin) {
      console.log('Aucun utilisateur admin trouvé');
      return;
    }

    // Mettre à jour l'email
    const updatedAdmin = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { 
        email: 'admin@chalet-balmotte810.com' 
      }
    });

    console.log('Email admin mis à jour:', updatedAdmin.email);
    console.log('ID:', updatedAdmin.id);
    console.log('Rôle:', updatedAdmin.role);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminEmail();