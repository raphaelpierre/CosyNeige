'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { galleryImages } from '@/lib/data/chalet';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { value: 'all', label: { en: 'All Photos', fr: 'Toutes les Photos' }, icon: '📸' },
    { value: 'exterior', label: { en: 'Exterior', fr: 'Extérieur' }, icon: '🏔️' },
    { value: 'living', label: { en: 'Living Areas', fr: 'Espaces de Vie' }, icon: '🛋️' },
    { value: 'kitchen', label: { en: 'Kitchen', fr: 'Cuisine' }, icon: '🍳' },
    { value: 'bedroom', label: { en: 'Bedrooms', fr: 'Chambres' }, icon: '🛏️' },
    { value: 'bathroom', label: { en: 'Bathrooms', fr: 'Salles de Bain' }, icon: '🛁' },
    { value: 'wellness', label: { en: 'Wellness', fr: 'Bien-être' }, icon: '♨️' },
  ];

  const filteredImages = filter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === filter);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={galleryImages[0].url}
            alt={t(galleryImages[0].alt)}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t({ en: 'Photo Gallery', fr: 'Galerie Photos' })}</h1>
          <p className="text-xl md:text-2xl font-light tracking-wide">{t({ en: 'Explore Every Corner', fr: 'Explorez Chaque Recoin' })}</p>
        </div>
      </section>

      {/* Filter Tabs - Modern Compact Design */}
      <section className="py-2 sm:py-3 bg-white/95 backdrop-blur-sm sticky top-20 z-40 border-b border-gray-200">
        <div className="w-full px-2 sm:px-4">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
            {/* Boutons filtres adaptés par taille d'écran */}
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                className={`flex-shrink-0 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 ${
                  filter === category.value
                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="text-xs sm:text-sm md:text-base">{category.icon}</span>
                {/* Texte responsive selon la taille d'écran */}
                <span className="font-medium text-xs hidden sm:inline md:text-sm whitespace-nowrap">
                  {/* Version courte sur petits écrans, complète sur desktop */}
                  <span className="md:hidden">
                    {category.value === 'all' ? 'Toutes' : 
                     category.value === 'exterior' ? 'Ext.' :
                     category.value === 'living' ? 'Salon' :
                     category.value === 'kitchen' ? 'Cuisine' :
                     category.value === 'bedroom' ? 'Chambres' :
                     category.value === 'bathroom' ? 'Bains' :
                     'Spa'}
                  </span>
                  <span className="hidden md:inline">
                    {t(category.label)}
                  </span>
                </span>
                {/* Compteur dans le bouton actif */}
                {filter === category.value && (
                  <span className="bg-white/20 text-white px-1 py-0.5 rounded text-xs font-bold">
                    {galleryImages.filter(img => category.value === 'all' || img.category === category.value).length}
                  </span>
                )}
              </button>
            ))}
            
            {/* Séparateur subtil */}
            <div className="flex-shrink-0 w-0.5 h-4 sm:h-5 bg-gray-300 mx-1 sm:mx-2"></div>
            
            {/* Compteur total moderne */}
            <div className="flex-shrink-0 flex items-center gap-1 bg-gradient-to-r from-slate-50 to-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200">
              <span className="text-slate-700 font-bold text-xs sm:text-sm">{filteredImages.length}</span>
              <span className="text-slate-600 text-xs hidden sm:inline">photos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <Image
                  src={image.url}
                  alt={t(image.alt)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium drop-shadow-lg">{t(image.alt)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm font-medium">
                        {t({ en: 'Click to enlarge', fr: 'Cliquer pour agrandir' })}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Category badge */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-slate-700/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                    {categories.find(c => c.value === image.category)?.icon}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/96 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Close lightbox"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl transition-all z-60 backdrop-blur-sm"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-3xl transition-all z-60 backdrop-blur-sm"
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-3xl transition-all z-60 backdrop-blur-sm"
            aria-label="Next image"
          >
            ›
          </button>

          {/* Image - Optimisé pour mobile paysage */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] sm:max-h-[85vh] m-2 sm:m-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filteredImages[selectedImage].url}
              alt={t(filteredImages[selectedImage].alt)}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="100vw"
              priority
            />
          </div>

          {/* Caption - Compacte sur mobile */}
          <div className="absolute bottom-2 sm:bottom-6 left-0 right-0 text-center px-2 sm:px-4">
            <div className="bg-black/70 sm:bg-black/80 backdrop-blur-md inline-block px-3 py-2 sm:px-6 sm:py-4 rounded-lg sm:rounded-2xl border border-white/10">
              <p className="text-white text-xs sm:text-base md:text-lg font-medium mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2">
                {t(filteredImages[selectedImage].alt)}
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-white font-bold">{selectedImage + 1}</span>
                  <span>/</span>
                  <span>{filteredImages.length}</span>
                </span>
                <span className="text-gray-500 hidden sm:inline">•</span>
                <span className="items-center gap-1 hidden sm:flex">
                  {categories.find(c => c.value === filteredImages[selectedImage].category)?.icon}
                  <span className="capitalize">{t(categories.find(c => c.value === filteredImages[selectedImage].category)?.label || { en: '', fr: '' })}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-xs sm:text-sm opacity-80">
            <p className="hidden sm:block">{t({ en: 'Press ESC to close, ← → to navigate', fr: 'ÉCHAP pour fermer, ← → pour naviguer' })}</p>
            <p className="sm:hidden">{t({ en: 'Tap to close', fr: 'Appuyer pour fermer' })}</p>
          </div>

          {/* Thumbnail strip - Desktop uniquement pour ne pas encombrer mobile */}
          <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 px-4 hidden xl:block">
            <div className="max-w-4xl mx-auto flex gap-2 justify-center overflow-x-auto py-2">
              {filteredImages.slice(Math.max(0, selectedImage - 4), Math.min(filteredImages.length, selectedImage + 5)).map((img, idx) => {
                const actualIndex = Math.max(0, selectedImage - 4) + idx;
                return (
                  <button
                    key={actualIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(actualIndex);
                    }}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      actualIndex === selectedImage
                        ? 'ring-2 ring-white scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-12 bg-white border-t border-forest-100/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">
            {t({ en: 'Like What You See?', fr: 'Vous Aimez ce que Vous Voyez ?' })}
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            {t({ en: 'Book your stay and experience the chalet in person', fr: 'Réservez votre séjour et découvrez le chalet en personne' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-slate-700 hover:border-slate-800"
            >
              {t({ en: 'Check Availability', fr: 'Vérifier Disponibilités' })}
            </a>
            <a
              href="/chalet"
              className="inline-block border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-forest-700 px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              {t({ en: 'Learn More', fr: 'En Savoir Plus' })}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
