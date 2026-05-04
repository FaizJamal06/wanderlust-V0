import type { Listing, ListingsResponse, CategoryStat } from '@/types/listing';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  
  const headers: HeadersInit = {
    ...options?.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // CRITICAL for Passport session cookies
  });

  if (!res.ok) {
    let errorMessage = `API error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMessage = errorData.error;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

export async function getListings(params?: {
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ListingsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.q) searchParams.set('q', params.q);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();
  return apiFetch<ListingsResponse>(`/api/listings${qs ? `?${qs}` : ''}`);
}

export async function getFeaturedListings(): Promise<Listing[]> {
  return apiFetch<Listing[]>('/api/listings/featured');
}

export async function getListing(id: string): Promise<Listing> {
  return apiFetch<Listing>(`/api/listings/${id}`);
}

export async function getCategories(): Promise<CategoryStat[]> {
  return apiFetch<CategoryStat[]>('/api/categories');
}

export function getImageUrl(listing: Listing): string {
  if (listing.image?.url) return listing.image.url;
  if (listing.image?.filename) return `${API_BASE}/uploads/${listing.image.filename}`;
  return '/images/placeholder.jpg';
}

// --- AUTHENTICATION ---

export async function login(credentials: any): Promise<{success: boolean, user: any}> {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function signup(credentials: any): Promise<{success: boolean, user: any}> {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function logout(): Promise<{success: boolean}> {
  return apiFetch('/api/auth/logout', { method: 'POST' });
}

export async function getCurrentUser(): Promise<{user: any | null}> {
  return apiFetch('/api/auth/me');
}

// --- LISTING MUTATIONS ---

export async function createListing(formData: FormData): Promise<{success: boolean, listing: Listing}> {
  return apiFetch('/api/listings', {
    method: 'POST',
    body: formData
  });
}

export async function updateListing(id: string, formData: FormData): Promise<{success: boolean, listing: Listing}> {
  return apiFetch(`/api/listings/${id}`, {
    method: 'PUT',
    body: formData
  });
}

export async function deleteListing(id: string): Promise<{success: boolean}> {
  return apiFetch(`/api/listings/${id}`, { method: 'DELETE' });
}

// --- REVIEWS ---

export async function createReview(listingId: string, data: { rating: number, comment: string }): Promise<{success: boolean, review: any}> {
  return apiFetch(`/api/listings/${listingId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ review: data })
  });
}

export async function deleteReview(listingId: string, reviewId: string): Promise<{success: boolean}> {
  return apiFetch(`/api/listings/${listingId}/reviews/${reviewId}`, { method: 'DELETE' });
}
