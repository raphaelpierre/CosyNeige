'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location, faqs } from '@/lib/data/chalet';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [phoneError, setPhoneError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation du format de téléphone
  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Le téléphone est optionnel

    // Accepter les formats internationaux et français
    // Exemples valides: +33612345678, 0612345678, +33 6 12 34 56 78, 06 12 34 56 78
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valider le téléphone avant soumission
    if (formData.phone && !validatePhone(formData.phone)) {
      setPhoneError(t({
        en: 'Please enter a valid phone number (e.g., +33 6 12 34 56 78 or 06 12 34 56 78)',
        fr: 'Veuillez entrer un numéro de téléphone valide (ex: +33 6 12 34 56 78 ou 06 12 34 56 78)'
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(t({
          en: 'Thank you for your message! We will get back to you within 24 hours.',
          fr: 'Merci pour votre message ! Nous vous répondrons sous 24 heures.',
        }));
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'general',
          message: '',
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      alert(t({
        en: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
        fr: 'Désolé, une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer ou nous contacter directement.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjects = [
    { value: 'general', label: { en: 'General Inquiry', fr: 'Demande Générale' } },
    { value: 'booking', label: { en: 'Booking Question', fr: 'Question Réservation' } },
    { value: 'facilities', label: { en: 'Facilities & Amenities', fr: 'Équipements & Services' } },
    { value: 'location', label: { en: 'Location & Access', fr: 'Localisation & Accès' } },
    { value: 'pricing', label: { en: 'Pricing & Availability', fr: 'Tarifs & Disponibilité' } },
    { value: 'other', label: { en: 'Other', fr: 'Autre' } },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/VueEnsemble.webp"
            alt={t({ en: 'Contact us', fr: 'Contactez-nous' })}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t({ en: 'Contact Us', fr: 'Contactez-Nous' })}</h1>
          <p className="text-xl md:text-2xl">{t({ en: 'We\'re Here to Help', fr: 'Nous Sommes Là Pour Vous Aider' })}</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t({ en: 'Email', fr: 'Email' })}</h3>
              <a href="mailto:contact@chalet-balmotte810.com" className="text-gray-900 hover:text-gray-800 transition-colors font-semibold">
                contact@chalet-balmotte810.com
              </a>
              <p className="text-sm text-gray-600 mt-2">
                {t({ en: 'Response within 24 hours', fr: 'Réponse sous 24 heures' })}
              </p>
            </div>

            <div className="text-center bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t({ en: 'Phone', fr: 'Téléphone' })}</h3>
              <a href="tel:+33685858491" className="text-gray-900 hover:text-gray-800 transition-colors font-semibold">
                +33 6 85 85 84 91
              </a>
              <p className="text-sm text-gray-600 mt-2">
                {t({ en: 'Mon-Sat: 9AM-7PM CET', fr: 'Lun-Sam : 9h-19h CET' })}
              </p>
            </div>

            <div className="text-center bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t({ en: 'Address', fr: 'Adresse' })}</h3>
              <p className="text-gray-900 font-medium">
                {chaletName}<br />
                {location.street && <>{location.street}<br /></>}
                {location.village}<br />
                {location.region} ({location.postalCode})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
            {t({ en: 'Send Us a Message', fr: 'Envoyez-nous un Message' })}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t({
              en: 'Have questions about the chalet, availability, or planning your stay? Fill out the form below and we\'ll get back to you promptly.',
              fr: 'Vous avez des questions sur le chalet, les disponibilités ou la planification de votre séjour ? Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.',
            })}
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'Name', fr: 'Nom' })} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                placeholder={t({ en: 'Your name', fr: 'Votre nom' })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Email', fr: 'Email' })} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                  placeholder={t({ en: 'your.email@example.com', fr: 'votre.email@exemple.com' })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t({ en: 'Phone', fr: 'Téléphone' })}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setPhoneError(''); // Effacer l'erreur lors de la modification
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+33 6 12 34 56 78"
                />
                {phoneError && (
                  <p className="mt-2 text-sm text-red-600">{phoneError}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'Subject', fr: 'Sujet' })} *
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
              >
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {t(subject.label)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t({ en: 'Message', fr: 'Message' })} *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                placeholder={t({
                  en: 'Please tell us how we can help you...',
                  fr: 'Dites-nous comment nous pouvons vous aider...',
                })}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-700 hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-slate-700 hover:border-slate-800 disabled:border-gray-400"
            >
              {isSubmitting 
                ? t({ en: 'Sending...', fr: 'Envoi en cours...' })
                : t({ en: 'Send Message', fr: 'Envoyer le Message' })
              }
            </button>

            <p className="text-xs text-gray-600 text-center mt-4">
              {t({
                en: 'We respect your privacy. Your information will never be shared with third parties.',
                fr: 'Nous respectons votre vie privée. Vos informations ne seront jamais partagées avec des tiers.',
              })}
            </p>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
            {t({ en: 'Frequently Asked Questions', fr: 'Questions Fréquentes' })}
          </h2>
          <p className="text-center text-gray-600 mb-6 md:mb-8">
            {t({
              en: 'Find quick answers to common questions about Chalet-Balmotte810',
              fr: 'Trouvez des réponses rapides aux questions courantes sur Chalet-Balmotte810',
            })}
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-inset"
                >
                  <h3 className="text-lg font-bold text-gray-800 pr-4">
                    {t(faq.question)}
                  </h3>
                  <span className="text-2xl text-slate-700 flex-shrink-0">
                    {expandedFaq === index ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                    {t(faq.answer)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Now CTA */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t({ en: 'Ready to Book?', fr: 'Prêt à Réserver ?' })}
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {t({
              en: 'Check our availability and rates to plan your perfect Alpine escape',
              fr: 'Consultez nos disponibilités et tarifs pour planifier votre escapade alpine parfaite',
            })}
          </p>
          <a
            href="/booking"
            className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-slate-700 hover:border-slate-800"
          >
            {t({ en: 'View Rates & Book', fr: 'Voir Tarifs & Réserver' })}
          </a>
        </div>
      </section>
    </div>
  );
}
