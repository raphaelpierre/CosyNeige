import { Translation } from '@/types';

export const translations = {
  // Navigation
  nav: {
    chalet: { fr: 'Le Chalet', en: 'The Chalet' },
    booking: { fr: 'Réservation', en: 'Booking' },
    gallery: { fr: 'Galerie', en: 'Gallery' },
    location: { fr: 'Localisation', en: 'Location' },
    contact: { fr: 'Contact', en: 'Contact' },
    guide: { fr: 'Guide', en: 'Guide' },
    account: { fr: 'Mon compte', en: 'My account' },
    login: { fr: 'Se connecter', en: 'Login' },
    register: { fr: "S'inscrire", en: 'Register' },
    dashboard: { fr: 'Tableau de bord', en: 'Dashboard' },
    reservations: { fr: 'Mes réservations', en: 'My reservations' },
    messages: { fr: 'Messages', en: 'Messages' },
    logout: { fr: 'Se déconnecter', en: 'Logout' }
  },

  // Notifications
  notifications: {
    logoutSuccess: {
      fr: 'À bientôt !',
      en: 'See you soon!'
    },
    loginSuccess: { 
      fr: 'Connexion réussie ! Bienvenue', 
      en: 'Login successful! Welcome' 
    },
    loginError: { 
      fr: 'Erreur de connexion. Vérifiez vos identifiants.', 
      en: 'Login error. Please check your credentials.' 
    },
    registrationSuccess: { 
      fr: 'Inscription réussie ! Vous pouvez maintenant vous connecter.', 
      en: 'Registration successful! You can now log in.' 
    },
    registrationError: { 
      fr: "Erreur lors de l'inscription. Veuillez réessayer.", 
      en: 'Registration error. Please try again.' 
    },
    sessionExpired: { 
      fr: 'Votre session a expiré. Veuillez vous reconnecter.', 
      en: 'Your session has expired. Please log in again.' 
    },
    reservationSuccess: { 
      fr: 'Votre réservation a été envoyée avec succès !', 
      en: 'Your reservation has been sent successfully!' 
    },
    reservationError: { 
      fr: 'Erreur lors de la réservation. Veuillez réessayer.', 
      en: 'Reservation error. Please try again.' 
    },
    contactSuccess: { 
      fr: 'Votre message a été envoyé avec succès !', 
      en: 'Your message has been sent successfully!' 
    },
    contactError: { 
      fr: "Erreur lors de l'envoi du message. Veuillez réessayer.", 
      en: 'Error sending message. Please try again.' 
    }
  },

  // Auth pages
  auth: {
    loginTitle: { fr: 'Se connecter', en: 'Login' },
    registerTitle: { fr: "S'inscrire", en: 'Register' },
    email: { fr: 'Adresse e-mail', en: 'Email address' },
    password: { fr: 'Mot de passe', en: 'Password' },
    firstName: { fr: 'Prénom', en: 'First name' },
    lastName: { fr: 'Nom', en: 'Last name' },
    phone: { fr: 'Téléphone', en: 'Phone' },
    loginButton: { fr: 'Se connecter', en: 'Login' },
    registerButton: { fr: "S'inscrire", en: 'Register' },
    noAccount: { fr: "Pas encore de compte ?", en: "Don't have an account?" },
    alreadyAccount: { fr: 'Déjà un compte ?', en: 'Already have an account?' },
    forgotPassword: { fr: 'Mot de passe oublié ?', en: 'Forgot password?' }
  }
};

export type TranslationKey = keyof typeof translations;
export type NestedTranslationKey<T extends keyof typeof translations> = keyof typeof translations[T];

export function getTranslation(
  category: TranslationKey, 
  key: string, 
  language: 'fr' | 'en' = 'fr'
): string {
  const categoryTranslations = translations[category];
  if (categoryTranslations && categoryTranslations[key as keyof typeof categoryTranslations]) {
    const translation = categoryTranslations[key as keyof typeof categoryTranslations] as Translation;
    return translation[language];
  }
  return key;
}