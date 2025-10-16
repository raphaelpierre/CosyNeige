'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location } from '@/lib/data/chalet';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function GuidePage() {
  const { t } = useLanguage();

  const generatePDF = async () => {
    try {
      // Créer un élément temporaire avec le contenu à imprimer
      const printContent = document.createElement('div');
      printContent.style.width = '210mm';
      printContent.style.padding = '20mm';
      printContent.style.fontFamily = 'Arial, sans-serif';
      printContent.style.fontSize = '12px';
      printContent.style.lineHeight = '1.4';
      printContent.style.color = '#333';
      printContent.style.backgroundColor = '#fff';

      // Contenu du PDF
      printContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2d5843; font-size: 24px; margin-bottom: 10px;">${t({ en: 'Guest Guide', fr: 'Guide du Voyageur' })}</h1>
          <h2 style="color: #2d5843; font-size: 18px; margin-bottom: 20px;">${chaletName}</h2>
          <p style="font-size: 14px; color: #666;">${t({ en: 'Everything You Need to Know', fr: 'Tout ce que Vous Devez Savoir' })}</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #2d5843; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #2d5843; padding-bottom: 5px;">🏠 ${t({ en: 'Welcome & Check-in', fr: 'Bienvenue & Arrivée' })}</h3>
          <div style="margin-bottom: 15px;">
            <strong>${t({ en: 'Check-in Time', fr: 'Heure d\'Arrivée' })}</strong><br>
            ${t({ en: 'Sunday from 4:00 PM. Please contact us if you need to arrive earlier.', fr: 'Dimanche à partir de 16h00. Contactez-nous si vous devez arriver plus tôt.' })}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>${t({ en: 'Key Collection', fr: 'Récupération des Clés' })}</strong><br>
            ${t({ en: 'Keys will be provided upon arrival. We will meet you at the chalet to show you around.', fr: 'Les clés seront fournies à l\'arrivée. Nous vous accueillerons au chalet pour vous faire visiter.' })}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>${t({ en: 'WiFi Access', fr: 'Accès WiFi' })}</strong><br>
            ${t({ en: 'WiFi credentials will be provided upon arrival.', fr: 'Les identifiants WiFi vous seront communiqués à votre arrivée.' })}
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #2d5843; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #2d5843; padding-bottom: 5px;">🔧 ${t({ en: 'House Equipment', fr: 'Équipements de la Maison' })}</h3>
          <div style="margin-bottom: 15px;">
            <strong>${t({ en: 'Gourmet Kitchen', fr: 'Cuisine Gastronomique' })}</strong><br>
            ${t({ en: 'Authentic Savoyard kitchen fully equipped: professional oven, traditional gas range, premium dishwasher, Nespresso machine, toaster, kettle, and grand dining table seating 10 guests. All cooking utensils, pots, pans, and dinnerware provided.', fr: 'Authentique cuisine savoyarde entièrement équipée : four professionnel, piano à gaz traditionnel, lave-vaisselle haut de gamme, machine Nespresso, grille-pain, bouilloire, et grande table conviviale pour 10 convives. Tous ustensiles, casseroles, poêles et vaisselle fournis.' })}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>${t({ en: 'Wellness & Relaxation', fr: 'Bien-être & Détente' })}</strong><br>
            ${t({ en: 'Outdoor hot tub with breathtaking mountain views, authentic stone fireplace with complimentary firewood, and premium heated floors throughout for ultimate comfort.', fr: 'Jacuzzi extérieur avec vue montagne à couper le souffle, authentique cheminée en pierre avec bois gratuit, et sols chauffants haut de gamme partout pour un confort ultime.' })}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>${t({ en: 'Entertainment & Technology', fr: 'Divertissement & Technologie' })}</strong><br>
            ${t({ en: '65" Smart TV with Netflix and Amazon Prime, high-speed WiFi throughout, Bluetooth speaker available. Board games and books in the living room cabinet for cozy evenings.', fr: 'Smart TV 65" avec Netflix et Amazon Prime, WiFi haut débit partout, enceinte Bluetooth disponible. Jeux de société et livres dans le meuble du salon pour les soirées cosy.' })}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>${t({ en: 'Practical Amenities', fr: 'Équipements Pratiques' })}</strong><br>
            ${t({ en: 'Ski room with boot warmers, washing machine and dryer with detergent provided, iron and ironing board in utility room, 5 private parking spaces, and professional BBQ station on the terrace.', fr: 'Local à skis avec chauffe-chaussures, lave-linge et sèche-linge avec lessive fournie, fer et planche à repasser dans la buanderie, 5 places de parking privé, et station BBQ professionnelle sur la terrasse.' })}
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #2d5843; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #2d5843; padding-bottom: 5px;">📋 ${t({ en: 'House Rules', fr: 'Règlement Intérieur' })}</h3>
          <div style="margin-bottom: 10px;">
            <strong>${t({ en: 'Smoking', fr: 'Tabac' })}</strong><br>
            ${t({ en: 'Non-smoking property. Smoking is permitted on the terrace only.', fr: 'Propriété non-fumeur. Fumer est autorisé sur la terrasse uniquement.' })}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>${t({ en: 'Pets', fr: 'Animaux' })}</strong><br>
            ${t({ en: 'Pets are not allowed without prior authorization. Additional fee may apply.', fr: 'Animaux non autorisés sans accord préalable. Supplément possible.' })}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>${t({ en: 'Noise', fr: 'Bruit' })}</strong><br>
            ${t({ en: 'Please respect quiet hours from 10:00 PM to 8:00 AM. Be considerate of neighbors.', fr: 'Merci de respecter les horaires de calme de 22h00 à 8h00. Soyez respectueux des voisins.' })}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>${t({ en: 'Maximum Capacity', fr: 'Capacité Maximale' })}</strong><br>
            ${t({ en: 'Maximum 10 guests. No overnight visitors beyond the booked number.', fr: 'Maximum 10 personnes. Pas de visiteurs pour la nuit au-delà du nombre réservé.' })}
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #2d5843; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #2d5843; padding-bottom: 5px;">💡 ${t({ en: 'Practical Information', fr: 'Informations Pratiques' })}</h3>
          <div style="margin-bottom: 10px;">
            <strong>${t({ en: 'Parking', fr: 'Stationnement' })}</strong><br>
            ${t({ en: '5 private parking spaces directly in front of the chalet (2 covered spaces + 3 outdoor spaces). Snow chains required in winter.', fr: '5 places de parking privé devant le chalet (2 places couvertes + 3 places extérieures). Chaînes à neige obligatoires en hiver.' })}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>${t({ en: 'Local Shops', fr: 'Commerces Locaux' })}</strong><br>
            ${t({ en: 'Supermarket (Carrefour) 5 min drive in Cluses. Bakery 3 min away in village center. Pharmacy in Cluses.', fr: 'Supermarché (Carrefour) à 5 min en voiture à Cluses. Boulangerie à 3 min au centre du village. Pharmacie à Cluses.' })}
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #2d5843; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #2d5843; padding-bottom: 5px;">🚨 ${t({ en: 'Emergency Contacts', fr: 'Contacts d\'Urgence' })}</h3>
          <div style="margin-bottom: 10px;">
            <strong>${t({ en: 'Emergency Services', fr: 'Services d\'Urgence' })}</strong><br>
            ${t({ en: 'Emergency (Police/Fire/Ambulance): 112 or 15 | Hospital Sallanches: +33 4 50 47 30 00', fr: 'Urgences (Police/Pompiers/SAMU) : 112 ou 15 | Hôpital Sallanches : +33 4 50 47 30 00' })}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>${t({ en: 'Property Owner', fr: 'Propriétaire' })}</strong><br>
            ${t({ en: 'Available 24/7 for emergencies: +33 6 85 85 84 91', fr: 'Disponible 24h/24 pour urgences : +33 6 85 85 84 91' })}
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #ccc; padding-top: 20px;">
          <p style="color: #666; font-size: 11px;">
            ${chaletName} - ${t({ en: 'Guest Guide', fr: 'Guide du Voyageur' })}<br>
            ${t({ en: 'Generated on', fr: 'Généré le' })} ${new Date().toLocaleDateString(t({ en: 'en-US', fr: 'fr-FR' }))}
          </p>
        </div>
      `;

      // Ajouter temporairement au DOM pour la capture
      document.body.appendChild(printContent);

      // Générer le canvas
      const canvas = await html2canvas(printContent, {
        useCORS: true,
        allowTaint: true,
        background: '#ffffff',
        width: printContent.offsetWidth,
        height: printContent.offsetHeight
      });

      // Supprimer l'élément temporaire
      document.body.removeChild(printContent);

      // Créer le PDF
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

      // Télécharger le PDF
      const fileName = `${chaletName}-Guide-${t({ en: 'En', fr: 'Fr' })}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert(t({ 
        en: 'Error generating PDF. Please try again.', 
        fr: 'Erreur lors de la génération du PDF. Veuillez réessayer.' 
      }));
    }
  };

  const sections = [
    {
      title: { en: 'Welcome & Check-in', fr: 'Bienvenue & Arrivée' },
      icon: '🏠',
      items: [
        {
          subtitle: { en: 'Check-in Time', fr: 'Heure d\'Arrivée' },
          content: { en: 'Sunday from 4:00 PM. Please contact us if you need to arrive earlier.', fr: 'Dimanche à partir de 16h00. Contactez-nous si vous devez arriver plus tôt.' },
        },
        {
          subtitle: { en: 'Key Collection', fr: 'Récupération des Clés' },
          content: { en: 'Keys will be provided upon arrival. We will meet you at the chalet to show you around.', fr: 'Les clés seront fournies à l\'arrivée. Nous vous accueillerons au chalet pour vous faire visiter.' },
        },
        {
          subtitle: { en: 'WiFi Access', fr: 'Accès WiFi' },
          content: { en: 'WiFi credentials will be provided upon arrival.', fr: 'Les identifiants WiFi vous seront communiqués à votre arrivée.' },
        },
      ],
    },
    {
      title: { en: 'House Equipment', fr: 'Équipements de la Maison' },
      icon: '🔧',
      items: [
        {
          subtitle: { en: 'Gourmet Kitchen', fr: 'Cuisine Gastronomique' },
          content: { en: 'Authentic Savoyard kitchen fully equipped: professional oven, traditional gas range, premium dishwasher, Nespresso machine, toaster, kettle, and grand dining table seating 10 guests. All cooking utensils, pots, pans, and dinnerware provided.', fr: 'Authentique cuisine savoyarde entièrement équipée : four professionnel, piano à gaz traditionnel, lave-vaisselle haut de gamme, machine Nespresso, grille-pain, bouilloire, et grande table conviviale pour 10 convives. Tous ustensiles, casseroles, poêles et vaisselle fournis.' },
        },
        {
          subtitle: { en: 'Wellness & Relaxation', fr: 'Bien-être & Détente' },
          content: { en: 'Outdoor hot tub with breathtaking mountain views, authentic stone fireplace with complimentary firewood, and premium heated floors throughout for ultimate comfort.', fr: 'Jacuzzi extérieur avec vue montagne à couper le souffle, authentique cheminée en pierre avec bois gratuit, et sols chauffants haut de gamme partout pour un confort ultime.' },
        },
        {
          subtitle: { en: 'Entertainment & Technology', fr: 'Divertissement & Technologie' },
          content: { en: '65" Smart TV with Netflix and Amazon Prime, high-speed WiFi throughout, Bluetooth speaker available. Board games and books in the living room cabinet for cozy evenings.', fr: 'Smart TV 65" avec Netflix et Amazon Prime, WiFi haut débit partout, enceinte Bluetooth disponible. Jeux de société et livres dans le meuble du salon pour les soirées cosy.' },
        },
        {
          subtitle: { en: 'Practical Amenities', fr: 'Équipements Pratiques' },
          content: { en: 'Ski room with boot warmers, washing machine and dryer with detergent provided, iron and ironing board in utility room, 5 private parking spaces, and professional BBQ station on the terrace.', fr: 'Local à skis avec chauffe-chaussures, lave-linge et sèche-linge avec lessive fournie, fer et planche à repasser dans la buanderie, 5 places de parking privé, et station BBQ professionnelle sur la terrasse.' },
        },
      ],
    },
    {
      title: { en: 'House Rules', fr: 'Règlement Intérieur' },
      icon: '📋',
      items: [
        {
          subtitle: { en: 'Smoking', fr: 'Tabac' },
          content: { en: 'Non-smoking property. Smoking is permitted on the terrace only.', fr: 'Propriété non-fumeur. Fumer est autorisé sur la terrasse uniquement.' },
        },
        {
          subtitle: { en: 'Pets', fr: 'Animaux' },
          content: { en: 'Pets are not allowed without prior authorization. Additional fee may apply.', fr: 'Animaux non autorisés sans accord préalable. Supplément possible.' },
        },
        {
          subtitle: { en: 'Noise', fr: 'Bruit' },
          content: { en: 'Please respect quiet hours from 10:00 PM to 8:00 AM. Be considerate of neighbors.', fr: 'Merci de respecter les horaires de calme de 22h00 à 8h00. Soyez respectueux des voisins.' },
        },
        {
          subtitle: { en: 'Parties', fr: 'Fêtes' },
          content: { en: 'No parties or events without prior written permission.', fr: 'Pas de fêtes ou événements sans autorisation écrite préalable.' },
        },
        {
          subtitle: { en: 'Maximum Capacity', fr: 'Capacité Maximale' },
          content: { en: 'Maximum 10 guests. No overnight visitors beyond the booked number.', fr: 'Maximum 10 personnes. Pas de visiteurs pour la nuit au-delà du nombre réservé.' },
        },
      ],
    },
    {
      title: { en: 'Practical Information', fr: 'Informations Pratiques' },
      icon: '💡',
      items: [
        {
          subtitle: { en: 'Garbage & Recycling', fr: 'Poubelles & Recyclage' },
          content: { en: 'Waste bins are in the garage. Yellow bins for recycling (plastic, cardboard, paper), green for glass, black for general waste. Collection on Tuesdays and Fridays.', fr: 'Poubelles dans le garage. Bacs jaunes pour recyclage (plastique, carton, papier), verts pour verre, noirs pour ordures ménagères. Collecte mardi et vendredi.' },
        },
        {
          subtitle: { en: 'Parking', fr: 'Stationnement' },
          content: { en: '5 private parking spaces directly in front of the chalet (2 covered spaces + 3 outdoor spaces). Snow chains required in winter.', fr: '5 places de parking privé devant le chalet (2 places couvertes + 3 places extérieures). Chaînes à neige obligatoires en hiver.' },
        },
        {
          subtitle: { en: 'Local Shops', fr: 'Commerces Locaux' },
          content: { en: 'Supermarket (Carrefour) 5 min drive in Cluses. Bakery 3 min away in village center. Pharmacy in Cluses.', fr: 'Supermarché (Carrefour) à 5 min en voiture à Cluses. Boulangerie à 3 min au centre du village. Pharmacie à Cluses.' },
        },
        {
          subtitle: { en: 'Ski Equipment Rental', fr: 'Location Matériel Ski' },
          content: { en: 'Recommended: Sport 2000 in Les Carroz (10 min) - mention Chalet-Balmotte810 for 10% discount.', fr: 'Recommandé : Sport 2000 aux Carroz (10 min) - mentionnez Chalet-Balmotte810 pour 10% de réduction.' },
        },
      ],
    },
    {
      title: { en: 'Emergency Contacts', fr: 'Contacts d\'Urgence' },
      icon: '🚨',
      items: [
        {
          subtitle: { en: 'Emergency Services', fr: 'Services d\'Urgence' },
          content: { en: 'Emergency (Police/Fire/Ambulance): 112 or 15 | Hospital Sallanches: +33 4 50 47 30 00', fr: 'Urgences (Police/Pompiers/SAMU) : 112 ou 15 | Hôpital Sallanches : +33 4 50 47 30 00' },
        },
        {
          subtitle: { en: 'Property Owner', fr: 'Propriétaire' },
          content: { en: 'Available 24/7 for emergencies: +33 6 85 85 84 91', fr: 'Disponible 24h/24 pour urgences : +33 6 85 85 84 91' },
        },
        {
          subtitle: { en: 'Local Doctor', fr: 'Médecin Local' },
          content: { en: 'Dr Cecile NEUVILLERS, Cluses: +33 6 65 05 95 13', fr: 'Dr Cecile NEUVILLERS, Cluses : +33 6 65 05 95 13' },
        },
        {
          subtitle: { en: 'Plumber/Electrician', fr: 'Plombier/Électricien' },
          content: { en: 'For non-emergency repairs, contact us first. Emergency plumber: +33 6 01 61 67 49', fr: 'Pour réparations non urgentes, contactez-nous d\'abord. Plombier urgence : +33 6 01 61 67 49' },
        },
      ],
    },
    {
      title: { en: 'Check-out Instructions', fr: 'Instructions de Départ' },
      icon: '✈️',
      items: [
        {
          subtitle: { en: 'Check-out Time', fr: 'Heure de Départ' },
          content: { en: 'Sunday by 10:00 AM. Late check-out may be available upon request (additional fee).', fr: 'Dimanche avant 10h00. Départ tardif possible sur demande (supplément).' },
        },
        {
          subtitle: { en: 'Before You Leave', fr: 'Avant de Partir' },
          content: { en: 'Please: empty fridge, run dishwasher, take out trash, turn off lights, close windows, set heating to 15°C, lock all doors.', fr: 'Merci de : vider le frigo, lancer le lave-vaisselle, sortir les poubelles, éteindre les lumières, fermer les fenêtres, régler chauffage à 15°C, fermer à clé.' },
        },
        {
          subtitle: { en: 'Key Return', fr: 'Retour des Clés' },
          content: { en: 'Leave keys in the key box by the front door. Code will be provided upon arrival.', fr: 'Laisser les clés dans la boîte à clés près de la porte d\'entrée. Code fourni à l\'arrivée.' },
        },
        {
          subtitle: { en: 'Feedback', fr: 'Avis' },
          content: { en: 'We would love to hear about your stay! Please leave a review on our website or booking platform.', fr: 'Nous aimerions avoir votre avis sur votre séjour ! Merci de laisser un commentaire sur notre site ou plateforme de réservation.' },
        },
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Salon.webp"
            alt={t({ en: 'Welcome guide', fr: 'Guide de bienvenue' })}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t({ en: 'Guest Guide', fr: 'Guide du Voyageur' })}</h1>
          <p className="text-xl md:text-2xl">{t({ en: 'Everything You Need to Know', fr: 'Tout ce que Vous Devez Savoir' })}</p>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-12 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t({ en: 'Welcome to Chalet-Balmotte810!', fr: 'Bienvenue à Chalet-Balmotte810 !' })}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {t({
              en: 'We are delighted to welcome you to our home in the heart of the French Alps. This guide contains all the information you need to make the most of your stay. If you have any questions, please don\'t hesitate to contact us.',
              fr: 'Nous sommes ravis de vous accueillir dans notre maison au cœur des Alpes françaises. Ce guide contient toutes les informations nécessaires pour profiter au maximum de votre séjour. Si vous avez des questions, n\'hésitez pas à nous contacter.',
            })}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t({
              en: 'We hope you have a wonderful stay and create unforgettable memories!',
              fr: 'Nous espérons que vous passerez un séjour merveilleux et créerez des souvenirs inoubliables !',
            })}
          </p>
        </div>
      </section>

      {/* Guide Sections */}
      {sections.map((section, sectionIndex) => (
        <section
          key={sectionIndex}
          className={`py-12 ${sectionIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center flex items-center justify-center gap-3">
              <span className="text-4xl">{section.icon}</span>
              {t(section.title)}
            </h2>

            <div className="space-y-6">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`${
                    sectionIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {t(item.subtitle)}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t(item.content)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Local Tips */}
      <section className="py-12 bg-white border-t border-gray-200/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-700">
            {t({ en: 'Local Tips & Recommendations', fr: 'Conseils & Recommandations Locales' })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-700">🍽️ {t({ en: 'Restaurants', fr: 'Restaurants' })}</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>La Ferme des Vonezins</strong> - {t({ en: 'Traditional Savoyard cuisine', fr: 'Cuisine savoyarde traditionnelle' })}</li>
                <li><strong>Le Belvédère</strong> - {t({ en: 'Mountain views, fondue specialist', fr: 'Vue montagne, spécialiste fondue' })}</li>
                <li><strong>Le Refuge</strong> - {t({ en: 'Cozy atmosphere, local ingredients', fr: 'Ambiance chaleureuse, produits locaux' })}</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-700">🛒 {t({ en: 'Shopping', fr: 'Courses' })}</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Carrefour Cluses</strong> - {t({ en: 'Large supermarket, 5 min drive', fr: 'Grand supermarché, 5 min voiture' })}</li>
                <li><strong>Boulangerie du Village</strong> - {t({ en: 'Fresh bread daily, 3 min', fr: 'Pain frais quotidien, 3 min' })}</li>
                <li><strong>Fromagerie Bouvier</strong> - {t({ en: 'Local cheeses, must-visit', fr: 'Fromages locaux, incontournable' })}</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-700">⛷️ {t({ en: 'Ski Tips', fr: 'Conseils Ski' })}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>{t({ en: 'Arrive at slopes before 9 AM to avoid crowds', fr: 'Arriver aux pistes avant 9h pour éviter la foule' })}</li>
                <li>{t({ en: 'Book ski school in advance during holidays', fr: 'Réserver l\'école de ski à l\'avance pendant vacances' })}</li>
                <li>{t({ en: 'Flaine (Grand Massif) on Sundays - quieter than weekdays', fr: 'Flaine (Grand Massif) le dimanche - plus calme qu\'en semaine' })}</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-700">🌄 {t({ en: 'Activities', fr: 'Activités' })}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>{t({ en: 'Ice climbing - Cascade de Boëge', fr: 'Cascade de glace - Boëge' })}</li>
                <li>{t({ en: 'Snowshoeing - Col de la Colombière', fr: 'Raquettes - Col de la Colombière' })}</li>
                <li>{t({ en: 'Thermal spa - Les Thermes de St-Gervais', fr: 'Spa thermal - Thermes de St-Gervais' })}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download PDF */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t({ en: 'Need This Information Offline?', fr: 'Besoin de ces Infos Hors Ligne ?' })}
          </h2>
          <p className="text-gray-700 mb-8">
            {t({
              en: 'Download the complete guest guide as a PDF to have all information at your fingertips during your stay.',
              fr: 'Téléchargez le guide complet en PDF pour avoir toutes les informations à portée de main pendant votre séjour.',
            })}
          </p>
          <button
            onClick={generatePDF}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-slate-700 hover:border-slate-800"
          >
            <span>📄</span>
            {t({ en: 'Download PDF Guide', fr: 'Télécharger le Guide PDF' })}
          </button>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-white border-t border-gray-200/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">
            {t({ en: 'Questions or Issues During Your Stay?', fr: 'Questions ou Problèmes Pendant Votre Séjour ?' })}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {t({
              en: 'We\'re here to help! Don\'t hesitate to reach out if you need anything.',
              fr: 'Nous sommes là pour vous aider ! N\'hésitez pas à nous contacter si besoin.',
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-slate-700 hover:border-slate-800"
            >
              {t({ en: 'Contact Us', fr: 'Nous Contacter' })}
            </a>
            <a
              href="tel:+33685858491"
              className="inline-block border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              {t({ en: 'Call Us', fr: 'Appelez-Nous' })}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
