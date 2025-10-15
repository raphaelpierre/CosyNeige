import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding seasons and pricing settings...');

  // Créer les paramètres de tarification
  const pricingSettings = await prisma.pricingSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      cleaningFee: 450,
      linenPerPerson: 25,
      depositAmount: 1500,
      defaultHighSeasonPrice: 410,
      defaultLowSeasonPrice: 310,
      defaultMinimumStay: 3
    }
  });

  console.log('✅ Pricing settings created:', pricingSettings);

  // Créer les saisons 2025
  const seasons2025 = [
    {
      name: 'Vacances de Noël 2024-2025',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2025-01-07'),
      seasonType: 'high',
      pricePerNight: 410,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2025,
      isActive: true
    },
    {
      name: 'Février 2025',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-28'),
      seasonType: 'high',
      pricePerNight: 410,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2025,
      isActive: true
    },
    {
      name: 'Pâques 2025',
      startDate: new Date('2025-03-24'),
      endDate: new Date('2025-04-14'),
      seasonType: 'high',
      pricePerNight: 410,
      minimumStay: 7,
      sundayToSunday: true,
      year: 2025,
      isActive: true
    },
    {
      name: 'Été 2025 - Juin',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-30'),
      seasonType: 'low',
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2025,
      isActive: true
    },
    {
      name: 'Été 2025 - Juillet',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-07-31'),
      seasonType: 'low',
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2025,
      isActive: true
    },
    {
      name: 'Été 2025 - Août',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-08-31'),
      seasonType: 'low',
      pricePerNight: 310,
      minimumStay: 3,
      sundayToSunday: false,
      year: 2025,
      isActive: true
    }
  ];

  // Créer les saisons en vérifiant qu'elles n'existent pas déjà
  for (const season of seasons2025) {
    const existing = await prisma.seasonPeriod.findFirst({
      where: {
        name: season.name,
        startDate: season.startDate
      }
    });

    if (!existing) {
      const created = await prisma.seasonPeriod.create({
        data: season
      });
      console.log(`✅ Created season: ${created.name}`);
    } else {
      console.log(`⏭️  Season already exists: ${season.name}`);
    }
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
