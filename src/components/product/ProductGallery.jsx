import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Star } from 'lucide-react';

export default function ProductGallery({ product }) {
  // Normalize images to guaranteed array of 1 to 6 images
  const images = (Array.isArray(product?.images) && product.images.length > 0)
    ? product.images.filter(Boolean).slice(0, 6)
    : (product?.image ? [product.image] : ['/images/products/gulab-jamun.svg']);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset index if product changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [product?.id]);

  const activeImage = images[selectedIndex] || images[0] || '/images/products/gulab-jamun.svg';

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Main Image Viewer */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xs group">
        <img
          src={activeImage}
          alt={`${product?.name || 'Product'} - Photo ${selectedIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/products/gulab-jamun.svg';
          }}
        />

        {/* Badge in Top-Left */}
        {product?.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#07643D] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md tracking-wide">
              {product.badge}
            </span>
          </div>
        )}

        {/* Image Counter Badge in Bottom-Right */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-full shadow-xs">
              {selectedIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Zoom Lightbox Trigger Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black backdrop-blur-xs flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Zoom image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Previous / Next Arrow Controls (Shown only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation Strip (Only shown if product has more than 1 image) */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 scrollbar-thin scrollbar-thumb-gray-300">
          {images.map((imgUrl, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-[#07643D] ring-2 ring-[#07643D]/30 scale-102 shadow-xs'
                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/gulab-jamun.svg';
                  }}
                />
                {idx === 0 && (
                  <span className="absolute bottom-0 inset-x-0 bg-[#D4AF37]/90 text-[8px] text-white font-bold text-center leading-tight py-0.5">
                    Cover
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt={product?.name}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
