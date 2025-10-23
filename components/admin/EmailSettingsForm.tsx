'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function EmailSettingsForm() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert(t({ en: 'Email settings saved successfully', fr: 'Paramètres email enregistrés avec succès' }));
        fetchSettings();
      } else {
        const error = await response.json();
        alert(error.error || error.errorEn);
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      alert(t({ en: 'Error saving settings', fr: 'Erreur lors de l\'enregistrement' }));
    } finally {
      setSaving(false);
    }
  };

  const addForwardingEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      alert(t({ en: 'Please enter a valid email address', fr: 'Veuillez entrer une adresse email valide' }));
      return;
    }

    if (settings.forwardingEmails.includes(newEmail.trim())) {
      alert(t({ en: 'This email is already in the list', fr: 'Cet email est déjà dans la liste' }));
      return;
    }

    setSettings({
      ...settings,
      forwardingEmails: [...settings.forwardingEmails, newEmail.trim()]
    });
    setNewEmail('');
  };

  const removeForwardingEmail = (email: string) => {
    setSettings({
      ...settings,
      forwardingEmails: settings.forwardingEmails.filter((e: string) => e !== email)
    });
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
      <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
        📧 {t({ en: 'Email Settings', fr: 'Paramètres Email' })}
      </h3>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Emails de transfert */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t({
              en: 'Forwarding Email Addresses',
              fr: 'Adresses Email de Transfert'
            })}
          </label>
          <p className="text-xs text-gray-500 mb-3">
            {t({
              en: 'These addresses will receive copies of all important emails (bookings, contacts, messages)',
              fr: 'Ces adresses recevront des copies de tous les emails importants (réservations, contacts, messages)'
            })}
          </p>

          {/* Liste des emails existants */}
          <div className="space-y-2 mb-3">
            {settings.forwardingEmails.map((email: string) => (
              <div key={email} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                <span className="flex-1 text-sm font-mono">{email}</span>
                <button
                  type="button"
                  onClick={() => removeForwardingEmail(email)}
                  className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                >
                  ❌
                </button>
              </div>
            ))}
            {settings.forwardingEmails.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                {t({
                  en: 'No forwarding addresses configured',
                  fr: 'Aucune adresse de transfert configurée'
                })}
              </p>
            )}
          </div>

          {/* Ajouter un nouvel email */}
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={t({
                en: 'email@example.com',
                fr: 'email@exemple.com'
              })}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addForwardingEmail();
                }
              }}
            />
            <button
              type="button"
              onClick={addForwardingEmail}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {t({ en: '+ Add', fr: '+ Ajouter' })}
            </button>
          </div>
        </div>

        {/* Autres paramètres d'email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t({ en: 'Contact Email (Public)', fr: 'Email de Contact (Public)' })}
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t({ en: 'Reply-To Email', fr: 'Email de Réponse' })}
            </label>
            <input
              type="email"
              value={settings.replyToEmail}
              onChange={(e) => setSettings({...settings, replyToEmail: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t({ en: 'From Name', fr: 'Nom Expéditeur' })}
            </label>
            <input
              type="text"
              value={settings.fromName}
              onChange={(e) => setSettings({...settings, fromName: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t({ en: 'From Email', fr: 'Email Expéditeur' })}
            </label>
            <input
              type="email"
              value={settings.fromEmail}
              onChange={(e) => setSettings({...settings, fromEmail: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              disabled
              title={t({
                en: 'This field cannot be changed (configured in SMTP settings)',
                fr: 'Ce champ ne peut pas être modifié (configuré dans les paramètres SMTP)'
              })}
            />
          </div>
        </div>

        {/* Notifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t({ en: 'Email Notifications', fr: 'Notifications Email' })}
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifyOnNewBooking}
                onChange={(e) => setSettings({...settings, notifyOnNewBooking: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">
                {t({ en: 'Notify on new bookings', fr: 'Notifier les nouvelles réservations' })}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifyOnNewMessage}
                onChange={(e) => setSettings({...settings, notifyOnNewMessage: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">
                {t({ en: 'Notify on new messages', fr: 'Notifier les nouveaux messages' })}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifyOnPayment}
                onChange={(e) => setSettings({...settings, notifyOnPayment: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">
                {t({ en: 'Notify on payments', fr: 'Notifier les paiements' })}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifyOnContact}
                onChange={(e) => setSettings({...settings, notifyOnContact: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">
                {t({ en: 'Notify on contact form submissions', fr: 'Notifier les soumissions du formulaire de contact' })}
              </span>
            </label>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? t({ en: 'Saving...', fr: 'Enregistrement...' })
            : t({ en: 'Save Email Settings', fr: 'Enregistrer les Paramètres Email' })
          }
        </button>
      </form>
    </div>
  );
}
