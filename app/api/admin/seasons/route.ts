import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';

// GET - Récupérer toutes les périodes de saison
export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const seasons = await prisma.seasonPeriod.findMany({
      orderBy: [
        { year: 'desc' },
        { startDate: 'asc' }
      ]
    });

    return NextResponse.json(seasons);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des saisons' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle période de saison
export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const {
      name,
      startDate,
      endDate,
      seasonType,
      pricePerNight,
      minimumStay,
      sundayToSunday,
      year,
      isActive
    } = await req.json();

    if (!name || !startDate || !endDate || !seasonType || !pricePerNight || !minimumStay || year === undefined) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    const season = await prisma.seasonPeriod.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        seasonType,
        pricePerNight,
        minimumStay,
        sundayToSunday: sundayToSunday || false,
        year,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(season, { status: 201 });
  } catch (error) {
    console.error('Error creating season:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la saison' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une période de saison
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const {
      seasonId,
      name,
      startDate,
      endDate,
      seasonType,
      pricePerNight,
      minimumStay,
      sundayToSunday,
      year,
      isActive
    } = await req.json();

    if (!seasonId) {
      return NextResponse.json(
        { error: 'ID de saison requis' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (seasonType) updateData.seasonType = seasonType;
    if (pricePerNight !== undefined) updateData.pricePerNight = pricePerNight;
    if (minimumStay !== undefined) updateData.minimumStay = minimumStay;
    if (sundayToSunday !== undefined) updateData.sundayToSunday = sundayToSunday;
    if (year !== undefined) updateData.year = year;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedSeason = await prisma.seasonPeriod.update({
      where: { id: seasonId },
      data: updateData
    });

    return NextResponse.json(updatedSeason);
  } catch (error) {
    console.error('Error updating season:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la saison' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une période de saison
export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { seasonId } = await req.json();

    if (!seasonId) {
      return NextResponse.json(
        { error: 'ID de saison requis' },
        { status: 400 }
      );
    }

    await prisma.seasonPeriod.delete({
      where: { id: seasonId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting season:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la saison' },
      { status: 500 }
    );
  }
}
