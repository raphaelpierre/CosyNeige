const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient()

async function checkAdminUser() {
  try {
    console.log('🔍 Checking admin user...')
    
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@chalet-balmotte810.com' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   - ID: ${adminUser.id}`);
      console.log(`   - Email: ${adminUser.email}`);
      console.log(`   - Name: ${adminUser.firstName} ${adminUser.lastName}`);
      console.log(`   - Role: ${adminUser.role}`);
      console.log(`   - Created: ${adminUser.createdAt}`);
      
      // Test password
      const testPassword = 'ChaletAdmin123!';
      const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
      console.log(`   - Password test (${testPassword}): ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
      
      if (!isPasswordValid) {
        console.log('\n🔧 Updating admin password...');
        const newHashedPassword = await bcrypt.hash(testPassword, 12);
        await prisma.user.update({
          where: { id: adminUser.id },
          data: { password: newHashedPassword }
        });
        console.log('✅ Password updated successfully!');
      }
    } else {
      console.log('❌ Admin user not found!');
      console.log('\n🔧 Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('ChaletAdmin123!', 12);
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@chalet-balmotte810.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Chalet-Balmotte810',
          role: 'admin'
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log(`   - ID: ${newAdmin.id}`);
      console.log(`   - Email: ${newAdmin.email}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();