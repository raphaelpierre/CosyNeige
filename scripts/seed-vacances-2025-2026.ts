import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏔️  Insertion des vacances scolaires 2025-2026...\n');

  // Haute-Savoie = Zone A (Académie de Grenoble)

  const seasons = [
    // Vacances de la Toussaint 2025 - Toutes zones
    {
      name: "Vacances de la Toussaint 2025",
      startDate: new Date('2025-10-18'),
      endDate: new Date('2025-11-03'),
      seasonType: "high",
      pricePerNight: 410,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2025,
      isActive: true
    },

    // Vacances de Noël 2025 - Toutes zones
    {
      name: "Vacances de Noël 2025",
      startDate: new Date('2025-12-20'),
      endDate: new Date('2026-01-05'),
      seasonType: "high",
      pricePerNight: 450,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2025,
      isActive: true
    },

    // Vacances d'hiver 2026 - Zone A (Haute-Savoie)
    {
      name: "Vacances d'hiver 2026 - Zone A",
      startDate: new Date('2026-02-07'),
      endDate: new Date('2026-02-23'),
      seasonType: "high",
      pricePerNight: 450,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2026,
      isActive: true
    },

    // Vacances de printemps 2026 - Zone A (Haute-Savoie)
    {
      name: "Vacances de printemps 2026 - Zone A",
      startDate: new Date('2026-04-04'),
      endDate: new Date('2026-04-20'),
      seasonType: "high",
      pricePerNight: 410,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2026,
      isActive: true
    },

    // Pont de l'Ascension 2026 - Toutes zones
    {
      name: "Pont de l'Ascension 2026",
      startDate: new Date('2026-05-14'),
      endDate: new Date('2026-05-17'),
      seasonType: "high",
      pricePerNight: 410,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2026,
      isActive: true
    },

    // Vacances d'été 2026 - Toutes zones (juillet-août)
    {
      name: "Vacances d'été 2026 - Juillet",
      startDate: new Date('2026-07-04'),
      endDate: new Date('2026-07-31'),
      seasonType: "high",
      pricePerNight: 450,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2026,
      isActive: true
    },

    {
      name: "Vacances d'été 2026 - Août",
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-31'),
      seasonType: "high",
      pricePerNight: 450,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2026,
      isActive: true
    },

    // Périodes basses saisons (entre les vacances)
    // Septembre à mi-octobre 2025
    {
      name: "Basse saison - Septembre-Octobre 2025",
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-10-17'),
      seasonType: "low",
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2025,
      isActive: true
    },

    // Novembre après Toussaint jusqu'à Noël
    {
      name: "Basse saison - Novembre-Décembre 2025",
      startDate: new Date('2025-11-04'),
      endDate: new Date('2025-12-19'),
      seasonType: "low",
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2025,
      isActive: true
    },

    // Janvier après Noël jusqu'aux vacances d'hiver
    {
      name: "Basse saison - Janvier-Février 2026",
      startDate: new Date('2026-01-06'),
      endDate: new Date('2026-02-06'),
      seasonType: "low",
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2026,
      isActive: true
    },

    // Mars entre hiver et printemps
    {
      name: "Basse saison - Mars 2026",
      startDate: new Date('2026-02-24'),
      endDate: new Date('2026-04-03'),
      seasonType: "low",
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2026,
      isActive: true
    },

    // Avril-Mai entre printemps et Ascension
    {
      name: "Basse saison - Avril-Mai 2026",
      startDate: new Date('2026-04-21'),
      endDate: new Date('2026-05-13'),
      seasonType: "low",
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2026,
      isActive: true
    },

    // Mai-Juin entre Ascension et été
    {
      name: "Basse saison - Mai-Juin 2026",
      startDate: new Date('2026-05-18'),
      endDate: new Date('2026-07-03'),
      seasonType: "low",
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2026,
      isActive: true
    }
  ];

  // Supprimer les anciennes saisons 2025-2026
  const deleted = await prisma.seasonPeriod.deleteMany({
    where: {
      OR: [
        { year: 2025 },
        { year: 2026 }
      ]
    }
  });

  console.log(`✅ ${deleted.count} anciennes périodes supprimées\n`);

  // Insérer les nouvelles saisons
  let count = 0;
  for (const season of seasons) {
    await prisma.seasonPeriod.create({
      data: season
    });
    count++;
    console.log(`✅ ${season.name} - ${season.seasonType === 'high' ? '🔴 Haute' : '🟢 Basse'} saison`);
    console.log(`   Du ${season.startDate.toLocaleDateString('fr-FR')} au ${season.endDate.toLocaleDateString('fr-FR')}`);
    console.log(`   ${season.pricePerNight}€/nuit - Min ${season.minimumStay} nuits${season.sundayToSunday ? ' (Dimanche à dimanche)' : ''}\n`);
  }

  console.log(`\n🎉 ${count} périodes de vacances scolaires insérées avec succès !`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
