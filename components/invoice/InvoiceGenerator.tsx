'use client';

import jsPDF from 'jspdf';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string | Date;
  checkOut: string | Date;
  guests: number;
  totalPrice: number;
  depositAmount?: number;
  paymentStatus?: string;
  createdAt: string | Date;
}

interface InvoiceGeneratorProps {
  reservation: Reservation;
  onClose: () => void;
}

export default function InvoiceGenerator({ reservation, onClose }: InvoiceGeneratorProps) {
  const { t } = useLanguage();

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const calculateNights = () => {
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const generateInvoiceNumber = () => {
    const date = new Date(reservation.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const reservationId = reservation.id.slice(-6).toUpperCase();
    return `CHB${year}${month}${day}-${reservationId}`;
  };

  const generatePDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      // Configuration
      pdf.setFont('helvetica');

      // HEADER - Logo avec bordure élégante
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y, contentWidth, 25, 'F');

      pdf.setFontSize(26);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('CHALET BALMOTTE 810', margin + 3, y + 8);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(226, 232, 240);
      pdf.text('Location saisonniere - Alpes Francaises', margin + 3, y + 13);

      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 3, y + 15, margin + 80, y + 15);

      pdf.setFontSize(8);
      pdf.setTextColor(241, 245, 249);
      pdf.text('810 route de Balmotte', margin + 3, y + 19);
      pdf.text('Chatillon-sur-Cluses, 74300 France', margin + 3, y + 22);

      y += 28;

      // FACTURE header - Informations légales
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99);
      pdf.text('Tel: +33 6 85 85 84 91', pageWidth - margin, y - 20, { align: 'right' });
      pdf.text('Email: contact@chalet-balmotte810.com', pageWidth - margin, y - 17, { align: 'right' });
      pdf.text('SIRET: 123 456 789 00012', pageWidth - margin, y - 14, { align: 'right' });
      pdf.text('TVA: FR12345678901', pageWidth - margin, y - 11, { align: 'right' });

      // FACTURE title
      pdf.setFillColor(241, 245, 249);
      pdf.rect(pageWidth - margin - 50, y - 6, 50, 12, 'F');

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59);
      pdf.text('FACTURE', pageWidth - margin - 25, y, { align: 'center' });

      y += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85);
      pdf.text(`Numero: ${generateInvoiceNumber()}`, pageWidth - margin, y, { align: 'right' });
      y += 4;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Date d'emission: ${formatDate(new Date())}`, pageWidth - margin, y, { align: 'right' });
      y += 4;
      pdf.text(`Date d'echeance: ${formatDate(new Date(reservation.checkIn))}`, pageWidth - margin, y, { align: 'right' });

      // Ligne de séparation
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 8;

      // CLIENT ET DETAILS - Mise en page professionnelle
      const colWidth = (contentWidth - 5) / 2;

      // Client - Encadré avec bordure
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(71, 85, 105);
      pdf.text('FACTURE ADRESSEE A', margin, y);
      y += 5;

      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, y - 2, colWidth, 26);

      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin + 0.5, y - 1.5, colWidth - 1, 8, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${reservation.firstName} ${reservation.lastName}`, margin + 3, y + 4);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Email: ${reservation.email}`, margin + 3, y + 10);
      pdf.text(`Tel: ${reservation.phone}`, margin + 3, y + 14);
      pdf.text(`ID Client: #${reservation.id.slice(-8).toUpperCase()}`, margin + 3, y + 18);

      // Détails de la réservation - Encadré avec bordure
      let yRight = y - 7;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      pdf.text('DETAILS DE LA RESERVATION', pageWidth - margin - colWidth, yRight);
      yRight += 5;

      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.5);
      pdf.rect(pageWidth - margin - colWidth, yRight - 2, colWidth, 26);

      pdf.setFillColor(239, 246, 255);
      pdf.rect(pageWidth - margin - colWidth + 0.5, yRight - 1.5, colWidth - 1, 8, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(30, 58, 138);
      pdf.text('SEJOUR DU', pageWidth - margin - colWidth + 3, yRight + 4);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Check-in: ${formatDate(reservation.checkIn)} - 16h00`, pageWidth - margin - colWidth + 3, yRight + 10);
      pdf.text(`Check-out: ${formatDate(reservation.checkOut)} - 10h00`, pageWidth - margin - colWidth + 3, yRight + 14);
      pdf.text(`Duree: ${nights} nuit${nights > 1 ? 's' : ''} - ${reservation.guests} personne${reservation.guests > 1 ? 's' : ''}`, pageWidth - margin - colWidth + 3, yRight + 18);

      y += 28;

      // TABLEAU DES PRESTATIONS - Design professionnel
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59);
      pdf.text('DETAIL DES PRESTATIONS', margin, y);
      y += 6;

      // Header tableau avec fond sombre
      pdf.setFillColor(51, 65, 85);
      pdf.rect(margin, y - 4, contentWidth, 7, 'F');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('DESIGNATION', margin + 2, y);
      pdf.text('QTE', pageWidth - margin - 70, y, { align: 'right' });
      pdf.text('PRIX UNIT. HT', pageWidth - margin - 50, y, { align: 'right' });
      pdf.text('TVA', pageWidth - margin - 30, y, { align: 'right' });
      pdf.text('TOTAL HT', pageWidth - margin - 2, y, { align: 'right' });
      y += 6;

      // Bordure du tableau
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, y - 10, contentWidth, 0);

      // Lignes de prestations
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(15, 23, 42);

      // Ligne 1: Location principale
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y - 1, contentWidth, 9, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.text('Location Chalet Balmotte 810', margin + 2, y + 3);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Periode: ${formatDate(reservation.checkIn)} au ${formatDate(reservation.checkOut)}`, margin + 2, y + 6);
      pdf.text(`Capacite: ${reservation.guests} personne(s) - ${nights} nuitee(s)`, margin + 2, y + 8.5);

      pdf.setFontSize(8);
      pdf.setTextColor(15, 23, 42);
      pdf.text(nights.toString(), pageWidth - margin - 70, y + 3, { align: 'right' });
      pdf.text(formatEuro(pricePerNight / (1 + vatRate)), pageWidth - margin - 50, y + 3, { align: 'right' });
      pdf.text('10%', pageWidth - margin - 30, y + 3, { align: 'right' });
      pdf.text(formatEuro((pricePerNight * nights) / (1 + vatRate)), pageWidth - margin - 2, y + 3, { align: 'right' });

      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y + 9, pageWidth - margin, y + 9);
      y += 12;

      // Ligne 2: Frais de ménage
      const cleaningFee = 150;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Forfait menage fin de sejour', margin + 2, y);
      pdf.setFontSize(7);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Nettoyage complet et desinfection', margin + 2, y + 3);

      pdf.setFontSize(8);
      pdf.setTextColor(15, 23, 42);
      pdf.text('1', pageWidth - margin - 70, y, { align: 'right' });
      pdf.text(formatEuro(cleaningFee / (1 + vatRate)), pageWidth - margin - 50, y, { align: 'right' });
      pdf.text('10%', pageWidth - margin - 30, y, { align: 'right' });
      pdf.text(formatEuro(cleaningFee / (1 + vatRate)), pageWidth - margin - 2, y, { align: 'right' });

      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y + 4, pageWidth - margin, y + 4);
      y += 7;

      // Ligne 3: Linge de maison
      const linenFee = reservation.guests * 25;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Linge de maison (draps, serviettes)', margin + 2, y);
      pdf.setFontSize(7);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`${reservation.guests} personne(s) x 25 EUR`, margin + 2, y + 3);

      pdf.setFontSize(8);
      pdf.setTextColor(15, 23, 42);
      pdf.text(reservation.guests.toString(), pageWidth - margin - 70, y, { align: 'right' });
      pdf.text(formatEuro(25 / (1 + vatRate)), pageWidth - margin - 50, y, { align: 'right' });
      pdf.text('10%', pageWidth - margin - 30, y, { align: 'right' });
      pdf.text(formatEuro(linenFee / (1 + vatRate)), pageWidth - margin - 2, y, { align: 'right' });

      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y + 4, pageWidth - margin, y + 4);
      y += 8;

      // Calcul des totaux incluant tous les frais
      const totalCleaningLinenHT = (cleaningFee + linenFee) / (1 + vatRate);
      const totalLocationHT = (pricePerNight * nights) / (1 + vatRate);
      const totalGeneralHT = totalLocationHT + totalCleaningLinenHT;
      const totalTVA = totalGeneralHT * vatRate;
      const totalTTC = totalGeneralHT + totalTVA;

      // Section totaux avec fond gris
      pdf.setFillColor(248, 250, 252);
      pdf.rect(pageWidth - margin - 60, y - 2, 60, 20, 'F');

      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.3);
      pdf.rect(pageWidth - margin - 60, y - 2, 60, 20);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Total HT:', pageWidth - margin - 58, y + 2);
      pdf.text(formatEuro(totalGeneralHT), pageWidth - margin - 2, y + 2, { align: 'right' });

      pdf.text('TVA (10%):', pageWidth - margin - 58, y + 7);
      pdf.text(formatEuro(totalTVA), pageWidth - margin - 2, y + 7, { align: 'right' });

      pdf.setDrawColor(203, 213, 225);
      pdf.line(pageWidth - margin - 58, y + 9, pageWidth - margin - 2, y + 9);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(15, 23, 42);
      pdf.text('TOTAL TTC:', pageWidth - margin - 58, y + 15);
      pdf.text(formatEuro(totalTTC), pageWidth - margin - 2, y + 15, { align: 'right' });

      y += 24;

      // Section Acompte et Paiement - Design amélioré
      if (reservation.depositAmount && reservation.depositAmount > 0) {
        pdf.setFillColor(220, 252, 231);
        pdf.setDrawColor(134, 239, 172);
        pdf.setLineWidth(0.5);
        pdf.rect(pageWidth - margin - 62, y, 62, 18, 'FD');

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(22, 101, 52);
        pdf.text('Acompte verse (30%):', pageWidth - margin - 60, y + 5);
        pdf.setFont('helvetica', 'bold');
        pdf.text(formatEuro(reservation.depositAmount), pageWidth - margin - 2, y + 5, { align: 'right' });

        pdf.setDrawColor(187, 247, 208);
        pdf.line(pageWidth - margin - 60, y + 8, pageWidth - margin - 2, y + 8);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(22, 101, 52);
        pdf.text('RESTE A PAYER:', pageWidth - margin - 60, y + 14);
        pdf.text(formatEuro(totalTTC - reservation.depositAmount), pageWidth - margin - 2, y + 14, { align: 'right' });
        y += 20;
      } else {
        // Aucun acompte versé
        pdf.setFillColor(254, 243, 199);
        pdf.setDrawColor(251, 191, 36);
        pdf.setLineWidth(0.5);
        pdf.rect(pageWidth - margin - 62, y, 62, 10, 'FD');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(146, 64, 14);
        pdf.text('MONTANT DU A RECEPTION:', pageWidth - margin - 60, y + 6);
        pdf.text(formatEuro(totalTTC), pageWidth - margin - 2, y + 6, { align: 'right' });
        y += 12;
      }

      y += 4;

      // CONDITIONS ET MODALITES DE PAIEMENT
      pdf.setDrawColor(51, 65, 85);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 6;

      pdf.setFillColor(51, 65, 85);
      pdf.rect(margin, y - 2, 80, 6, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.text('CONDITIONS GENERALES', margin + 2, y + 2);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(51, 65, 85);

      const col1X = margin;
      const col2X = margin + (contentWidth / 2) + 2;

      // Colonne 1
      pdf.setFont('helvetica', 'bold');
      pdf.text('PAIEMENT', col1X, y);
      pdf.setFont('helvetica', 'normal');
      y += 3;
      pdf.text('- Acompte: 30% a la reservation', col1X + 2, y);
      y += 3;
      pdf.text('- Solde: 30 jours avant l\'arrivee', col1X + 2, y);
      y += 3;
      pdf.text('- Caution: 1 500 EUR a l\'arrivee', col1X + 2, y);
      y += 3;
      pdf.text('  (restituee sous 7 jours)', col1X + 2, y);

      // Colonne 2
      let yCol2 = y - 12;
      pdf.setFont('helvetica', 'bold');
      pdf.text('ANNULATION', col2X, yCol2);
      pdf.setFont('helvetica', 'normal');
      yCol2 += 3;
      pdf.text('- Gratuite: > 60 jours avant arrivee', col2X + 2, yCol2);
      yCol2 += 3;
      pdf.text('- 50% rembourse: 30-60 jours', col2X + 2, yCol2);
      yCol2 += 3;
      pdf.text('- Aucun remboursement: < 30 jours', col2X + 2, yCol2);

      y += 5;

      // Informations complémentaires
      pdf.setFont('helvetica', 'bold');
      pdf.text('HORAIRES', col1X, y);
      pdf.setFont('helvetica', 'normal');
      y += 3;
      pdf.text('- Arrivee: 16h00 - 19h00', col1X + 2, y);
      y += 3;
      pdf.text('- Depart: avant 10h00', col1X + 2, y);

      yCol2 = y - 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text('MODALITES', col2X, yCol2);
      pdf.setFont('helvetica', 'normal');
      yCol2 += 3;
      pdf.text('- Linge fourni et menage inclus', col2X + 2, yCol2);
      yCol2 += 3;
      pdf.text('- Assurance annulation recommandee', col2X + 2, yCol2);

      y += 5;

      // FOOTER PROFESSIONNEL
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 4;

      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, contentWidth, 12, 'F');

      pdf.setFontSize(6);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Chalet Balmotte 810 - Location saisonniere', pageWidth / 2, y + 3, { align: 'center' });
      pdf.text('810 route de Balmotte, 74300 Chatillon-sur-Cluses, France', pageWidth / 2, y + 6, { align: 'center' });
      pdf.text('SIRET: 123 456 789 00012 - TVA: FR12345678901', pageWidth / 2, y + 9, { align: 'center' });

      // Note de bas de page
      y += 14;
      pdf.setFontSize(6);
      pdf.setTextColor(148, 163, 184);
      pdf.text('Document genere electroniquement - Aucune signature requise', pageWidth / 2, y, { align: 'center' });
      pdf.text(`Date de generation: ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, y + 2.5, { align: 'center' });

      const fileName = `Facture_${generateInvoiceNumber()}_${reservation.lastName}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération de la facture. Veuillez réessayer.');
    }
  };

  const nights = calculateNights();
  const pricePerNight = reservation.totalPrice / nights;
  const vatRate = 0.10; // 10% de TVA

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
            <p className="text-sm text-gray-600">N° {generateInvoiceNumber()}</p>
            <p className="text-sm text-gray-600">Client: {reservation.firstName} {reservation.lastName}</p>
            <p className="text-sm text-gray-600">Montant: {formatEuro(reservation.totalPrice)}</p>
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