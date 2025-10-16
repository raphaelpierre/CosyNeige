'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { galleryImages } from '@/lib/data/chalet';

function GalleryContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Read filter from URL query parameter on mount
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && ['all', 'exterior', 'living', 'kitchen', 'bedroom', 'bathroom', 'wellness'].includes(filterParam)) {
      setFilter(filterParam);
    }
  }, [searchParams]);

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
    <div className="bg-white min-h-screen">
      {/* Hero Section - Lumineux */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={galleryImages[0].url}
            alt={t(galleryImages[0].alt)}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-white" />
        </div>
        <div className="relative z-10 text-center text-gray-900 px-4">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <span>📸</span>
            <span>{galleryImages.length} {t({ en: 'photos', fr: 'photos' })}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 tracking-tight text-white drop-shadow-2xl">
            {t({ en: 'Gallery', fr: 'Galerie' })}
          </h1>
          <p className="text-lg md:text-xl font-light text-white drop-shadow-lg">{t({ en: 'Immerse yourself in luxury', fr: 'Plongez dans le luxe' })}</p>
        </div>
      </section>

      {/* Filter Tabs - Moderne et clair */}
      <section className="py-3 md:py-4 bg-white/95 backdrop-blur-sm sticky top-16 md:top-20 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
            {/* Boutons filtres clairs */}
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                className={`group relative flex-shrink-0 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full transition-all duration-300 ${
                  filter === category.value
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                }`}
              >
                <span className="text-sm md:text-base">{category.icon}</span>
                <span className="font-semibold text-xs md:text-sm whitespace-nowrap">
                  {t(category.label)}
                </span>
                {filter === category.value && (
                  <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {galleryImages.filter(img => category.value === 'all' || img.category === category.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Masonry moderne sur fond clair */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6">
          {/* Grid masonry avec colonnes variables */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="relative mb-3 md:mb-4 break-inside-avoid cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={image.url}
                    alt={t(image.alt)}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  {/* Overlay au hover - Subtil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <p className="text-white text-xs md:text-sm font-medium drop-shadow-lg">{t(image.alt)}</p>
                    </div>
                  </div>
                  {/* Icône zoom au centre */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-md rounded-full p-3 md:p-4 shadow-xl">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox - Moderne et équilibré */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Close lightbox"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-3 md:top-6 right-3 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-md rounded-full text-slate-900 transition-all z-60 shadow-xl"
            aria-label="Close"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 md:left-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-md rounded-full text-slate-900 transition-all z-60 shadow-xl"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-md rounded-full text-slate-900 transition-all z-60 shadow-xl"
            aria-label="Next image"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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

          {/* Caption - Élégant en bas */}
          <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 right-3 md:right-6 text-center">
            <div className="bg-white/95 backdrop-blur-xl inline-block px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl">
              <div className="flex items-center justify-center gap-3 md:gap-4 text-slate-900">
                <span className="text-xs md:text-sm font-bold">
                  {selectedImage + 1} / {filteredImages.length}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs md:text-sm font-medium line-clamp-1">
                  {t(filteredImages[selectedImage].alt)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((selectedImage + 1) / filteredImages.length) * 100}%` }}
            />
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

      {/* CTA - Sur fond clair */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            {t({ en: 'Ready to Book?', fr: 'Prêt à Réserver ?' })}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10">
            {t({ en: 'Experience the chalet in person', fr: 'Vivez l\'expérience du chalet' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>📅</span>
              {t({ en: 'Check Availability', fr: 'Vérifier Disponibilités' })}
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300"
            >
              {t({ en: 'Discover Chalet', fr: 'Découvrir le Chalet' })}
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading gallery...</p>
      </div>
    </div>}>
      <GalleryContent />
    </Suspense>
  );
}
