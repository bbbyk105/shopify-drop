export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  details?: {
    material?: string;
    dimensions?: string;
    designer?: string;
    bulbType?: string;
    wattage?: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
}
