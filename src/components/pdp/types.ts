/** Single item in a bundle (for "Complete the space" section) */
export interface BundleItem {
  handle: string;
  variantId: string;
  title: string;
  price: number;
  image: string;
}

/** One bundle group: lifestyle image + 3–4 products + CTA */
export interface BundleGroup {
  title: string;
  subtitle?: string;
  /** Lifestyle room image URL (or video poster) */
  media: string;
  items: BundleItem[];
  /** e.g. "Save 10%" — omit if no discount */
  savings?: string;
}
