// JSON-LD Structured Data for SEO
export const vacationRentalSchema = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': 'https://chalet-balmotte810.com',
  name: 'Chalet-Balmotte810',
  description: 'Luxury 5-bedroom alpine chalet in Châtillon-sur-Cluses with jacuzzi. Access to 5 major ski resorts: Grand Massif, Portes du Soleil, Chamonix, Evasion Mont-Blanc, and Megève.',
  image: [
    'https://chalet-balmotte810.com/images/chalet_neige_devant.webp',
    'https://chalet-balmotte810.com/images/jacusi.webp',
    'https://chalet-balmotte810.com/images/Salon2.webp',
  ],
  url: 'https://chalet-balmotte810.com',
  telephone: '+33-XXX-XXX-XXX',
  email: 'contact@chalet-balmotte810.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Route de Balmotte',
    addressLocality: 'Châtillon-sur-Cluses',
    addressRegion: 'Haute-Savoie',
    postalCode: '74300',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 46.0833,
    longitude: 6.5667,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  priceRange: '€€€',
  amenityFeature: [
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Jacuzzi',
      value: true,
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Parking',
      value: '5 spaces',
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'WiFi',
      value: true,
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Ski Storage',
      value: true,
    },
  ],
  numberOfRooms: 5,
  petsAllowed: false,
  smokingAllowed: false,
  starRating: {
    '@type': 'Rating',
    ratingValue: '5',
  },
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Chalet-Balmotte810',
  url: 'https://chalet-balmotte810.com',
  logo: 'https://chalet-balmotte810.com/images/chalet_neige_devant.webp',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@chalet-balmotte810.com',
    contactType: 'Customer Service',
    availableLanguage: ['French', 'English'],
  },
  sameAs: [],
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
