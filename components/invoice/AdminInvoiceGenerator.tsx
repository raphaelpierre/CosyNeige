'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface AdminInvoiceProps {
  invoice: any;
  onClose: () => void;
}

export default function AdminInvoiceGenerator({ invoice, onClose }: AdminInvoiceProps) {
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
    const checkIn = new Date(invoice.checkIn);
    const checkOut = new Date(invoice.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const generatePDF = async () => {
    console.log('🚀 Starting PDF generation...');
    if (!invoiceRef.current) {
      console.error('❌ Invoice ref is null');
      return;
    }

    try {
      console.log('📸 Capturing canvas...');
      const canvas = await html2canvas(invoiceRef.current, {
        useCORS: true,
        allowTaint: true,
        background: '#ffffff'
      });

      console.log('✅ Canvas captured, creating PDF...');
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

      const fileName = `Facture_${invoice.invoiceNumber}_${invoice.clientName?.replace(/\s+/g, '_')}.pdf`;
      console.log('💾 Saving PDF as:', fileName);
      pdf.save(fileName);
      
      console.log('✅ PDF generated successfully!');
      onClose();
    } catch (error) {
      console.error('❌ Erreur lors de la génération du PDF:', error);
      alert(t({ 
        en: 'Error generating PDF', 
        fr: 'Erreur lors de la génération du PDF' 
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header avec boutons */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {t({ en: 'Invoice Preview', fr: 'Aperçu de la Facture' })}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={generatePDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              📄 {t({ en: 'Download PDF', fr: 'Télécharger PDF' })}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenu de la facture */}
        <div 
          ref={invoiceRef} 
          style={{
            padding: '32px',
            backgroundColor: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            color: '#000000',
            lineHeight: '1.5'
          }}
        >
          {/* En-tête de la facture */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: '32px' 
          }}>
            <div>
              <h1 style={{ 
                fontSize: '30px', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                FACTURE
              </h1>
              <div style={{ color: '#4b5563' }}>
                <p style={{ 
                  fontWeight: '600', 
                  fontSize: '18px', 
                  color: '#334155',
                  margin: '4px 0' 
                }}>
                  Chalet-Balmotte810
                </p>
                <p style={{ margin: '2px 0' }}>Châtillon-sur-Cluses, 74300</p>
                <p style={{ margin: '2px 0' }}>Haute-Savoie, France</p>
                <p style={{ margin: '8px 0 2px 0' }}>📧 contact@chalet-balmotte810.com</p>
                <p style={{ margin: '2px 0' }}>📞 +33 4 50 XX XX XX</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                backgroundColor: '#f1f5f9', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#4b5563', 
                  margin: '0 0 4px 0' 
                }}>
                  N° Facture
                </p>
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: '#1e293b',
                  margin: '0'
                }}>
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div style={{ marginTop: '16px', fontSize: '14px', color: '#4b5563' }}>
                <p style={{ margin: '2px 0' }}>Date: {formatDate(invoice.createdAt)}</p>
                <p style={{ margin: '2px 0' }}>
                  Statut: <span style={{ 
                    fontWeight: '600',
                    color: invoice.paymentStatus === 'paid' ? '#059669' : 
                           invoice.paymentStatus === 'partial' ? '#d97706' : '#dc2626'
                  }}>
                    {invoice.paymentStatus === 'paid' ? 'Payée' : 
                     invoice.paymentStatus === 'partial' ? 'Partielle' : 'En attente'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Informations client */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0 0 12px 0' 
            }}>
              Facturé à :
            </h3>
            <div style={{ 
              backgroundColor: '#f9fafb', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ fontWeight: '600', color: '#111827', margin: '2px 0' }}>
                {invoice.clientName}
              </p>
              <p style={{ color: '#374151', margin: '2px 0' }}>{invoice.clientEmail}</p>
              {invoice.clientPhone && (
                <p style={{ color: '#374151', margin: '2px 0' }}>{invoice.clientPhone}</p>
              )}
            </div>
          </div>

          {/* Détails de la réservation */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0 0 12px 0' 
            }}>
              Détails de la réservation :
            </h3>
            <div style={{ 
              backgroundColor: '#eff6ff', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #dbeafe'
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Arrivée</p>
                  <p className="font-semibold">{formatDate(invoice.checkIn)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Départ</p>
                  <p className="font-semibold">{formatDate(invoice.checkOut)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="font-semibold">{calculateNights()} nuits</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Personnes</p>
                  <p className="font-semibold">{invoice.guests} personnes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des prestations */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-gray-300 p-3 text-left">Description</th>
                  <th className="border border-gray-300 p-3 text-right">Quantité</th>
                  <th className="border border-gray-300 p-3 text-right">Prix unitaire</th>
                  <th className="border border-gray-300 p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">
                    Location Chalet-Balmotte810<br/>
                    <span className="text-sm text-gray-600">
                      {formatDate(invoice.checkIn)} - {formatDate(invoice.checkOut)}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-right">{calculateNights()} nuits</td>
                  <td className="border border-gray-300 p-3 text-right">
                    {formatEuro(invoice.totalAmount / calculateNights())}
                  </td>
                  <td className="border border-gray-300 p-3 text-right font-semibold">
                    {formatEuro(invoice.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="bg-slate-800 text-white p-6 rounded-lg">
              <div className="text-right">
                <p className="text-lg mb-2">Total à payer</p>
                <p className="text-3xl font-bold">{formatEuro(invoice.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Message du client si présent */}
          {invoice.message && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Message du client :</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="text-gray-700 italic">&quot;{invoice.message}&quot;</p>
              </div>
            </div>
          )}

          {/* Pied de page */}
          <div className="border-t border-gray-200 pt-6 text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Informations légales</h4>
                <p>SIRET : XXX XXX XXX XXXXX</p>
                <p>TVA non applicable - Article 293 B du CGI</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Conditions de paiement</h4>
                <p>Paiement par carte bancaire</p>
                <p>Acompte de 50% à la réservation</p>
                <p>Solde à régler avant l&apos;arrivée</p>
              </div>
            </div>
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="font-medium text-slate-700">
                Merci de votre confiance - Chalet-Balmotte810
              </p>
              <p className="text-xs mt-1">
                Facture générée automatiquement le {formatDate(new Date())}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}