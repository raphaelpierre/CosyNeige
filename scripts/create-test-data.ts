import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestInvoice() {
  try {
    // D'abord, créer un utilisateur test si il n'existe pas
    let testUser = await prisma.user.findUnique({
      where: { email: 'client.test@email.com' }
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'client.test@email.com',
          firstName: 'Marie',
          lastName: 'Dupont',
          phone: '+33 6 12 34 56 78',
          password: 'hashedpassword' // Normalement hashé avec bcrypt
        }
      });
      console.log('✅ Utilisateur test créé:', testUser.email);
    }

    // Créer une réservation test
    const testReservation = await prisma.reservation.create({
      data: {
        guestName: `${testUser.firstName} ${testUser.lastName}`,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone || '+33 6 12 34 56 78',
        checkIn: new Date('2025-02-15'),
        checkOut: new Date('2025-02-22'),
        guests: 6,
        message: 'Séjour familial pour les vacances d\'hiver. Nous aimerions profiter du jacuzzi et des pistes de ski.',
        totalPrice: 2870,
        status: 'confirmed',
        paymentStatus: 'deposit_paid',
        stripePaymentId: 'ch_test_1234567890',
        depositAmount: 1500,
        userId: testUser.id
      }
    });

    console.log('✅ Réservation test créée:', testReservation.id);

    // Créer quelques messages test
    await prisma.message.create({
      data: {
        subject: 'Confirmation de réservation',
        content: 'Bonjour Marie, votre réservation est confirmée ! Nous avons hâte de vous accueillir au chalet. N\'hésitez pas si vous avez des questions.',
        fromEmail: 'admin@chalet-balmotte810.com',
        fromName: 'Équipe Chalet-Balmotte810',
        fromUserId: null,
        isFromAdmin: true,
        read: false
      }
    });

    await prisma.message.create({
      data: {
        subject: 'Question sur les équipements',
        content: 'Bonjour, pourriez-vous me confirmer si le chalet dispose bien d\'un local à ski chauffé et de chauffe-chaussures ? Merci !',
        fromEmail: testUser.email,
        fromName: `${testUser.firstName} ${testUser.lastName}`,
        fromUserId: testUser.id,
        isFromAdmin: false,
        read: true
      }
    });

    console.log('✅ Messages test créés');

    console.log('\n🎉 Données de test créées avec succès !');
    console.log('📧 Email du client test:', testUser.email);
    console.log('🏠 Réservation:', `${testReservation.checkIn} → ${testReservation.checkOut}`);
    console.log('💰 Total:', testReservation.totalPrice, '€');

  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestInvoice();