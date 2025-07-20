import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  threshold?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  fallback,
  threshold = 0.1,
  sizes,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Intersection Observer to detect when image enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          setImageSrc(src);
        }
      },
      {
        threshold,
        rootMargin: '50px', // Start loading 50px before the image is visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, isInView, threshold]);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image load error
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
    onError?.();
    
    // Try fallback image if provided
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
      setHasError(false);
    }
  }, [onError, fallback, imageSrc]);

  // Generate optimized image URL for avatars
  const getOptimizedImageUrl = useCallback((url: string, size: number = 48) => {
    // GitHub avatar optimization
    if (url.includes('avatars.githubusercontent.com')) {
      return `${url}&s=${size}`;
    }
    
    // For other images, you could integrate with image optimization services
    // like Cloudinary, ImageKit, or AWS CloudFront
    return url;
  }, []);

  const optimizedSrc = getOptimizedImageUrl(imageSrc);

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="w-6 h-6 text-muted-foreground">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && !fallback && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="w-6 h-6 text-muted-foreground">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && imageSrc && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={loading}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;

// Hook for preloading images
export const useImagePreloader = () => {
  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback(async (srcs: string[]): Promise<void> => {
    try {
      await Promise.all(srcs.map(src => preloadImage(src)));
    } catch (error) {
      console.warn('Failed to preload some images:', error);
    }
  }, [preloadImage]);

  return { preloadImage, preloadImages };
};

// Component for preloading critical images
export const ImagePreloader: React.FC<{ images: string[] }> = ({ images }) => {
  const { preloadImages } = useImagePreloader();

  useEffect(() => {
    if (images.length > 0) {
      preloadImages(images);
    }
  }, [images, preloadImages]);

  return null; // This component doesn't render anything
};