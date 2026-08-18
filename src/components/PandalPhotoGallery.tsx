import React, { useState, useMemo } from 'react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Flame,
  Image as ImageIcon,
  Info,
  Maximize2,
  Share2,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import { PandalGalleryPhoto, getPandalGalleryPhotos } from '../data/pandalGalleryData';
import { useToast } from '../context/ToastContext';

interface PandalPhotoGalleryProps {
  pandalId: string;
  pandalName: string;
  className?: string;
}

type CategoryFilter = 'All' | 'Idol' | 'Decoration' | 'Atmosphere';
type YearFilter = 'All' | '2025' | '2024' | '2023' | 'Historical';

export const PandalPhotoGallery: React.FC<PandalPhotoGalleryProps> = ({
  pandalId,
  pandalName,
  className = '',
}) => {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [activeYear, setActiveYear] = useState<YearFilter>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allPhotos = useMemo(() => {
    return getPandalGalleryPhotos(pandalId, pandalName);
  }, [pandalId, pandalName]);

  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      const matchCat = activeCategory === 'All' || photo.category === activeCategory;
      const matchYear = activeYear === 'All' || photo.year === activeYear;
      return matchCat && matchYear;
    });
  }, [allPhotos, activeCategory, activeYear]);

  const activeLightboxPhoto =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;

  const handlePrevPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredPhotos.length - 1));
  };

  const handleNextPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < filteredPhotos.length - 1 ? prev! + 1 : 0));
  };

  const handleSharePhoto = (photo: PandalGalleryPhoto) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(photo.url);
      showToast('Photo URL copied to clipboard! 📸', 'success');
    }
  };

  const handleDownloadPhoto = (photo: PandalGalleryPhoto) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.target = '_blank';
    link.download = `${photo.pandalName}-${photo.year}-${photo.category}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Opening high-res image for download! 📥', 'success');
  };

  return (
    <div className={`bg-white rounded-3xl p-6 border border-amber-200/90 shadow-sm space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100/80 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Camera className="w-3.5 h-3.5 text-orange-600" />
            <span>HISTORICAL ARCHIVE & GALLERY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
            <span>{pandalName} Photo Gallery</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </h2>
          <p className="text-stone-600 text-xs">
            Authentic high-resolution photographs of the idol (murti), mandap decoration themes, and festive atmosphere across 2025, 2024 & past years.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-2xl shadow-sm">
            {filteredPhotos.length} / {allPhotos.length} Photos
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-orange-500" />
            <span>Category:</span>
          </span>

          {(['All', 'Idol', 'Decoration', 'Atmosphere'] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-stone-900 text-amber-300 shadow-sm scale-105'
                  : 'bg-white text-stone-700 border border-amber-200 hover:bg-amber-100/70'
              }`}
            >
              {cat === 'All' && '✨ All Categories'}
              {cat === 'Idol' && '👑 Idol (Murti)'}
              {cat === 'Decoration' && '🪔 Decoration'}
              {cat === 'Atmosphere' && '🎆 Atmosphere & Aarti'}
            </button>
          ))}
        </div>

        {/* Year Filters */}
        <div className="flex flex-wrap items-center gap-2 border-t border-amber-200/50 pt-2.5">
          <span className="text-[11px] font-extrabold uppercase text-stone-500 mr-1 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-600" />
            <span>Festival Year:</span>
          </span>

          {(['All', '2025', '2024', '2023', 'Historical'] as YearFilter[]).map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeYear === year
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white/80 text-stone-600 border border-amber-200 hover:bg-amber-100/50'
              }`}
            >
              {year === 'All' ? 'All Years' : year === '2025' ? '2025 (Latest)' : year}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="p-12 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-300 space-y-2">
          <ImageIcon className="w-10 h-10 text-stone-400 mx-auto" />
          <h4 className="text-sm font-bold text-stone-700">No photos match the selected filters</h4>
          <p className="text-xs text-stone-500">Try selecting "All Categories" or "All Years" to view the complete photo archive.</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setActiveYear('All');
            }}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative h-60 rounded-2xl overflow-hidden cursor-pointer border border-amber-200/80 bg-stone-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={photo.url}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Top Floating Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                <span className="bg-stone-900/85 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                  {photo.year}
                </span>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                    photo.category === 'Idol'
                      ? 'bg-orange-500/90 text-white'
                      : photo.category === 'Decoration'
                      ? 'bg-amber-500/90 text-stone-950'
                      : 'bg-purple-600/90 text-white'
                  }`}
                >
                  {photo.category}
                </span>
              </div>

              {/* Dark Gradient Overlay with Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity p-4 flex flex-col justify-end text-white">
                <div className="space-y-1 transform group-hover:translate-y-0 transition-transform">
                  <h4 className="text-xs sm:text-sm font-bold line-clamp-1 text-amber-200 group-hover:text-amber-100">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-stone-300 line-clamp-2 leading-tight">
                    {photo.description}
                  </p>
                  <div className="pt-1.5 flex items-center justify-between text-[10px] text-amber-300/80 border-t border-amber-500/20">
                    <span className="truncate">Source: {photo.source}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold shrink-0">
                      <Maximize2 className="w-3 h-3" />
                      <span>View</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal Carousel */}
      {activeLightboxPhoto && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 bg-stone-950/90 backdrop-blur-lg z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-900 border border-stone-800 text-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
          >
            {/* Header Toolbar */}
            <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
              <div className="flex items-center gap-3">
                <span className="bg-amber-500 text-stone-950 text-xs font-black px-3 py-1 rounded-full">
                  {activeLightboxPhoto.year}
                </span>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {activeLightboxPhoto.category} ARCHIVE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSharePhoto(activeLightboxPhoto)}
                  className="p-2 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl transition-colors"
                  title="Share Photo URL"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownloadPhoto(activeLightboxPhoto)}
                  className="p-2 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl transition-colors"
                  title="Download High Res Photo"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 bg-stone-800 hover:bg-rose-600 text-white rounded-xl transition-colors"
                  title="Close Gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Stage Image & Navigation Arrows */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[450px] p-2 overflow-hidden">
              <button
                onClick={handlePrevPhoto}
                className="absolute left-3 z-10 p-3 rounded-full bg-stone-900/80 hover:bg-orange-500 text-white transition-all shadow-xl hover:scale-110 border border-stone-700"
                title="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={activeLightboxPhoto.url}
                alt={activeLightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[55vh] sm:max-h-[65vh] w-auto object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />

              <button
                onClick={handleNextPhoto}
                className="absolute right-3 z-10 p-3 rounded-full bg-stone-900/80 hover:bg-orange-500 text-white transition-all shadow-xl hover:scale-110 border border-stone-700"
                title="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Image Details Footer */}
            <div className="p-4 sm:p-6 bg-stone-950 space-y-2 border-t border-stone-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-base sm:text-xl font-bold text-amber-300 font-['Rozha_One',serif]">
                  {activeLightboxPhoto.title}
                </h3>
                <span className="text-xs text-stone-400 italic">
                  Photo {lightboxIndex! + 1} of {filteredPhotos.length}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {activeLightboxPhoto.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-stone-400 border-t border-stone-800/80 gap-2">
                <span>
                  Source Archive: <strong className="text-amber-200">{activeLightboxPhoto.source}</strong>
                </span>
                {activeLightboxPhoto.photographer && (
                  <span>
                    Photographer Credit: <strong className="text-stone-200">{activeLightboxPhoto.photographer}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
