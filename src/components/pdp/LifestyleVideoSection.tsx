"use client";

import Image from "next/image";

export interface LifestyleVideoSectionProps {
  /** Video URL; if missing, section renders poster image only */
  videoUrl?: string | null;
  /** Poster/fallback image URL (used when no video or as video poster) */
  posterUrl: string;
  /** Optional one-line caption below the media */
  caption?: string | null;
}

export default function LifestyleVideoSection({
  videoUrl,
  posterUrl,
  caption,
}: LifestyleVideoSectionProps) {
  const useVideo = Boolean(videoUrl && videoUrl.trim());

  return (
    <section className="w-full" aria-label="Lifestyle video">
      <div className="relative w-full overflow-hidden">
        {/* Aspect: ~4:5 mobile, 16:9 desktop (object-cover crops nicely) */}
        <div className="relative w-full aspect-[4/5] md:aspect-video min-h-[200px] md:min-h-[320px] bg-muted/30">
          {useVideo ? (
            <>
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={videoUrl!}
                poster={posterUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Lifestyle room scene"
              />
              {/* Soft gradient overlay for readability if we add text */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
                aria-hidden
              />
            </>
          ) : (
            <>
              <Image
                src={posterUrl}
                alt="Lifestyle room scene"
                fill
                className="object-cover"
                sizes="100vw"
                priority={false}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none"
                aria-hidden
              />
            </>
          )}
        </div>
        {caption && (
          <p className="text-center text-sm text-muted-foreground mt-4 px-4 max-w-xl mx-auto">
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}
