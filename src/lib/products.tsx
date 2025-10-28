import { Product, Collection } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "noir-elegance",
    name: "Noir Elegance",
    description: "A statement piece for any room.",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop&q=80",
    ],
    category: "Table Lamps",
    details: {
      material: "Brushed Metal, Frosted Glass",
      dimensions: '12" (Diameter) x 20" (Height)',
      designer: "Isabella Rossi",
      bulbType: "LED",
      wattage: "60W",
    },
  },
  {
    id: "2",
    slug: "golden-radiance",
    name: "Golden Radiance",
    description: "Add a touch of luxury to your space.",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80",
    category: "Table Lamps",
  },
  {
    id: "3",
    slug: "serene-glow",
    name: "Serene Glow",
    description: "Simple design, maximum impact.",
    price: 90,
    image:
      "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=800&h=800&fit=crop&q=80",
    category: "Table Lamps",
  },
  {
    id: "4",
    slug: "modern-table-lamp",
    name: "Modern Table Lamp",
    description: "Contemporary design for modern spaces.",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop&q=80",
    category: "Table Lamps",
  },
  {
    id: "5",
    slug: "minimalist-table-lamp",
    name: "Minimalist Table Lamp",
    description: "Clean lines and elegant simplicity.",
    price: 90,
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=800&fit=crop&q=80",
    category: "Table Lamps",
  },
  {
    id: "6",
    slug: "art-deco-table-lamp",
    name: "Art Deco Table Lamp",
    description: "Vintage charm meets modern functionality.",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop&q=80",
    category: "Table Lamps",
  },
];

export const collections: Collection[] = [
  {
    id: "1",
    name: "The Modernist Collection",
    description: "Sleek lines and contemporary designs.",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "2",
    name: "The Classic Collection",
    description: "Timeless elegance for sophisticated spaces.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "3",
    name: "The Artisan Collection",
    description: "Handcrafted lamps with unique character.",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop&q=80",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(
  productId: string,
  limit: number = 3
): Product[] {
  return products.filter((product) => product.id !== productId).slice(0, limit);
}
