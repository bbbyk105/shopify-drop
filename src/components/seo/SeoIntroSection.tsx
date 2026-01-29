/**
 * カテゴリ / ルームページの「LP化」用イントロセクション。
 * 将来 CMS に差し替えやすいよう、title / description は props で受け取る。
 */
export interface SeoIntroSectionProps {
  /** 見出し（h1 想定） */
  title: string;
  /** リード文・説明 */
  description: string;
  /** オプション: 追加コンテンツ（CMS でリッチテキスト等を渡す想定） */
  children?: React.ReactNode;
  /** 追加の className */
  className?: string;
}

export default function SeoIntroSection({
  title,
  description,
  children,
  className = "",
}: SeoIntroSectionProps) {
  return (
    <section
      className={`container mx-auto px-4 py-8 md:py-10 max-w-4xl ${className}`}
      aria-labelledby="seo-intro-title"
    >
      <h1
        id="seo-intro-title"
        className="text-2xl md:text-3xl font-bold text-foreground mb-3"
      >
        {title}
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-6">
        {description}
      </p>
      {children}
    </section>
  );
}
