'use client';

import { useState, useEffect } from 'react';
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
}

interface InvoiceModalProps {
  reservation: Reservation;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InvoiceModal({ reservation, onClose, onSuccess }: InvoiceModalProps) {
  const { t } = useLanguage();
  const [invoiceType, setInvoiceType] = useState<'deposit' | 'balance' | 'full' | 'custom'>('full');
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Calculer les montants
  const calculateNights = () => {
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const depositAmount = Math.round(reservation.totalPrice * 0.3);
  const balanceAmount = reservation.totalPrice - depositAmount;

  const getInvoiceAmount = () => {
    switch (invoiceType) {
      case 'deposit':
        return depositAmount;
      case 'balance':
        return balanceAmount;
      case 'full':
        return reservation.totalPrice;
      case 'custom':
        return customAmount;
      default:
        return reservation.totalPrice;
    }
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: reservation.id,
          invoiceType,
          totalAmount: getInvoiceAmount(),
          notes,
          internalNotes,
          dueDate: dueDate || null
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }

      alert(t({
        en: 'Invoice created successfully!',
        fr: 'Facture créée avec succès !'
      }));

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      setError(err.message || t({
        en: 'Error creating invoice',
        fr: 'Erreur lors de la création de la facture'
      }));
    } finally {
      setIsCreating(false);
    }
  };

  // Définir une date d'échéance par défaut (30 jours avant l'arrivée pour l'acompte)
  useEffect(() => {
    if (invoiceType === 'deposit') {
      const checkInDate = new Date(reservation.checkIn);
      const dueDateCalc = new Date(checkInDate);
      dueDateCalc.setDate(dueDateCalc.getDate() - 30);
      setDueDate(dueDateCalc.toISOString().split('T')[0]);
    } else if (invoiceType === 'balance') {
      const checkInDate = new Date(reservation.checkIn);
      const dueDateCalc = new Date(checkInDate);
      dueDateCalc.setDate(dueDateCalc.getDate() - 1);
      setDueDate(dueDateCalc.toISOString().split('T')[0]);
    }
  }, [invoiceType, reservation.checkIn]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              📄 {t({ en: 'Create Invoice', fr: 'Créer une Facture' })}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info réservation */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              {t({ en: 'Reservation', fr: 'Réservation' })}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">{t({ en: 'Guest:', fr: 'Client :' })}</span>
                <p className="font-semibold">{reservation.firstName} {reservation.lastName}</p>
              </div>
              <div>
                <span className="text-gray-600">{t({ en: 'Email:', fr: 'Email :' })}</span>
                <p className="font-semibold">{reservation.email}</p>
              </div>
              <div>
                <span className="text-gray-600">{t({ en: 'Period:', fr: 'Période :' })}</span>
                <p className="font-semibold">
                  {formatDate(reservation.checkIn)} → {formatDate(reservation.checkOut)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">{t({ en: 'Duration:', fr: 'Durée :' })}</span>
                <p className="font-semibold">{nights} {t({ en: 'nights', fr: 'nuits' })}</p>
              </div>
            </div>
          </div>

          {/* Type de facture */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t({ en: 'Invoice Type', fr: 'Type de Facture' })} *
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="invoiceType"
                  value="deposit"
                  checked={invoiceType === 'deposit'}
                  onChange={(e) => setInvoiceType(e.target.value as any)}
                  className="mr-3 w-4 h-4"
                />
                <div className="flex-1">
                  <span className="font-semibold">
                    {t({ en: 'Deposit 30%', fr: 'Acompte 30%' })}
                  </span>
                  <span className="ml-2 text-gray-600">— {formatEuro(depositAmount)}</span>
                </div>
              </label>

              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="invoiceType"
                  value="balance"
                  checked={invoiceType === 'balance'}
                  onChange={(e) => setInvoiceType(e.target.value as any)}
                  className="mr-3 w-4 h-4"
                />
                <div className="flex-1">
                  <span className="font-semibold">
                    {t({ en: 'Balance', fr: 'Solde Restant' })}
                  </span>
                  <span className="ml-2 text-gray-600">— {formatEuro(balanceAmount)}</span>
                </div>
              </label>

              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-slate-700 bg-slate-50">
                <input
                  type="radio"
                  name="invoiceType"
                  value="full"
                  checked={invoiceType === 'full'}
                  onChange={(e) => setInvoiceType(e.target.value as any)}
                  className="mr-3 w-4 h-4"
                />
                <div className="flex-1">
                  <span className="font-semibold">
                    {t({ en: 'Full Invoice', fr: 'Facture Complète' })}
                  </span>
                  <span className="ml-2 text-gray-600">— {formatEuro(reservation.totalPrice)}</span>
                </div>
              </label>

              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="invoiceType"
                  value="custom"
                  checked={invoiceType === 'custom'}
                  onChange={(e) => setInvoiceType(e.target.value as any)}
                  className="mr-3 w-4 h-4"
                />
                <div className="flex-1 flex items-center gap-3">
                  <span className="font-semibold">
                    {t({ en: 'Custom Amount', fr: 'Montant Personnalisé' })}
                  </span>
                  {invoiceType === 'custom' && (
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-32 px-3 py-1 border border-gray-300 rounded-lg"
                      min="0"
                      max={reservation.totalPrice}
                      step="0.01"
                      required
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Résumé des montants */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t({ en: 'Amount Summary', fr: 'Résumé des Montants' })}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t({ en: 'Total reservation:', fr: 'Total réservation :' })}
                </span>
                <span className="font-semibold">{formatEuro(reservation.totalPrice)}</span>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between text-lg">
                <span className="font-bold">
                  {t({ en: 'Invoice amount:', fr: 'Montant de la facture :' })}
                </span>
                <span className="font-bold text-slate-700">{formatEuro(getInvoiceAmount())}</span>
              </div>
            </div>
          </div>

          {/* Date d'échéance */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t({ en: 'Due Date', fr: 'Date d\'Échéance' })}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
            />
          </div>

          {/* Notes (visibles sur la facture) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t({ en: 'Notes (visible on invoice)', fr: 'Notes (visibles sur la facture)' })}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t({
                en: 'Thank you for your reservation...',
                fr: 'Merci pour votre réservation...'
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
            />
          </div>

          {/* Notes internes (privées) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t({ en: 'Internal Notes (private)', fr: 'Notes Internes (privées)' })}
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={2}
              placeholder={t({
                en: 'Private notes for admin only...',
                fr: 'Notes privées pour l\'administrateur uniquement...'
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t({ en: 'Cancel', fr: 'Annuler' })}
            </button>
            <button
              type="submit"
              disabled={isCreating || (invoiceType === 'custom' && customAmount <= 0)}
              className="flex-1 bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating
                ? t({ en: 'Creating...', fr: 'Création...' })
                : t({ en: 'Create Invoice', fr: 'Créer la Facture' })
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
