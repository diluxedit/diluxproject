import {Layers} from 'lucide-react';
import {useEffect, useState} from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

export function SafeImage({src, alt, className = '', eager = false}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1428] to-[#142B4D] text-slate-300 p-6 text-center ${className}`}
      >
        <Layers className="w-8 h-8 text-[#60A5FA] mb-2" />
        <span className="text-xs font-medium text-slate-300 max-w-[22ch]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
