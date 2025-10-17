'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const invoiceRef = useRef<HTMLDivElement>(null);
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

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        useCORS: true,
        allowTaint: true,
        background: '#ffffff',
        height: invoiceRef.current.scrollHeight,
        width: invoiceRef.current.scrollWidth
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

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
  const priceExVat = reservation.totalPrice / (1 + vatRate);
  const vatAmount = reservation.totalPrice - priceExVat;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              📄 {t({ en: 'Generate Invoice', fr: 'Générer une Facture' })}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={generatePDF}
                className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                📥 {t({ en: 'Download PDF', fr: 'Télécharger PDF' })}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Facture */}
        <div ref={invoiceRef} className="p-6 bg-white" style={{ maxHeight: '297mm' }}>
          {/* En-tête */}
          <div className="flex justify-between items-start mb-3">
            <div className="text-xs">
              <h1 className="text-lg font-bold text-slate-800 mb-0.5">🏔️ Chalet Balmotte810</h1>
              <div className="text-gray-600 leading-tight">
                <p>810 rte de Balmotte, Châtillon-sur-Cluses, 74300</p>
                <p>+33 6 85 85 84 91 • contact@chalet-balmotte810.com</p>
                <p>SIRET: 123 456 789 00012</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-slate-800 mb-0.5">FACTURE</h2>
              <div className="bg-slate-100 p-1.5 rounded text-xs">
                <p className="font-semibold">N° {generateInvoiceNumber()}</p>
                <p>{formatDate(new Date())}</p>
              </div>
            </div>
          </div>

          {/* Informations client et détails réservation - Côte à côte */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Client */}
            <div>
              <h3 className="text-xs font-semibold text-slate-800 mb-0.5">Facturer à:</h3>
              <div className="bg-gray-50 p-1.5 rounded text-xs">
                <p className="font-semibold">{reservation.firstName} {reservation.lastName}</p>
                <p>{reservation.email}</p>
                <p>{reservation.phone}</p>
              </div>
            </div>

            {/* Détails réservation */}
            <div>
              <h3 className="text-xs font-semibold text-slate-800 mb-0.5">Détails:</h3>
              <div className="bg-blue-50 p-1.5 rounded text-xs">
                <p><strong>Arrivée:</strong> {formatDate(reservation.checkIn)}</p>
                <p><strong>Départ:</strong> {formatDate(reservation.checkOut)}</p>
                <p><strong>Durée:</strong> {nights} nuit{nights > 1 ? 's' : ''} • {reservation.guests} pers.</p>
              </div>
            </div>
          </div>

          {/* Tableau des services */}
          <div className="mb-3">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-gray-300 p-1.5 text-left">Description</th>
                  <th className="border border-gray-300 p-1.5 text-center">Qté</th>
                  <th className="border border-gray-300 p-1.5 text-right">P.U. HT</th>
                  <th className="border border-gray-300 p-1.5 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-1.5">
                    <strong>Location Chalet</strong><br/>
                    <span className="text-gray-600">
                      {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-1.5 text-center">{nights}</td>
                  <td className="border border-gray-300 p-1.5 text-right">{formatEuro(pricePerNight / (1 + vatRate))}</td>
                  <td className="border border-gray-300 p-1.5 text-right">{formatEuro(priceExVat)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="flex justify-end mb-3">
            <div className="w-56 text-xs">
              <div className="flex justify-between py-0.5">
                <span>Sous-total HT:</span>
                <span className="font-semibold">{formatEuro(priceExVat)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>TVA (10%):</span>
                <span className="font-semibold">{formatEuro(vatAmount)}</span>
              </div>
              <div className="border-t border-gray-300 my-0.5"></div>
              <div className="flex justify-between py-0.5 text-sm font-bold">
                <span>Total TTC:</span>
                <span>{formatEuro(reservation.totalPrice)}</span>
              </div>
              {reservation.depositAmount && (
                <div className="mt-1.5 p-1.5 bg-green-50 rounded">
                  <div className="flex justify-between">
                    <span>Acompte versé:</span>
                    <span className="font-semibold text-green-700">{formatEuro(reservation.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Reste à payer:</span>
                    <span>{formatEuro(reservation.totalPrice - reservation.depositAmount)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conditions de paiement */}
          <div className="border-t border-gray-300 pt-2">
            <h3 className="text-xs font-semibold text-slate-800 mb-0.5">Conditions de Paiement</h3>
            <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-3">
              <p>• Acompte 30% à la réservation</p>
              <p>• Solde 30 jours avant arrivée</p>
              <p>• Caution 1 500€ à l&apos;arrivée</p>
              <p>• Annulation gratuite 60 jours avant</p>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-2 pt-2 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>Facture générée automatiquement - Location saisonnière</p>
          </div>
        </div>
      </div>
    </div>
  );
}