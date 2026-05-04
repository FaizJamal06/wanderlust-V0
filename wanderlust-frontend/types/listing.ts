export interface ListingImage {
  url?: string;
  filename?: string;
}

export interface Geometry {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface ReviewAuthor {
  _id: string;
  username: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  author?: ReviewAuthor;
  createdAt: string;
}

export interface ListingOwner {
  _id: string;
  username: string;
}

export type ListingCategory = 'Trending' | 'Rooms' | 'Penthouse' | 'Beaches' | 'Cabins';

export interface Listing {
  _id: string;
  title: string;
  description: string;
  image?: ListingImage;
  price: number;
  location: string;
  country: string;
  category: ListingCategory;
  geometry?: Geometry;
  reviews?: Review[];
  owner?: ListingOwner;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListingsResponse {
  listings: Listing[];
  pagination: PaginationInfo;
}

export interface CategoryStat {
  name: string;
  count: number;
}

export interface AIRecommendation {
  id: string;
  reason: string;
}

export interface AIResponse {
  recommendations: AIRecommendation[];
}
