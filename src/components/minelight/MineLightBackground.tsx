interface MinecraftBackgroundProps {
  variant?: "grass" | "stone" | "dirt";
  opacity?: number;
}

export default function MinecraftBackground({
  variant = "grass",
  opacity = 0.2,
}: MinecraftBackgroundProps) {
  const patterns = {
    grass: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 8px,
        rgba(0, 100, 0, 0.3) 8px,
        rgba(0, 100, 0, 0.3) 16px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 8px,
        rgba(0, 100, 0, 0.3) 8px,
        rgba(0, 100, 0, 0.3) 16px
      )
    `,
    stone: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 8px,
        rgba(128, 128, 128, 0.3) 8px,
        rgba(128, 128, 128, 0.3) 16px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 8px,
        rgba(128, 128, 128, 0.3) 8px,
        rgba(128, 128, 128, 0.3) 16px
      )
    `,
    dirt: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 8px,
        rgba(139, 69, 19, 0.3) 8px,
        rgba(139, 69, 19, 0.3) 16px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 8px,
        rgba(139, 69, 19, 0.3) 8px,
        rgba(139, 69, 19, 0.3) 16px
      )
    `,
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: patterns[variant],
          backgroundSize: "16px 16px",
        }}
      />
    </div>
  );
}
