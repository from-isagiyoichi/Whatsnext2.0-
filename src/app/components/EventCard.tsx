import { useState } from "react";

interface EventCardProps {
  image: string;
  title: string;
  subtitle?: string;
}

export function EventCard({ image, title, subtitle }: EventCardProps) {
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1080";

  // Check if image is invalid (figma:asset, blob:, undefined, etc.)
  const isInvalidImage = !image || image.includes('figma:asset') || image.includes('blob:') || image === 'undefined';
  const displayImage = imageError || isInvalidImage ? fallbackImage : image;

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden group cursor-pointer shadow-xl">
      <img
        src={displayImage}
        alt={title}
        onError={() => {
          if (!imageError) {
            console.warn(`Using fallback image for event: ${title}`);
            setImageError(true);
          }
        }}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white text-2xl font-bold tracking-wide mb-1.5 leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/70 text-xs tracking-wide leading-snug">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}