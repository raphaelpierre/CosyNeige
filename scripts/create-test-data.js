const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestInvoice() {
  try {
    console.log('🚀 Création de données de test pour la facture admin...');

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
          password: '$2b$10$hashedpasswordexample' // Hash bcrypt fictif
        }
      });
      console.log('✅ Utilisateur test créé:', testUser.email);
    } else {
      console.log('ℹ️  Utilisateur test existant:', testUser.email);
    }

    // Créer une réservation test
    const testReservation = await prisma.reservation.create({
      data: {
        guestName: `${testUser.firstName} ${testUser.lastName}`,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone || '+33 6 12 34 56 78',
        checkIn: new Date('2025-02-15T15:00:00Z'),
        checkOut: new Date('2025-02-22T11:00:00Z'),
        guests: 6,
        message: 'Séjour familial pour les vacances d\'hiver. Nous aimerions profiter du jacuzzi et des pistes de ski. Merci !',
        totalPrice: 2870.00,
        status: 'confirmed',
        userId: testUser.id
      }
    });

    console.log('✅ Réservation test créée:');
    console.log('   📅 Dates:', testReservation.checkIn.toLocaleDateString('fr-FR'), '→', testReservation.checkOut.toLocaleDateString('fr-FR'));
    console.log('   👥 Invités:', testReservation.guests);
    console.log('   💰 Prix total:', testReservation.totalPrice, '€');

    // Créer une deuxième réservation avec statut différent
    const testReservation2 = await prisma.reservation.create({
      data: {
        guestName: 'Jean et Sophie Martin',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@email.com',
        phone: '+33 6 87 65 43 21',
        checkIn: new Date('2025-03-08T15:00:00Z'),
        checkOut: new Date('2025-03-15T11:00:00Z'),
        guests: 4,
        message: 'Première visite en montagne. Nous sommes très excités !',
        totalPrice: 1960.00,
        status: 'pending'
      }
    });

    console.log('✅ Deuxième réservation créée:');
    console.log('   👤 Client:', testReservation2.guestName);
    console.log('   📅 Dates:', testReservation2.checkIn.toLocaleDateString('fr-FR'), '→', testReservation2.checkOut.toLocaleDateString('fr-FR'));
    console.log('   🟡 Statut:', testReservation2.status);

    // Créer quelques messages test
    const message1 = await prisma.message.create({
      data: {
        subject: 'Confirmation de réservation',
        content: 'Bonjour Marie,\n\nVotre réservation est confirmée ! Nous avons hâte de vous accueillir au chalet du 15 au 22 février.\n\nInformations importantes :\n- Arrivée : 15h minimum\n- Départ : 11h maximum\n- Clés : récupération sur place\n- Local à ski chauffé disponible\n\nN\'hésitez pas si vous avez des questions.\n\nBien cordialement,\nÉquipe Chalet-Balmotte810',
        fromEmail: 'admin@chalet-balmotte810.com',
        fromName: 'Équipe Chalet-Balmotte810',
        fromUserId: null,
        isFromAdmin: true,
        read: false
      }
    });

    const message2 = await prisma.message.create({
      data: {
        subject: 'Question sur les équipements',
        content: 'Bonjour,\n\nJe voulais vous confirmer si le chalet dispose bien de :\n- Un local à ski chauffé avec chauffe-chaussures\n- Des équipements pour bébé (chaise haute, lit parapluie)\n- Un barbecue sur la terrasse\n\nMerci beaucoup pour votre réponse.\n\nCordialement,\nMarie Dupont',
        fromEmail: testUser.email,
        fromName: `${testUser.firstName} ${testUser.lastName}`,
        fromUserId: testUser.id,
        isFromAdmin: false,
        read: true
      }
    });

    console.log('✅ Messages test créés:');
    console.log('   📧 Message admin:', message1.subject);
    console.log('   📩 Message client:', message2.subject);

    // Créer un message de contact
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: 'Pierre Dubois',
        email: 'pierre.dubois@email.com',
        subject: 'Disponibilités été 2025',
        message: 'Bonjour,\n\nNous cherchons une location pour 8 personnes du 20 au 27 juillet 2025. Votre chalet semble parfait !\n\nPourriez-vous me confirmer les disponibilités et tarifs ?\n\nMerci.',
        read: false
      }
    });

    console.log('✅ Message de contact créé:', contactMessage.subject);

    console.log('\n🎉 Données de test créées avec succès !');
    console.log('\n📊 Résumé :');
    console.log('   👤 Utilisateurs: 1 client test');
    console.log('   🏠 Réservations: 2 (1 confirmée, 1 en attente)');
    console.log('   📧 Messages: 2 internes + 1 contact');
    console.log('\n💡 Vous pouvez maintenant tester l\'interface admin pour voir les factures !');

  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestInvoice();