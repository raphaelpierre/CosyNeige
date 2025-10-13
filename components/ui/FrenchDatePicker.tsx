'use client';

import { useState, forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import { useLanguage } from '@/lib/hooks/useLanguage';
import 'react-datepicker/dist/react-datepicker.css';

// Enregistrer la locale française
registerLocale('fr', fr);

interface FrenchDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

// Composant personnalisé pour l'input
const CustomInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void; placeholder?: string; className?: string; required?: boolean }>(({ value, onClick, placeholder, className, required }, ref) => (
  <input
    className={className}
    onClick={onClick}
    value={value}
    placeholder={placeholder}
    required={required}
    ref={ref}
    readOnly
  />
));

CustomInput.displayName = 'CustomInput';

export default function FrenchDatePicker({
  value,
  onChange,
  label,
  required = false,
  className = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent cursor-pointer",
  placeholder,
}: FrenchDatePickerProps) {
  const { language } = useLanguage();
  
  const selectedDate = value ? new Date(value) : null;
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Format YYYY-MM-DD pour compatibilité avec les formulaires
      const formattedDate = date.toISOString().split('T')[0];
      onChange(formattedDate);
    } else {
      onChange('');
    }
  };

  const getLocalizedPlaceholder = () => {
    if (placeholder) return placeholder;
    return language === 'fr' ? 'Sélectionner une date' : 'Select a date';
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        locale={language === 'fr' ? 'fr' : 'en'}
        dateFormat={language === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
        placeholderText={getLocalizedPlaceholder()}
        customInput={
          <CustomInput 
            className={className}
            placeholder={getLocalizedPlaceholder()}
            required={required}
          />
        }
        showPopperArrow={false}
        popperClassName="z-50"
        calendarClassName="shadow-lg border border-gray-200 rounded-lg"
        dayClassName={(date) => 
          "hover:bg-forest-100 hover:text-forest-900 text-center leading-9 transition-colors duration-150"
        }
        weekDayClassName={() => 
          "text-gray-500 text-xs font-medium leading-8 text-center"
        }
        monthClassName={() => 
          "text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        }
        timeClassName={() => 
          "text-gray-700 hover:bg-gray-100"
        }
        previousMonthButtonLabel="‹"
        nextMonthButtonLabel="›"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
}