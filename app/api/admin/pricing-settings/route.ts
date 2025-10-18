import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';

// GET - Récupérer les paramètres de tarification
export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Récupérer les paramètres (il devrait n'y en avoir qu'un seul)
    let settings = await prisma.pricingSettings.findFirst();

    // Si aucun paramètre n'existe, créer les valeurs par défaut
    if (!settings) {
      settings = await prisma.pricingSettings.create({
        data: {
          cleaningFee: 450,
          linenPerPerson: 25,
          touristTaxPerPersonPerNight: 3,
          depositAmount: 1500,
          defaultHighSeasonPrice: 410,
          defaultLowSeasonPrice: 310,
          defaultMinimumStay: 3,
          highSeasonMinimumStay: 7
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching pricing settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les paramètres de tarification
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const {
      cleaningFee,
      linenPerPerson,
      touristTaxPerPersonPerNight,
      depositAmount,
      defaultHighSeasonPrice,
      defaultLowSeasonPrice,
      defaultMinimumStay,
      highSeasonMinimumStay
    } = await req.json();

    // Récupérer les paramètres existants
    let settings = await prisma.pricingSettings.findFirst();

    const updateData: any = {};
    if (cleaningFee !== undefined) updateData.cleaningFee = cleaningFee;
    if (linenPerPerson !== undefined) updateData.linenPerPerson = linenPerPerson;
    if (touristTaxPerPersonPerNight !== undefined) updateData.touristTaxPerPersonPerNight = touristTaxPerPersonPerNight;
    if (depositAmount !== undefined) updateData.depositAmount = depositAmount;
    if (defaultHighSeasonPrice !== undefined) updateData.defaultHighSeasonPrice = defaultHighSeasonPrice;
    if (defaultLowSeasonPrice !== undefined) updateData.defaultLowSeasonPrice = defaultLowSeasonPrice;
    if (defaultMinimumStay !== undefined) updateData.defaultMinimumStay = defaultMinimumStay;
    if (highSeasonMinimumStay !== undefined) updateData.highSeasonMinimumStay = highSeasonMinimumStay;

    if (settings) {
      // Mettre à jour les paramètres existants
      settings = await prisma.pricingSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    } else {
      // Créer de nouveaux paramètres
      settings = await prisma.pricingSettings.create({
        data: {
          cleaningFee: cleaningFee || 450,
          linenPerPerson: linenPerPerson || 25,
          touristTaxPerPersonPerNight: touristTaxPerPersonPerNight || 3,
          depositAmount: depositAmount || 1500,
          defaultHighSeasonPrice: defaultHighSeasonPrice || 410,
          defaultLowSeasonPrice: defaultLowSeasonPrice || 310,
          defaultMinimumStay: defaultMinimumStay || 3,
          highSeasonMinimumStay: highSeasonMinimumStay || 7
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating pricing settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}
