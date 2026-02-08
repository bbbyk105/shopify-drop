"use client";

interface VerticalVideoSectionProps {
  /** 動画のURL */
  videoUrl: string;
  /** 動画の poster（オプション） */
  posterUrl?: string;
  /** 動画のアスペクト比。16:9 または 9:16 */
  aspectRatio?: "16/9" | "9/16";
  /** セクション見出し */
  title?: string;
  /** サブ見出し・リード文 */
  subtitle?: string;
  /** 本文（複数段落可、改行で区切る） */
  description?: string;
  /** 動画の最大幅（px） */
  maxWidth?: number;
}

/**
 * 動画 + テキストのセクション。lg以上は動画左・テキスト右の2カラム、md以下は縦積み。
 * aspectRatio で 16:9 / 9:16 に対応。コンテナは Section と同一（container mx-auto px-4）。
 */
export default function VerticalVideoSection({
  videoUrl,
  posterUrl,
  aspectRatio = "16/9",
  title,
  subtitle,
  description,
}: VerticalVideoSectionProps) {
  const paragraphs = description?.split("\n").filter(Boolean) ?? [];
  const isWide = aspectRatio === "16/9";

  return (
    <section
      className="w-full py-12 lg:py-16 border-t border-border"
      aria-label="Video section"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center">
          {/* 動画：16:9 は横長で幅多め、9:16 は縦長で幅狭め */}
          <div
            className={
              isWide
                ? "shrink-0 w-full lg:min-w-[400px] lg:max-w-[560px] xl:max-w-[640px]"
                : "shrink-0 w-full max-w-[200px] mx-auto lg:mx-0 lg:w-[280px] xl:w-[320px] lg:max-w-none"
            }
          >
            <div className="relative w-full overflow-hidden rounded-xl bg-muted/30 shadow-lg">
              <div
                className={`relative w-full ${isWide ? "aspect-video" : "aspect-9/16 max-h-[min(80vh,720px)]"}`}
              >
                <video
                  src={videoUrl}
                  poster={posterUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-label="Promotional video"
                />
              </div>
            </div>
          </div>

          {/* 文章：動画の隣（lg）/ 下（md以下） */}
          <div className="min-w-0 flex-1 text-left">
            {title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 sm:mt-3 md:mt-4 text-base md:text-lg lg:text-xl text-muted-foreground font-medium">
                {subtitle}
              </p>
            )}
            {paragraphs.length > 0 && (
              <div className="mt-3 md:mt-5 space-y-2 md:space-y-3">
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm md:text-base text-muted-foreground leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
