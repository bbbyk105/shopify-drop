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
  // Living Room Products
  {
    id: "7",
    slug: "modern-sofa-living",
    name: "Modern Comfort Sofa",
    description: "Elegant and comfortable sofa perfect for your living room.",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80",
    category: "Living Room",
  },
  {
    id: "8",
    slug: "coffee-table-oak",
    name: "Oak Coffee Table",
    description: "Sturdy oak coffee table with modern design.",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=800&fit=crop&q=80",
    category: "Living Room",
  },
  {
    id: "9",
    slug: "tv-stand-modern",
    name: "Modern TV Stand",
    description: "Sleek TV stand with storage compartments.",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&q=80",
    category: "Living Room",
  },
  {
    id: "10",
    slug: "accent-chair-velvet",
    name: "Velvet Accent Chair",
    description: "Luxurious velvet accent chair for your living space.",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&q=80",
    category: "Living Room",
  },
  // Bedroom Products
  {
    id: "11",
    slug: "platform-bed-queen",
    name: "Modern Platform Bed",
    description: "Minimalist platform bed with built-in storage.",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1631889993951-f6f02e98c5a2?w=800&h=800&fit=crop&q=80",
    category: "Bedroom",
  },
  {
    id: "12",
    slug: "dresser-wooden",
    name: "Wooden Dresser",
    description: "Spacious dresser with multiple drawers.",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80",
    category: "Bedroom",
  },
  {
    id: "13",
    slug: "nightstand-set",
    name: "Matching Nightstand Set",
    description: "Pair of elegant nightstands for your bedroom.",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=800&fit=crop&q=80",
    category: "Bedroom",
  },
  {
    id: "14",
    slug: "wardrobe-modern",
    name: "Modern Wardrobe",
    description: "Spacious wardrobe with sliding doors.",
    price: 1199,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&q=80",
    category: "Bedroom",
  },
  // Dining Room & Kitchen Products
  {
    id: "15",
    slug: "dining-table-extendable",
    name: "Extendable Dining Table",
    description: "Beautiful extendable table perfect for entertaining.",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80",
    category: "Dining Room",
  },
  {
    id: "16",
    slug: "dining-chairs-set",
    name: "Dining Chair Set (4)",
    description: "Set of 4 comfortable dining chairs.",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&q=80",
    category: "Dining Room",
  },
  {
    id: "17",
    slug: "kitchen-island",
    name: "Kitchen Island",
    description: "Functional kitchen island with storage.",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1631889993951-f6f02e98c5a2?w=800&h=800&fit=crop&q=80",
    category: "Kitchen",
  },
  {
    id: "18",
    slug: "bar-stools-set",
    name: "Bar Stool Set (2)",
    description: "Modern bar stools for your kitchen island.",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=800&fit=crop&q=80",
    category: "Kitchen",
  },
  // Outdoor Products
  {
    id: "19",
    slug: "outdoor-dining-set",
    name: "Outdoor Dining Set",
    description: "Weather-resistant outdoor dining set.",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80",
    category: "Outdoor",
  },
  {
    id: "20",
    slug: "patio-lounge-set",
    name: "Patio Lounge Set",
    description: "Comfortable outdoor lounge furniture.",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&q=80",
    category: "Outdoor",
  },
  {
    id: "21",
    slug: "garden-bench",
    name: "Garden Bench",
    description: "Elegant garden bench for your outdoor space.",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&q=80",
    category: "Outdoor",
  },
  {
    id: "22",
    slug: "outdoor-umbrella",
    name: "Outdoor Umbrella",
    description: "Large outdoor umbrella for shade.",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1631889993951-f6f02e98c5a2?w=800&h=800&fit=crop&q=80",
    category: "Outdoor",
  },
  // Home Office Products
  {
    id: "23",
    slug: "desk-executive",
    name: "Executive Desk",
    description: "Spacious desk perfect for your home office.",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=800&fit=crop&q=80",
    category: "Home Office",
  },
  {
    id: "24",
    slug: "office-chair-ergonomic",
    name: "Ergonomic Office Chair",
    description: "Comfortable ergonomic chair for long work sessions.",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80",
    category: "Home Office",
  },
  {
    id: "25",
    slug: "bookshelf-tall",
    name: "Tall Bookshelf",
    description: "Tall bookshelf with multiple shelves.",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&q=80",
    category: "Home Office",
  },
  {
    id: "26",
    slug: "filing-cabinet",
    name: "Filing Cabinet",
    description: "Organized storage for your documents.",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&q=80",
    category: "Home Office",
  },
  // Entryway Products
  {
    id: "27",
    slug: "console-table-entryway",
    name: "Entryway Console Table",
    description: "Elegant console table for your entryway.",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1631889993951-f6f02e98c5a2?w=800&h=800&fit=crop&q=80",
    category: "Entryway",
  },
  {
    id: "28",
    slug: "hall-tree-bench",
    name: "Hall Tree with Bench",
    description: "Functional hall tree with storage bench.",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=800&fit=crop&q=80",
    category: "Entryway",
  },
  {
    id: "29",
    slug: "mirror-entryway",
    name: "Entryway Mirror",
    description: "Large decorative mirror for your entry.",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80",
    category: "Entryway",
  },
  {
    id: "30",
    slug: "shoe-rack-modern",
    name: "Modern Shoe Rack",
    description: "Sleek shoe rack for organized entryway.",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&q=80",
    category: "Entryway",
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
