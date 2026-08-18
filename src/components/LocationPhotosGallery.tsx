import { Camera, Image as ImageIcon, Sparkles, X, ZoomIn } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getLocationPhotos, LocationPhoto } from '../services/locationPhotos';

interface LocationPhotosGalleryProps {
  locationName: string;
  pandalImageFallback?: string[];
  className?: string;
}

export const LocationPhotosGallery: React.FC<LocationPhotosGalleryProps> = ({
  locationName,
  pandalImageFallback,
  className = '',
}) => {
  const [photos, setPhotos] = useState<LocationPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePhoto, setActivePhoto] = useState<LocationPhoto | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPhotos() {
      if (!locationName) return;
      setLoading(true);
      try {
        const res = await getLocationPhotos(locationName, pandalImageFallback);
        if (isMounted) {
          setPhotos(res);
        }
      } catch (err) {
        console.warn('Error fetching location photos:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPhotos();

    return () => {
      isMounted = false;
    };
  }, [locationName, pandalImageFallback]);

  if (!locationName) return null;

  return (
    <div className={`bg-white rounded-3xl p-5 border border-amber-200/90 shadow-md space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Camera className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 leading-tight flex items-center gap-1.5">
              <span>Location Photos</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </h3>
            <span className="text-[11px] text-stone-500 truncate block max-w-[200px] sm:max-w-xs">
              Photos for "{locationName}"
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full shrink-0">
          {photos.length} Photos
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="h-32 flex items-center justify-center bg-stone-50 rounded-2xl">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden cursor-pointer border border-amber-100 bg-stone-100 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="p-1 bg-black/40 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-[10px] text-white font-semibold line-clamp-2 leading-tight">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-stone-50 text-center rounded-2xl text-xs text-stone-500">
          No location photos found for "{locationName}".
        </div>
      )}

      {/* Lightbox Photo View Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-900 border border-stone-800 text-white rounded-3xl p-4 max-w-2xl w-full space-y-3 relative shadow-2xl overflow-hidden"
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 p-2 bg-stone-800 text-stone-300 hover:text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="max-h-[65vh] w-auto object-contain rounded-2xl"
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-300">{activePhoto.caption}</h4>
              <p className="text-xs text-stone-400">
                Location: <strong className="text-white">{locationName}</strong> • Source:{' '}
                <span className="text-stone-300">{activePhoto.source || 'Verified Photo'}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
