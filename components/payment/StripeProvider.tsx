'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret: string;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#374151', // slate-700
        colorBackground: '#ffffff',
        colorText: '#111827', // gray-900
        colorDanger: '#dc2626', // red-600
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '12px',
        spacingUnit: '6px',
      },
      rules: {
        '.Input': {
          boxShadow: 'none',
          border: '2px solid #e5e7eb', // gray-200
        },
        '.Input:focus': {
          border: '2px solid #374151', // slate-700
          boxShadow: '0 0 0 2px rgba(55, 65, 81, 0.1)',
        },
        '.Label': {
          fontWeight: '600',
          marginBottom: '8px',
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}