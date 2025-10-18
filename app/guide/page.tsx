'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { chaletName, location } from '@/lib/data/chalet';
import jsPDF from 'jspdf';

export default function GuidePage() {
  const { t } = useLanguage();

  const generatePDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      // Helper to add new page if needed
      const checkPageBreak = (spaceNeeded: number) => {
        if (y + spaceNeeded > pageHeight - margin) {
          pdf.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // HEADER - Same style as invoice
      pdf.setFont('helvetica');

      // Mountain logo
      const logoY = y - 2;
      pdf.setFillColor(30, 41, 59);
      pdf.setLineWidth(0);
      pdf.lines([[2.5, -5], [2.5, 5], [-5, 0]], margin, logoY + 4, [1, 1], 'F');
      pdf.setFillColor(51, 65, 85);
      pdf.lines([[2.5, -3.5], [2.5, 3.5], [-5, 0]], margin + 3.5, logoY + 4, [1, 1], 'F');

      // Company name
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59);
      pdf.text('Chalet Balmotte810', margin + 10, y);
      y += 6;

      // Address
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99);
      pdf.text('810 rte de Balmotte, Chatillon-sur-Cluses, 74300', margin, y);
      y += 4;
      pdf.text('+33 6 85 85 84 91 • contact@chalet-balmotte810.com', margin, y);
      y += 10;

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59);
      pdf.text(t({ en: 'Guest Guide', fr: 'Guide du Voyageur' }), margin, y);
      y += 8;

      // Line separator
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 8;

      // Process each section
      sections.forEach((section) => {
        checkPageBreak(20);

        // Section title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 41, 59);
        pdf.text(t(section.title), margin, y);
        y += 2;

        // Underline
        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 6;

        // Process items in section
        section.items.forEach((item) => {
          checkPageBreak(15);

          // Item subtitle
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(51, 65, 81);
          pdf.text(t(item.subtitle), margin + 3, y);
          y += 5;

          // Item content - split into lines
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 116, 139);

          const contentText = t(item.content);
          const lines = pdf.splitTextToSize(contentText, contentWidth - 6);

          lines.forEach((line: string) => {
            checkPageBreak(5);
            pdf.text(line, margin + 3, y);
            y += 4;
          });

          y += 3;
        });

        y += 5;
      });

      // Footer
      checkPageBreak(20);
      y += 5;
      pdf.setDrawColor(203, 213, 225);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 6;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      const emergencyText = t({
        en: 'For emergencies during your stay, contact us 24/7 at +33 6 85 85 84 91',
        fr: 'Pour les urgences pendant votre sejour, contactez-nous 24h/24 au +33 6 85 85 84 91'
      });
      pdf.text(emergencyText, pageWidth / 2, y, { align: 'center' });
      y += 6;

      pdf.setFontSize(9);
      pdf.setTextColor(148, 163, 184);
      const wishText = t({
        en: 'We wish you a wonderful stay at Chalet-Balmotte810!',
        fr: 'Nous vous souhaitons un merveilleux sejour au Chalet-Balmotte810 !'
      });
      pdf.text(wishText, pageWidth / 2, y, { align: 'center' });

      // Save PDF
      const fileName = `${chaletName}-Guide-${t({ en: 'En', fr: 'Fr' })}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la generation du PDF:', error);
      alert(t({
        en: 'Error generating PDF. Please try again.',
        fr: 'Erreur lors de la generation du PDF. Veuillez reessayer.'
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
      title: { en: 'WiFi & Connectivity', fr: 'WiFi & Connectivité' },
      icon: '📶',
      items: [
        {
          subtitle: { en: 'High-Speed Internet', fr: 'Internet Haut Débit' },
          content: { en: 'Fiber optic connection with speeds up to 500 Mbps. WiFi credentials provided upon arrival. Strong coverage throughout the chalet including all bedrooms.', fr: 'Connexion fibre optique jusqu\'à 500 Mbps. Identifiants WiFi fournis à l\'arrivée. Couverture forte dans tout le chalet y compris toutes les chambres.' },
        },
        {
          subtitle: { en: 'Mobile Coverage', fr: 'Réseau Mobile' },
          content: { en: 'Good 4G/5G coverage with most French providers (Orange, SFR, Free, Bouygues). Signal may be weaker in the basement ski room.', fr: 'Bonne couverture 4G/5G avec la plupart des opérateurs français (Orange, SFR, Free, Bouygues). Signal peut être plus faible au sous-sol (local à skis).' },
        },
        {
          subtitle: { en: 'Streaming & Remote Work', fr: 'Streaming & Télétravail' },
          content: { en: 'Internet speed is suitable for video calls, streaming, and remote work. Multiple devices can connect simultaneously without issues.', fr: 'Vitesse internet adaptée pour visioconférences, streaming, et télétravail. Connexion simultanée de plusieurs appareils sans problème.' },
        },
      ],
    },
    {
      title: { en: 'What to Bring', fr: 'À Apporter' },
      icon: '🎒',
      items: [
        {
          subtitle: { en: 'Essentials', fr: 'Essentiels' },
          content: { en: 'Towels and bed linens are provided. Bring: toiletries, medications, phone chargers, adapters (EU plugs), sunscreen, sunglasses.', fr: 'Draps et serviettes fournis. À apporter : produits toilette, médicaments, chargeurs téléphone, adaptateurs (prises EU), crème solaire, lunettes soleil.' },
        },
        {
          subtitle: { en: 'Winter Season', fr: 'Saison Hiver' },
          content: { en: 'Snow chains (mandatory by law in winter), warm clothes, ski gear (or rent locally), winter boots, gloves, hat. The chalet has boot warmers and ski storage.', fr: 'Chaînes à neige (obligatoires par loi en hiver), vêtements chauds, équipement ski (ou location sur place), chaussures hiver, gants, bonnet. Le chalet a chauffe-chaussures et rangement skis.' },
        },
        {
          subtitle: { en: 'Summer Season', fr: 'Saison Été' },
          content: { en: 'Hiking boots, swimsuit (for hot tub), light jacket for evenings, insect repellent, reusable water bottle. BBQ equipment provided.', fr: 'Chaussures randonnée, maillot bain (pour jacuzzi), veste légère pour soirées, anti-moustiques, gourde réutilisable. Équipement BBQ fourni.' },
        },
        {
          subtitle: { en: 'Groceries', fr: 'Courses' },
          content: { en: 'We recommend shopping before arrival (Carrefour in Cluses). Basic condiments provided: salt, pepper, oil. Coffee capsules (Nespresso) not included.', fr: 'Nous recommandons de faire courses avant arrivée (Carrefour à Cluses). Condiments basiques fournis : sel, poivre, huile. Capsules café (Nespresso) non incluses.' },
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
      title: { en: 'Activities & Experiences', fr: 'Activités & Expériences' },
      icon: '🎯',
      items: [
        {
          subtitle: { en: 'Winter - Alpine Skiing & Snowboarding', fr: 'Hiver - Ski Alpin & Snowboard' },
          content: { en: '650km slopes across 5 resorts (Grand Massif, Les Carroz, Flaine, Samoëns, Morillon). All levels, parks & freeride zones. Arrive before 9 AM to avoid crowds. Book ski school in advance during holidays.', fr: '650km de pistes sur 5 stations (Grand Massif, Les Carroz, Flaine, Samoëns, Morillon). Tous niveaux, parks & zones freeride. Arriver avant 9h pour éviter la foule. Réserver école de ski à l\'avance pendant vacances.' },
        },
        {
          subtitle: { en: 'Winter - Snowshoeing & Ice Climbing', fr: 'Hiver - Raquettes & Cascade de Glace' },
          content: { en: 'Marked snowshoe trails at Col de la Colombière and Plateau des Glières. Guided moonlight tours available. Ice climbing at Cascade de Boëge and Sixt-Fer-à-Cheval. Nordic skiing, sledding, dog sledding, and ice skating also available.', fr: 'Sentiers raquettes balisés au Col de la Colombière et Plateau des Glières. Sorties nocturnes guidées disponibles. Cascade de glace à Boëge et Sixt-Fer-à-Cheval. Ski de fond, luge, traîneau à chiens, et patinage également disponibles.' },
        },
        {
          subtitle: { en: 'Summer - Hiking & Mountain Biking', fr: 'Été - Randonnée & VTT' },
          content: { en: '100+ mountain trails from easy family walks to challenging alpine routes. Must-see: Cirque du Fer-à-Cheval, Lac Bleu. Mountain biking with downhill parks, enduro trails, and cross-country routes. Bike rentals & lessons available.', fr: '100+ sentiers montagne des balades familiales aux routes alpines exigeantes. Incontournables : Cirque du Fer-à-Cheval, Lac Bleu. VTT avec parcs de descente, trails enduro, et parcours cross-country. Location vélos & cours disponibles.' },
        },
        {
          subtitle: { en: 'Summer - Paragliding & Water Sports', fr: 'Été - Parapente & Sports Nautiques' },
          content: { en: 'Tandem paragliding flights with breathtaking views. Via ferrata routes at Passy and Curalla. Mountain lakes (Lac Bleu, Lac de Passy) for swimming. Kayaking, rafting, SUP on rivers. Rock climbing and horse riding also available.', fr: 'Vols tandem parapente avec vues à couper le souffle. Parcours via ferrata à Passy et Curalla. Lacs de montagne (Lac Bleu, Lac de Passy) pour baignade. Kayak, rafting, SUP sur rivières. Escalade et équitation également disponibles.' },
        },
        {
          subtitle: { en: 'Wellness & Spa', fr: 'Bien-être & Spa' },
          content: { en: 'Les Thermes de St-Gervais (20 min) - natural hot springs with spa facilities. Multiple spa centers offering massages, treatments, and wellness programs. Yoga retreats and aquatic centers with pools available year-round.', fr: 'Les Thermes de St-Gervais (20 min) - sources chaudes naturelles avec installations spa. Centres spa offrant massages, soins, et programmes bien-être. Retraites yoga et centres aquatiques avec piscines disponibles toute l\'année.' },
        },
        {
          subtitle: { en: 'Culture & Excursions', fr: 'Culture & Excursions' },
          content: { en: 'Visit charming alpine villages: Samoëns (Plus Beau Village de France), Megève, Yvoire. Mont-Blanc excursions: Aiguille du Midi cable car (35 min), Chamonix valley, Mer de Glace glacier. Weekly markets, cheese farms, wine tastings, castles & museums. Adventure parks and year-round festivals.', fr: 'Visiter villages alpins charmants : Samoëns (Plus Beau Village de France), Megève, Yvoire. Excursions Mont-Blanc : téléphérique Aiguille du Midi (35 min), vallée de Chamonix, glacier Mer de Glace. Marchés hebdomadaires, fermes fromagères, dégustations vins, châteaux & musées. Parcs aventure et festivals toute l\'année.' },
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

      {/* Activities & Experiences */}
      <section className="py-12 bg-white border-t border-gray-200/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-700">
            {t({ en: 'Activities & Experiences', fr: 'Activités & Expériences' })}
          </h2>

          {/* Winter Activities */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span>❄️</span>
              {t({ en: 'Winter Activities', fr: 'Activités Hiver' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">⛷️ {t({ en: 'Alpine Skiing & Snowboarding', fr: 'Ski Alpin & Snowboard' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: '650km slopes across 5 resorts (Grand Massif, Les Carroz, Flaine, Samoëns, Morillon). All levels, parks & freeride zones.', fr: '650km de pistes sur 5 stations (Grand Massif, Les Carroz, Flaine, Samoëns, Morillon). Tous niveaux, parks & zones freeride.' })}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🥾 {t({ en: 'Snowshoeing', fr: 'Raquettes' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Marked trails at Col de la Colombière and Plateau des Glières. Guided moonlight tours available.', fr: 'Sentiers balisés au Col de la Colombière et Plateau des Glières. Sorties nocturnes guidées disponibles.' })}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🧗 {t({ en: 'Ice Climbing', fr: 'Cascade de Glace' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Cascade de Boëge, Sixt-Fer-à-Cheval. Guided expeditions for beginners to experts.', fr: 'Cascade de Boëge, Sixt-Fer-à-Cheval. Sorties encadrées débutants à experts.' })}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🎿 {t({ en: 'Cross-Country & Sledding', fr: 'Ski de Fond & Luge' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Nordic trails nearby. Family sledding slopes at each resort.', fr: 'Pistes nordiques à proximité. Pistes de luge familiales dans chaque station.' })}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🐕 {t({ en: 'Dog Sledding & Ice Skating', fr: 'Traîneau à Chiens & Patinage' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Unique dog sled experiences. Outdoor ice rinks in villages.', fr: 'Expériences traîneau à chiens uniques. Patinoires extérieures dans villages.' })}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">⛷️ {t({ en: 'Ski Tips', fr: 'Conseils Ski' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Arrive before 9 AM to avoid crowds. Book ski school in advance during holidays. Flaine quieter on Sundays.', fr: 'Arriver avant 9h pour éviter la foule. Réserver école de ski à l\'avance pendant vacances. Flaine plus calme le dimanche.' })}</p>
              </div>
            </div>
          </div>

          {/* Summer Activities */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span>☀️</span>
              {t({ en: 'Summer Activities', fr: 'Activités Été' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🥾 {t({ en: 'Hiking', fr: 'Randonnée' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: '100+ mountain trails. Easy family walks to challenging alpine routes. Must-see: Cirque du Fer-à-Cheval, Lac Bleu.', fr: '100+ sentiers montagne. Balades familiales aux routes alpines exigeantes. Incontournables : Cirque du Fer-à-Cheval, Lac Bleu.' })}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🚵 {t({ en: 'Mountain Biking', fr: 'VTT' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Downhill parks, enduro trails, and cross-country routes. Bike rentals & lessons available.', fr: 'Parcs de descente, trails enduro, et parcours cross-country. Location vélos & cours disponibles.' })}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🪂 {t({ en: 'Paragliding & Via Ferrata', fr: 'Parapente & Via Ferrata' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Tandem paragliding flights. Via ferrata routes at Passy and Curalla. Breathtaking views.', fr: 'Vols tandem parapente. Parcours via ferrata à Passy et Curalla. Vues à couper le souffle.' })}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🏊 {t({ en: 'Swimming & Water Sports', fr: 'Baignade & Sports Nautiques' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Mountain lakes (Lac Bleu, Lac de Passy). Kayaking, rafting, SUP on rivers. Aquatic centers.', fr: 'Lacs de montagne (Lac Bleu, Lac de Passy). Kayak, rafting, SUP sur rivières. Centres aquatiques.' })}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🧗 {t({ en: 'Rock Climbing', fr: 'Escalade' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Natural cliffs and climbing parks. Routes for all levels. Guided climbing sessions.', fr: 'Falaises naturelles et parcs d\'escalade. Voies tous niveaux. Séances guidées.' })}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🐎 {t({ en: 'Golf & Horse Riding', fr: 'Golf & Équitation' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Mountain golf courses nearby. Trail horse riding through alpine meadows.', fr: 'Parcours de golf montagne à proximité. Randonnées équestres dans prairies alpines.' })}</p>
              </div>
            </div>
          </div>

          {/* Wellness & Culture */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span>💆</span>
              {t({ en: 'Wellness & Culture', fr: 'Bien-être & Culture' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">♨️ {t({ en: 'Thermal Spa & Wellness', fr: 'Thermes & Bien-être' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Les Thermes de St-Gervais (20 min) - natural hot springs. Spa centers with massages & treatments. Yoga retreats.', fr: 'Les Thermes de St-Gervais (20 min) - sources chaudes naturelles. Centres spa avec massages & soins. Retraites yoga.' })}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🏘️ {t({ en: 'Alpine Villages & Culture', fr: 'Villages Alpins & Culture' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Visit Samoëns (Plus Beau Village), Megève, Yvoire. Weekly markets, local cheeses, wine tasting. Castles & museums.', fr: 'Visiter Samoëns (Plus Beau Village), Megève, Yvoire. Marchés hebdomadaires, fromages locaux, dégustation vins. Châteaux & musées.' })}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🏔️ {t({ en: 'Mont-Blanc & Excursions', fr: 'Mont-Blanc & Excursions' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Aiguille du Midi cable car (35 min). Chamonix valley. Mer de Glace glacier. Guided mountain tours.', fr: 'Téléphérique Aiguille du Midi (35 min). Vallée de Chamonix. Glacier Mer de Glace. Visites guidées montagne.' })}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🎪 {t({ en: 'Family & Events', fr: 'Famille & Événements' })}</h4>
                <p className="text-sm text-gray-700">{t({ en: 'Adventure parks, animal farms. Year-round festivals: music, food, alpine traditions. Christmas markets in winter.', fr: 'Parcs aventure, fermes animalières. Festivals toute l\'année : musique, gastronomie, traditions alpines. Marchés de Noël en hiver.' })}</p>
              </div>
            </div>
          </div>

          {/* Local Tips */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span>💡</span>
              {t({ en: 'Local Tips', fr: 'Conseils Locaux' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🍽️ {t({ en: 'Restaurants', fr: 'Restaurants' })}</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li><strong>La Ferme des Vonezins</strong> - {t({ en: 'Traditional Savoyard', fr: 'Savoyard traditionnel' })}</li>
                  <li><strong>Le Belvédère</strong> - {t({ en: 'Mountain views, fondue', fr: 'Vue montagne, fondue' })}</li>
                  <li><strong>Le Refuge</strong> - {t({ en: 'Local ingredients', fr: 'Produits locaux' })}</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🛒 {t({ en: 'Shopping', fr: 'Courses' })}</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li><strong>Carrefour Cluses</strong> - {t({ en: '5 min drive', fr: '5 min voiture' })}</li>
                  <li><strong>Boulangerie du Village</strong> - {t({ en: '3 min, fresh daily', fr: '3 min, frais quotidien' })}</li>
                  <li><strong>Fromagerie Bouvier</strong> - {t({ en: 'Local cheeses', fr: 'Fromages locaux' })}</li>
                </ul>
              </div>
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
