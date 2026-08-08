import { useState, useEffect, useCallback } from 'react';

interface SiteImage {
  id: number;
  slot_key: string;
  label: string;
  category: string;
  image_url: string;
  updated_at: string;
}

export function useSiteImages() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-images')
      .then(res => res.json())
      .then(data => {
        setImages(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.warn('Failed to fetch site images, using fallbacks:', err);
        setImages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getImage = useCallback(
    (slotKey: string, fallback: string): string => {
      const found = images.find(img => img.slot_key === slotKey);
      if (found && found.image_url && found.image_url.length > 0) {
        return found.image_url;
      }
      return fallback;
    },
    [images]
  );

  const refresh = useCallback(() => {
    fetch('/api/site-images')
      .then(res => res.json())
      .then(data => setImages(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return { images, loading, getImage, refresh };
}
