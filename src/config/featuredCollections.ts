export interface FeaturedCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  badge?: string;
  image: string;
  theme?: "default";
}

export const featuredCollections: FeaturedCollection[] = [];
