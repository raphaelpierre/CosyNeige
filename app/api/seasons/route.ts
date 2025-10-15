import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les périodes de saison actives (API publique)
export async function GET(req: NextRequest) {
  try {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    // Récupérer les saisons actives pour l'année courante et l'année suivante
    const seasons = await prisma.seasonPeriod.findMany({
      where: {
        isActive: true,
        year: {
          in: [currentYear, nextYear]
        }
      },
      orderBy: [
        { year: 'asc' },
        { startDate: 'asc' }
      ]
    });

    // Récupérer les paramètres de tarification
    let pricingSettings = await prisma.pricingSettings.findFirst();

    // Si aucun paramètre n'existe, utiliser les valeurs par défaut
    if (!pricingSettings) {
      pricingSettings = {
        id: 'default',
        cleaningFee: 450,
        linenPerPerson: 25,
        depositAmount: 1500,
        defaultHighSeasonPrice: 410,
        defaultLowSeasonPrice: 310,
        defaultMinimumStay: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return NextResponse.json({
      seasons,
      pricingSettings
    });
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des saisons' },
      { status: 500 }
    );
  }
}
