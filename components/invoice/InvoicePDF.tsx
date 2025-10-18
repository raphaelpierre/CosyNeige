'use client';

import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  checkIn: string | Date;
  checkOut: string | Date;
  guests?: number;
  totalAmount: number;
  nights?: number;
  baseAmount?: number;
  pricePerNight?: number;
  cleaningFee?: number;
  linenFee?: number;
  taxAmount?: number;
  depositAmount?: number;
  status?: string;
  createdAt: string | Date;
  notes?: string;
}

interface InvoicePDFProps {
  invoice: InvoiceData;
  onClose: () => void;
  autoGenerate?: boolean;
}

export default function InvoicePDF({ invoice, onClose, autoGenerate = false }: InvoicePDFProps) {
  const { t } = useLanguage();
  const generated = useRef(false);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatEuro = (amount: number) => {
    // Format manually to avoid jsPDF encoding issues with Intl.NumberFormat special characters
    const formattedNumber = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formattedNumber + ' €';
  };

  const calculateNights = () => {
    if (invoice.nights) return invoice.nights;
    const checkIn = new Date(invoice.checkIn);
    const checkOut = new Date(invoice.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const generatePDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      // Configuration des polices
      pdf.setFont('helvetica');

      // HEADER - Logo (simple mountain icon) et titre
      // Draw simple mountain icon using triangles
      const logoY = y - 2;
      pdf.setFillColor(30, 41, 59); // slate-800
      // First mountain peak (left)
      pdf.setLineWidth(0);
      pdf.lines([[2.5, -5], [2.5, 5], [-5, 0]], margin, logoY + 4, [1, 1], 'F');

      pdf.setFillColor(51, 65, 85); // slate-700
      // Second mountain peak (right, slightly shorter)
      pdf.lines([[2.5, -3.5], [2.5, 3.5], [-5, 0]], margin + 3.5, logoY + 4, [1, 1], 'F');

      // Company name next to logo
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59); // slate-800
      pdf.text('Chalet Balmotte810', margin + 10, y);
      y += 6;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99); // gray-600
      pdf.text('810 rte de Balmotte, Châtillon-sur-Cluses, 74300', margin, y);
      y += 4;
      pdf.text('+33 6 85 85 84 91 • contact@chalet-balmotte810.com • SIRET: 123 456 789 00012', margin, y);
      y += 10;

      // FACTURE header à droite
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59);
      pdf.text('FACTURE', pageWidth - margin, 15, { align: 'right' });

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`N° ${invoice.invoiceNumber}`, pageWidth - margin, 22, { align: 'right' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(formatDate(new Date()), pageWidth - margin, 27, { align: 'right' });

      // Ligne de séparation
      pdf.setDrawColor(226, 232, 240); // gray-200
      pdf.line(margin, y, pageWidth - margin, y);
      y += 8;

      // CLIENT ET DETAILS - Côte à côte
      const colWidth = (contentWidth - 5) / 2;

      // Colonne gauche - Client
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59);
      pdf.text('Facturer à:', margin, y);
      y += 5;

      pdf.setFillColor(249, 250, 251); // gray-50
      pdf.rect(margin, y - 3, colWidth, 18, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(17, 24, 39);
      pdf.text(invoice.clientName, margin + 2, y);
      y += 4;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81);
      pdf.text(invoice.clientEmail, margin + 2, y);
      y += 4;
      pdf.text(invoice.clientPhone || '', margin + 2, y);

      // Colonne droite - Détails réservation
      let yRight = y - 13;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(30, 41, 59);
      pdf.text('Détails:', pageWidth - margin - colWidth, yRight);
      yRight += 5;

      pdf.setFillColor(239, 246, 255); // blue-50
      pdf.rect(pageWidth - margin - colWidth, yRight - 3, colWidth, 18, 'F');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(55, 65, 81);

      const nights = calculateNights();
      pdf.text(`Arrivée: ${formatDate(invoice.checkIn)}`, pageWidth - margin - colWidth + 2, yRight);
      yRight += 4;
      pdf.text(`Départ: ${formatDate(invoice.checkOut)}`, pageWidth - margin - colWidth + 2, yRight);
      yRight += 4;
      pdf.text(`Durée: ${nights} nuit${nights > 1 ? 's' : ''} • ${invoice.guests || 2} pers.`, pageWidth - margin - colWidth + 2, yRight);

      y += 20;

      // TABLEAU DES SERVICES
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59);
      pdf.text('Détail des prestations', margin, y);
      y += 6;

      // Header du tableau
      pdf.setFillColor(226, 232, 240); // gray-200
      pdf.rect(margin, y - 4, contentWidth, 6, 'F');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(55, 65, 81);
      pdf.text('Description', margin + 2, y);
      pdf.text('Qté', pageWidth - margin - 60, y, { align: 'right' });
      pdf.text('P.U. HT', pageWidth - margin - 40, y, { align: 'right' });
      pdf.text('Total HT', pageWidth - margin - 2, y, { align: 'right' });
      y += 6;

      // Lignes du tableau
      pdf.setFont('helvetica', 'normal');
      pdf.setDrawColor(229, 231, 235);

      const vatRate = 0.10;
      const priceExVat = invoice.totalAmount / (1 + vatRate);
      const pricePerNight = invoice.pricePerNight || (priceExVat / nights);

      // Location
      pdf.text('Location Chalet', margin + 2, y);
      pdf.text(`${formatDate(invoice.checkIn)} - ${formatDate(invoice.checkOut)}`, margin + 2, y + 3);
      pdf.text(nights.toString(), pageWidth - margin - 60, y, { align: 'right' });
      pdf.text(formatEuro(pricePerNight / (1 + vatRate)), pageWidth - margin - 40, y, { align: 'right' });
      pdf.text(formatEuro((pricePerNight * nights) / (1 + vatRate)), pageWidth - margin - 2, y, { align: 'right' });
      pdf.line(margin, y + 4, pageWidth - margin, y + 4);
      y += 8;

      // Totaux
      y += 4;
      const subtotalHT = priceExVat;
      const vatAmount = invoice.totalAmount - priceExVat;

      pdf.setFontSize(9);
      pdf.text('Sous-total HT:', pageWidth - margin - 40, y);
      pdf.text(formatEuro(subtotalHT), pageWidth - margin - 2, y, { align: 'right' });
      y += 5;

      pdf.text('TVA (10%):', pageWidth - margin - 40, y);
      pdf.text(formatEuro(vatAmount), pageWidth - margin - 2, y, { align: 'right' });
      y += 6;

      // Total TTC
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setDrawColor(75, 85, 99);
      pdf.line(pageWidth - margin - 50, y - 1, pageWidth - margin, y - 1);
      pdf.text('Total TTC:', pageWidth - margin - 40, y + 4);
      pdf.text(formatEuro(invoice.totalAmount), pageWidth - margin - 2, y + 4, { align: 'right' });
      y += 10;

      // Acompte si présent
      if (invoice.depositAmount && invoice.depositAmount > 0) {
        pdf.setFillColor(240, 253, 244); // green-50
        pdf.rect(pageWidth - margin - 55, y, 55, 12, 'F');

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(21, 128, 61); // green-700
        pdf.text('Acompte versé:', pageWidth - margin - 53, y + 4);
        pdf.text(formatEuro(invoice.depositAmount), pageWidth - margin - 2, y + 4, { align: 'right' });

        pdf.setFont('helvetica', 'bold');
        pdf.text('Reste à payer:', pageWidth - margin - 53, y + 9);
        pdf.text(formatEuro(invoice.totalAmount - invoice.depositAmount), pageWidth - margin - 2, y + 9, { align: 'right' });
        y += 14;
      }

      y += 6;

      // CONDITIONS
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 6;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(30, 41, 59);
      pdf.text('Conditions', margin, y);
      y += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(75, 85, 99);

      const col1X = margin;
      const col2X = margin + (contentWidth / 2);

      pdf.text('• Acompte 30% à la réservation', col1X, y);
      pdf.text('• Solde 30j avant arrivée', col2X, y);
      y += 4;
      pdf.text('• Caution 1 500€ à l\'arrivée', col1X, y);
      pdf.text('• Annulation gratuite 60j avant', col2X, y);
      y += 6;

      // FOOTER
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 4;

      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text('Facture générée automatiquement - Location saisonnière', pageWidth / 2, y, { align: 'center' });

      // Sauvegarder
      const fileName = `Facture_${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      onClose();
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert(t({ en: 'Error generating PDF', fr: 'Erreur lors de la génération du PDF' }));
    }
  };

  useEffect(() => {
    if (autoGenerate && !generated.current) {
      generated.current = true;
      generatePDF();
    }
  }, [autoGenerate]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            📄 {t({ en: 'Generate Invoice', fr: 'Générer une Facture' })}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Facture</h3>
            <p className="text-sm text-gray-600">N° {invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-600">Client: {invoice.clientName}</p>
            <p className="text-sm text-gray-600">Montant: {formatEuro(invoice.totalAmount)}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generatePDF}
              className="flex-1 bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              📥 {t({ en: 'Download PDF', fr: 'Télécharger PDF' })}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t({ en: 'Cancel', fr: 'Annuler' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
