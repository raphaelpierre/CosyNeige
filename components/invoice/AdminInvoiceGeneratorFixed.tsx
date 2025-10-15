'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'partial';
  createdAt: string;
  nights?: number;
  baseRate?: number;
  cleaningFee?: number;
  taxAmount?: number;
}

interface AdminInvoiceGeneratorProps {
  invoice: Invoice;
  onClose: () => void;
}

export default function AdminInvoiceGeneratorFixed({ invoice, onClose }: AdminInvoiceGeneratorProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const t = (translations: { en: string; fr: string }) => translations.fr;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const generatePDF = async () => {
    if (!invoiceRef.current) {
      console.error('❌ Invoice ref is null');
      return;
    }

    try {
      console.log('🚀 Starting PDF generation...');
      
      // Capture l'élément comme canvas
      console.log('📸 Capturing canvas...');
      const canvas = await html2canvas(invoiceRef.current, {
        useCORS: true,
        allowTaint: false,
        background: '#ffffff',
        logging: false,
        width: invoiceRef.current.scrollWidth,
        height: invoiceRef.current.scrollHeight
      });

      console.log('✅ Canvas captured, creating PDF...');
      
      // Créer le PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      console.log('📄 PDF created, adding page...');
      
      // Calculer les dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Ajouter la première page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Ajouter des pages supplémentaires si nécessaire
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

  const nights = invoice.nights || Math.ceil(
    (new Date(invoice.checkOut).getTime() - new Date(invoice.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  const baseRate = invoice.baseRate || 150;
  const cleaningFee = invoice.cleaningFee || 50;
  const taxAmount = invoice.taxAmount || (baseRate * nights + cleaningFee) * 0.055;
  const subtotal = baseRate * nights + cleaningFee;

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header avec boutons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0'
          }}>
            {t({ en: 'Invoice Preview', fr: 'Aperçu de la facture' })}
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={generatePDF}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            >
              📄 {t({ en: 'Download PDF', fr: 'Télécharger PDF' })}
            </button>
            <button
              onClick={onClose}
              style={{
                color: '#6b7280',
                fontSize: '24px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
              onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
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
                <p style={{ margin: '2px 0' }}>810 route de Balmotte</p>
                <p style={{ margin: '2px 0' }}>Châtillon-sur-Cluses, 74300</p>
                <p style={{ margin: '2px 0' }}>Haute-Savoie, France</p>
                <p style={{ margin: '8px 0 2px 0' }}>📧 contact@chalet-balmotte810.com</p>
                <p style={{ margin: '2px 0' }}>📞 +33 6 85 85 84 91</p>
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
              {invoice.clientAddress && (
                <p style={{ color: '#374151', margin: '2px 0' }}>{invoice.clientAddress}</p>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 4px 0' }}>Arrivée</p>
                  <p style={{ fontWeight: '600', margin: '0' }}>{formatDate(invoice.checkIn)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 4px 0' }}>Départ</p>
                  <p style={{ fontWeight: '600', margin: '0' }}>{formatDate(invoice.checkOut)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 4px 0' }}>Nombre de nuits</p>
                  <p style={{ fontWeight: '600', margin: '0' }}>{nights} nuit{nights > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 4px 0' }}>Taux par nuit</p>
                  <p style={{ fontWeight: '600', margin: '0' }}>{formatCurrency(baseRate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Détail des coûts */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0 0 12px 0' 
            }}>
              Détail des coûts :
            </h3>
            <div style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* Header du tableau */}
              <div style={{ 
                backgroundColor: '#f3f4f6',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '16px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>
                <div>Description</div>
                <div style={{ textAlign: 'right' }}>Quantité</div>
                <div style={{ textAlign: 'right' }}>Prix unitaire</div>
                <div style={{ textAlign: 'right' }}>Total</div>
              </div>
              
              {/* Lignes du tableau */}
              <div style={{ 
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>Séjour au chalet</div>
                <div style={{ textAlign: 'right' }}>{nights}</div>
                <div style={{ textAlign: 'right' }}>{formatCurrency(baseRate)}</div>
                <div style={{ textAlign: 'right' }}>{formatCurrency(baseRate * nights)}</div>
              </div>
              
              <div style={{ 
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>Frais de ménage</div>
                <div style={{ textAlign: 'right' }}>1</div>
                <div style={{ textAlign: 'right' }}>{formatCurrency(cleaningFee)}</div>
                <div style={{ textAlign: 'right' }}>{formatCurrency(cleaningFee)}</div>
              </div>
              
              <div style={{ 
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>Taxe de séjour (5.5%)</div>
                <div style={{ textAlign: 'right' }}>-</div>
                <div style={{ textAlign: 'right' }}>-</div>
                <div style={{ textAlign: 'right' }}>{formatCurrency(taxAmount)}</div>
              </div>
              
              {/* Total */}
              <div style={{ 
                padding: '16px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#1f2937' 
                }}>
                  Total
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#1f2937' 
                }}>
                  {formatCurrency(invoice.totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Notes de paiement */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0 0 12px 0' 
            }}>
              Informations de paiement :
            </h3>
            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #f59e0b'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Statut :</strong> {
                  invoice.paymentStatus === 'paid' ? 'Paiement effectué ✅' : 
                  invoice.paymentStatus === 'partial' ? 'Paiement partiel ⚠️' : 'En attente de paiement ⏳'
                }
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Méthode :</strong> Carte bancaire via Stripe
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#92400e' }}>
                {invoice.paymentStatus !== 'paid' && 
                  'Merci de procéder au règlement dans les plus brefs délais.'
                }
              </p>
            </div>
          </div>

          {/* Pied de page */}
          <div style={{ 
            borderTop: '2px solid #e5e7eb',
            paddingTop: '16px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            <p style={{ margin: '0 0 4px 0' }}>
              Chalet-Balmotte810 - 810 route de Balmotte, Châtillon-sur-Cluses, 74300 Haute-Savoie, France
            </p>
            <p style={{ margin: '0 0 4px 0' }}>
              Email: contact@chalet-balmotte810.com | Tél: +33 6 85 85 84 91
            </p>
            <p style={{ margin: '0', fontStyle: 'italic' }}>
              Merci de votre confiance et excellent séjour !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}