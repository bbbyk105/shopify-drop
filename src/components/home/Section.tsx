import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  showDivider?: boolean;
  containerClassName?: string;
}

/**
 * 統一されたセクションラッパーコンポーネント
 * Article.com準拠のレイアウト規律を提供
 */
export default function Section({
  children,
  title,
  subtitle,
  className = "",
  showDivider = false,
  containerClassName = "",
}: SectionProps) {
  return (
    <section
      className={`py-12 lg:py-16 ${showDivider ? "border-t border-border" : ""} ${className}`}
    >
      <div className={`container mx-auto px-4 ${containerClassName}`}>
        {(title || subtitle) && (
          <div className="mb-8 lg:mb-12">
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
