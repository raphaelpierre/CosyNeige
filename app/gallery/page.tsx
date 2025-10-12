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
    { value: 'all', label: { en: 'All Photos', fr: 'Toutes les Photos' } },
    { value: 'exterior', label: { en: 'Exterior', fr: 'Extérieur' } },
    { value: 'living', label: { en: 'Living Areas', fr: 'Espaces de Vie' } },
    { value: 'bedroom', label: { en: 'Bedrooms', fr: 'Chambres' } },
    { value: 'bathroom', label: { en: 'Bathrooms', fr: 'Salles de Bain' } },
    { value: 'view', label: { en: 'Views', fr: 'Vues' } },
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
          <p className="text-xl md:text-2xl">{t({ en: 'Explore Every Corner', fr: 'Explorez Chaque Recoin' })}</p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  filter === category.value
                    ? 'bg-forest-700 text-white'
                    : 'bg-cream text-forest-700 hover:bg-forest-50'
                }`}
              >
                {t(category.label)}
              </button>
            ))}
          </div>
          <div className="text-center mt-4 text-gray-600">
            {filteredImages.length} {t({ en: 'photos', fr: 'photos' })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="relative h-80 rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow"
              >
                <Image
                  src={image.url}
                  alt={t(image.alt)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-sm font-semibold">{t(image.alt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Close lightbox"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-60"
            aria-label="Close"
          >
            ×
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 text-white text-5xl hover:text-gray-300 transition-colors z-60"
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
            className="absolute right-4 text-white text-5xl hover:text-gray-300 transition-colors z-60"
            aria-label="Next image"
          >
            ›
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] m-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filteredImages[selectedImage].url}
              alt={t(filteredImages[selectedImage].alt)}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <div className="bg-black/70 inline-block px-6 py-3 rounded-lg">
              <p className="text-white text-lg font-semibold">
                {t(filteredImages[selectedImage].alt)}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {selectedImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-4 text-white text-sm opacity-70">
            <p>{t({ en: 'Press ESC to close, ← → to navigate', fr: 'Appuyez sur ÉCHAP pour fermer, ← → pour naviguer' })}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-16 bg-forest-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t({ en: 'Like What You See?', fr: 'Vous Aimez ce que Vous Voyez ?' })}
          </h2>
          <p className="text-xl text-forest-100 mb-8">
            {t({ en: 'Book your stay and experience the chalet in person', fr: 'Réservez votre séjour et découvrez le chalet en personne' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="inline-block bg-white text-forest-800 hover:bg-cream px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {t({ en: 'Check Availability', fr: 'Vérifier Disponibilités' })}
            </a>
            <a
              href="/chalet"
              className="inline-block bg-forest-700 hover:bg-forest-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-white"
            >
              {t({ en: 'Learn More', fr: 'En Savoir Plus' })}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
