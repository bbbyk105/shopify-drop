export type Money = {
  amount: string;
  currencyCode: string;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  description: string;
  descriptionHtml: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
  images: {
    edges: {
      node: {
        id: string;
        url: string;
        altText?: string | null;
        width?: number;
        height?: number;
      };
    }[];
  };
  variants: {
    edges: {
      node: Variant;
    }[];
  };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
  };
  availableForSale: boolean;
  seo?: {
    title?: string | null;
    description?: string | null;
  };
};

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
  image?: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: {
    edges: {
      node: CartLine;
    }[];
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      handle: string;
      title: string;
      featuredImage?: {
        url: string;
        altText?: string | null;
      };
    };
    price: Money;
  };
  cost: {
    totalAmount: Money;
  };
};

export type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
};
