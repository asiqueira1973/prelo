import { useState } from 'react';

const INVALID_PATTERNS = ['init.gif', 'placeholder', 'default'];

type BookCoverProps = {
  src: string | null;
  title: string;
  className?: string;
};

export default function BookCover({ src, title, className = '' }: BookCoverProps) {
  const hasValidSrc = src ? !INVALID_PATTERNS.some((p) => src.includes(p)) : false;
  const [showPlaceholder, setShowPlaceholder] = useState(!hasValidSrc);

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.naturalWidth < 50 || img.naturalHeight < 50) {
      setShowPlaceholder(true);
    }
  }

  if (showPlaceholder) {
    return (
      <div className={`w-full h-full flex items-center justify-center p-4 ${className}`}>
        <p className="font-serif text-xs text-stone-500 text-center leading-snug line-clamp-4">
          {title}
        </p>
      </div>
    );
  }

  return (
    <img
      key={src}
      src={src!}
      alt={title}
      onError={() => setShowPlaceholder(true)}
      onLoad={handleLoad}
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
