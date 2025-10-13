import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Vérifier si un utilisateur admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (existingAdmin) {
    console.log('Un utilisateur admin existe déjà');
    return;
  }

  // Créer l'utilisateur admin par défaut
  const hashedPassword = await bcrypt.hash('admin123!', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@chalet-balmotte810.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Chalet-Balmotte810',
      phone: '+33123456789',
      role: 'admin'
    }
  });

  console.log('Utilisateur admin créé:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });