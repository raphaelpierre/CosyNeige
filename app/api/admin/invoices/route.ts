import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';

// GET - Récupérer toutes les factures
export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Récupérer les filtres depuis les query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const invoiceType = searchParams.get('type');
    const search = searchParams.get('search');

    // Construire le filtre Prisma
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (invoiceType) {
      where.invoiceType = invoiceType;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientEmail: { contains: search, mode: 'insensitive' } }
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        reservation: {
          select: {
            id: true,
            status: true,
            paymentStatus: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle facture
export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const data = await req.json();
    const {
      reservationId,
      invoiceType,
      totalAmount,
      notes,
      internalNotes,
      dueDate
    } = data;

    // Récupérer la réservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Calculer les montants
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Récupérer les paramètres de prix
    const pricingSettings = await prisma.pricingSettings.findFirst();
    const cleaningFee = pricingSettings?.cleaningFee || 450;
    const linenPerPerson = pricingSettings?.linenPerPerson || 25;

    const baseAmount = reservation.totalPrice - cleaningFee - (linenPerPerson * reservation.guests);
    const pricePerNight = baseAmount / nights;
    const linenFee = linenPerPerson * reservation.guests;
    const taxAmount = 0; // À calculer si nécessaire

    // Calculer le montant total selon le type
    let calculatedTotal = totalAmount;
    if (invoiceType === 'deposit') {
      calculatedTotal = Math.round(reservation.totalPrice * 0.3);
    } else if (invoiceType === 'balance') {
      // Trouver l'acompte déjà payé
      const depositInvoice = await prisma.invoice.findFirst({
        where: {
          reservationId,
          invoiceType: 'deposit',
          status: 'paid'
        }
      });
      calculatedTotal = reservation.totalPrice - (depositInvoice?.totalAmount || 0);
    } else if (invoiceType === 'full') {
      calculatedTotal = reservation.totalPrice;
    }

    // Générer le numéro de facture
    const year = new Date().getFullYear();
    const invoiceCount = await prisma.invoice.count({
      where: {
        invoiceNumber: {
          startsWith: `CHB-${year}-`
        }
      }
    });
    const invoiceNumber = `CHB-${year}-${String(invoiceCount + 1).padStart(3, '0')}`;

    // Créer la facture
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        invoiceType,
        reservationId,
        clientName: `${reservation.firstName} ${reservation.lastName}`,
        clientEmail: reservation.email,
        clientPhone: reservation.phone,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        nights,
        guests: reservation.guests,
        baseAmount,
        pricePerNight,
        cleaningFee,
        linenFee,
        taxAmount,
        totalAmount: calculatedTotal,
        notes,
        internalNotes,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        reservation: true
      }
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour une facture
export async function PATCH(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const data = await req.json();
    const {
      invoiceId,
      status,
      paymentMethod,
      paymentReference,
      paidAmount,
      notes,
      internalNotes,
      pdfUrl
    } = data;

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'ID de facture requis' },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (status !== undefined) {
      updateData.status = status;
      if (status === 'paid') {
        updateData.paidAt = new Date();
      } else if (status === 'sent') {
        updateData.sentAt = new Date();
      }
    }

    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (paymentReference !== undefined) updateData.paymentReference = paymentReference;
    if (paidAmount !== undefined) updateData.paidAmount = paidAmount;
    if (notes !== undefined) updateData.notes = notes;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    if (pdfUrl !== undefined) {
      updateData.pdfUrl = pdfUrl;
      updateData.pdfGeneratedAt = new Date();
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        reservation: true
      }
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la facture' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une facture
export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'ID de facture requis' },
        { status: 400 }
      );
    }

    // Vérifier que la facture n'est pas payée
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    if (invoice.status === 'paid' || invoice.status === 'partial') {
      return NextResponse.json(
        { error: 'Impossible de supprimer une facture payée' },
        { status: 400 }
      );
    }

    await prisma.invoice.delete({
      where: { id: invoiceId }
    });

    return NextResponse.json({ success: true, message: 'Facture supprimée' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la facture' },
      { status: 500 }
    );
  }
}
