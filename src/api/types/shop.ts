import type { Image } from '@/api/types/image';

export type ShopSource = 'internal' | 'external';

export interface ShopDTO {
  id: number;
  title: string;
  isExternal: boolean;
  externalId: string | null;
  imageId: number | null;
  image: Image;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopListDTO {
  totalCount: number;
  totalPages: number;
  items: ShopDTO[];
}

export interface ShopSearchParams {
  title?: string;
  source?: ShopSource;
  limit?: number;
  page?: number;
  sortBy?: keyof ShopDTO;
  order?: 'asc' | 'desc';
}
