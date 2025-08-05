import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GlitchText } from './GlitchText';

interface ParallaxGalleryProps {
  galleryImages?: string[];
}

export const ParallaxGallery: React.FC<ParallaxGalleryProps> = ({ galleryImages: galleryImagesArray }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Получаем изображения из API или используем fallback
  const getGalleryImages = (imagesArray?: string[]): string[] => {
    if (!imagesArray || imagesArray.length === 0) {
      return [
        'https://i.imgur.com/UYE3QyZ.jpeg',
        'https://i.imgur.com/YloWbu1.jpeg',
      ];
    }
    
    return imagesArray.filter(url => url && url.trim().length > 0);
  };

  const galleryImages = getGalleryImages(galleryImagesArray);

  if (galleryImages.length === 0) {
    return null;
  }

  const openModal = (image: string) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку фона
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset'; // Восстанавливаем прокрутку
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <GlitchText 
            text="ГАЛЕРЕЯ"
            className="text-cyan-400"
            intensity="medium"
          />
        </h2>
        
        {/* Адаптивная сетка галереи */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="aspect-square overflow-hidden rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 cursor-pointer group"
              onClick={() => openModal(image)}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                style={{
                  filter: 'contrast(1.1) brightness(0.9) hue-rotate(5deg)'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={closeModal}
            className="absolute top-4 left-4 z-60 text-white hover:text-cyan-400 transition-colors p-2 bg-black bg-opacity-50 rounded-full"
          >
            <X size={24} />
          </button>

          {/* Изображение */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на изображение
          >
            <img
              src={selectedImage}
              alt="Gallery preview"
              className="max-w-full max-h-full object-contain rounded-lg border border-cyan-500"
              style={{
                filter: 'contrast(1.1) brightness(0.9) hue-rotate(5deg)'
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};