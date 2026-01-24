interface PromotionalTwoColumnProps {
  videoUrl?: string;
  videoPoster?: string;
}

export default function PromotionalTwoColumn({
  videoUrl,
  videoPoster,
}: PromotionalTwoColumnProps = {}) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0">
        {/* 左側: 無料配送と返金保証の説明 */}
        <div className="relative h-[250px] md:h-[300px] lg:h-[350px] flex items-center bg-gradient-to-br from-[#8B6F47] to-[#7A5F3A]">
          <div className="relative w-full px-4 lg:px-8 xl:px-12">
            <div className="max-w-xl space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                Free Shipping & 7-Day Returns
              </h2>
              <div className="space-y-2 md:space-y-3">
                <p className="text-sm md:text-base lg:text-lg text-white/95">
                  <span className="font-semibold">✓ Free Shipping</span> on all
                  orders
                </p>
                <p className="text-sm md:text-base lg:text-lg text-white/95">
                  <span className="font-semibold">✓ 7-Day Returns</span> - Full
                  refund guarantee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 右側: 動画 */}
        <div className="relative h-[250px] md:h-[300px] lg:h-[350px] w-full bg-black">
          {videoUrl ? (
            <video
              src={videoUrl}
              poster={videoPoster}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <p className="text-white/50 text-sm">動画URLを設定してください</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
