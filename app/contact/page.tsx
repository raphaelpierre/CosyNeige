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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact Form Submission:', formData);
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
            src="/images/VueEnsemble.jpg"
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
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center bg-cream rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-forest-800 mb-3">{t({ en: 'Email', fr: 'Email' })}</h3>
              <a href="mailto:info@chaletlessires.com" className="text-forest-900 hover:text-forest-800 transition-colors font-semibold">
                info@chaletlessires.com
              </a>
              <p className="text-sm text-gray-600 mt-2">
                {t({ en: 'Response within 24 hours', fr: 'Réponse sous 24 heures' })}
              </p>
            </div>

            <div className="text-center bg-cream rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-forest-800 mb-3">{t({ en: 'Phone', fr: 'Téléphone' })}</h3>
              <a href="tel:+33695595865" className="text-forest-900 hover:text-forest-800 transition-colors font-semibold">
                +33 06 95 59 58 65
              </a>
              <p className="text-sm text-gray-600 mt-2">
                {t({ en: 'Mon-Sat: 9AM-7PM CET', fr: 'Lun-Sam : 9h-19h CET' })}
              </p>
            </div>

            <div className="text-center bg-cream rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-forest-800 mb-3">{t({ en: 'Address', fr: 'Adresse' })}</h3>
              <p className="text-forest-900 font-medium">
                {chaletName}<br />
                {location.village}<br />
                {location.region} ({location.postalCode})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Send Us a Message', fr: 'Envoyez-nous un Message' })}
          </h2>
          <p className="text-center text-gray-600 mb-12">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                  placeholder="+33 X XX XX XX XX"
                />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                placeholder={t({
                  en: 'Please tell us how we can help you...',
                  fr: 'Dites-nous comment nous pouvons vous aider...',
                })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-forest-700 hover:bg-forest-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {t({ en: 'Send Message', fr: 'Envoyer le Message' })}
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
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4 text-center">
            {t({ en: 'Frequently Asked Questions', fr: 'Questions Fréquentes' })}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {t({
              en: 'Find quick answers to common questions about Chalet-Balmotte810',
              fr: 'Trouvez des réponses rapides aux questions courantes sur Chalet-Balmotte810',
            })}
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-cream rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-forest-700 focus:ring-inset"
                >
                  <h3 className="text-lg font-bold text-forest-800 pr-4">
                    {t(faq.question)}
                  </h3>
                  <span className="text-2xl text-forest-700 flex-shrink-0">
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

          <div className="mt-12 text-center bg-forest-50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-forest-900 mb-3">
              {t({ en: 'Still have questions?', fr: 'Vous avez encore des questions ?' })}
            </h3>
            <p className="text-gray-700 mb-6">
              {t({
                en: 'Don\'t hesitate to reach out. We\'re happy to provide more information about the chalet, the area, or help plan your perfect Alpine getaway.',
                fr: 'N\'hésitez pas à nous contacter. Nous sommes heureux de fournir plus d\'informations sur le chalet, la région, ou d\'aider à planifier votre escapade alpine parfaite.',
              })}
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-block bg-forest-700 hover:bg-forest-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {t({ en: 'Contact Us', fr: 'Nous Contacter' })}
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-forest-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-forest-700 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">
              {t({ en: 'Emergency During Your Stay?', fr: 'Urgence Pendant Votre Séjour ?' })}
            </h3>
            <p className="text-forest-100 mb-4">
              {t({
                en: 'We are available 24/7 for emergencies during your stay. Don\'t hesitate to call us anytime.',
                fr: 'Nous sommes disponibles 24h/24 pour les urgences pendant votre séjour. N\'hésitez pas à nous appeler à tout moment.',
              })}
            </p>
            <a
              href="tel:+33695595865"
              className="inline-block bg-white text-forest-800 hover:bg-cream px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              📞 {t({ en: 'Emergency Contact', fr: 'Contact Urgence' })}
            </a>
          </div>
        </div>
      </section>

      {/* Book Now CTA */}
      <section className="py-10 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-forest-900 mb-6">
            {t({ en: 'Ready to Book?', fr: 'Prêt à Réserver ?' })}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {t({
              en: 'Check our availability and rates to plan your perfect Alpine escape',
              fr: 'Consultez nos disponibilités et tarifs pour planifier votre escapade alpine parfaite',
            })}
          </p>
          <a
            href="/booking"
            className="inline-block bg-forest-700 hover:bg-forest-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            {t({ en: 'View Rates & Book', fr: 'Voir Tarifs & Réserver' })}
          </a>
        </div>
      </section>
    </div>
  );
}
