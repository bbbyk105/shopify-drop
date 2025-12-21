export interface FeaturedCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  badge?: string;
  image: string;
  theme?: "default" | "minelight";
}

export const featuredCollections: FeaturedCollection[] = [
  {
    id: "minelight",
    title: "MineLight Collection",
    subtitle: "Featured Collection",
    description:
      "A playful drop inspired by game-like lighting — made for real rooms.",
    href: "/minelight",
    badge: "Limited",
    image: "/images/minelight.png",
    theme: "minelight",
  },
];
