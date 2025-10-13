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
        <div ref={invoiceRef} className="p-8 bg-white">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">🏔️ Chalet Balmotte810</h1>
              <div className="text-gray-600">
                <p>Les Sires, 73440 Valloire</p>
                <p>Savoie, France</p>
                <p>Tél: +33 (0)4 79 59 XX XX</p>
                <p>Email: info@chalet-balmotte810.com</p>
                <p>SIRET: 123 456 789 00012</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">FACTURE</h2>
              <div className="bg-slate-100 p-4 rounded-lg">
                <p className="font-semibold">N° {generateInvoiceNumber()}</p>
                <p>Date: {formatDate(new Date())}</p>
                <p>Réservation: {reservation.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Informations client */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Facturer à:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">{reservation.firstName} {reservation.lastName}</p>
              <p>{reservation.email}</p>
              <p>{reservation.phone}</p>
            </div>
          </div>

          {/* Détails de la réservation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Détails de la Réservation</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Arrivée:</strong> {formatDate(reservation.checkIn)}</p>
                  <p><strong>Départ:</strong> {formatDate(reservation.checkOut)}</p>
                </div>
                <div>
                  <p><strong>Durée:</strong> {nights} nuit{nights > 1 ? 's' : ''}</p>
                  <p><strong>Personnes:</strong> {reservation.guests}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des services */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-gray-300 p-3 text-left">Description</th>
                  <th className="border border-gray-300 p-3 text-center">Quantité</th>
                  <th className="border border-gray-300 p-3 text-right">Prix unitaire HT</th>
                  <th className="border border-gray-300 p-3 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">
                    <strong>Location Chalet Balmotte810</strong><br/>
                    <span className="text-sm text-gray-600">
                      Séjour du {formatDate(reservation.checkIn)} au {formatDate(reservation.checkOut)}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-center">{nights} nuit{nights > 1 ? 's' : ''}</td>
                  <td className="border border-gray-300 p-3 text-right">{formatEuro(pricePerNight / (1 + vatRate))}</td>
                  <td className="border border-gray-300 p-3 text-right">{formatEuro(priceExVat)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Sous-total HT:</span>
                <span className="font-semibold">{formatEuro(priceExVat)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>TVA (10%):</span>
                <span className="font-semibold">{formatEuro(vatAmount)}</span>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total TTC:</span>
                <span>{formatEuro(reservation.totalPrice)}</span>
              </div>
              {reservation.depositAmount && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
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
          <div className="border-t border-gray-300 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Conditions de Paiement</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Acompte de 30% requis à la réservation</p>
              <p>• Solde à régler 30 jours avant l&apos;arrivée</p>
              <p>• Caution de 1 500€ demandée à l&apos;arrivée (chèque ou espèces)</p>
              <p>• Annulation gratuite jusqu&apos;à 60 jours avant l&apos;arrivée</p>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-8 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>Chalet Balmotte810 - Location saisonnière - SIRET: 123 456 789 00012</p>
            <p>Cette facture est générée automatiquement par notre système de réservation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}