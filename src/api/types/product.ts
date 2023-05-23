export interface Discount {
  value: number;
  oldPrice: number;
}

interface ShopIncluded {
  id: number;
  title: string;
  image?: {
    id: number;
    url: string;
  };
}

export interface ProductExternal {
  ean: string;
  title: string;
  shop: ShopIncluded;
  url: string;
  imageUrl: string;
  description: string;
  price: number;
  discount: Discount | null;
  volume: number | null;
  weight: number | null;
  isExternal: true;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'IN_REVIEW';

export interface ProductInternal {
  id: number;
  title: string;
  url: string;
  description?: string;
  price: number;
  discount: number | null;
  oldPrice: number | null;
  volume: number | null;
  weight: number | null;
  isExternal: false;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;
  shopId: number;
  imageId: number | null;
  shop: ShopIncluded;
  user: { id: number; name: string } | null;
  image: { id: number; url: string };
}

export interface ProductsSearchParams {
  title?: string;
  shopId?: number;
  maxPrice?: number;
  discountsOnly?: boolean;
  status?: ProductStatus;
  limit?: number;
  page?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ProductListDTO<T = ProductInternal | ProductExternal> {
  totalCount: number;
  totalPages: number;
  items: T[];
}

export interface CreateProductDTO {
  title: string;
  description: string | null;
  url: string;
  price: number;
  discount: Discount | null;
  volume: number | null;
  weight: number | null;
  status?: ProductStatus;
  shopId: number;
  imageId: number | null;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export const isInternalProduct = (
  product: ProductInternal | ProductExternal
): product is ProductInternal => {
  return !product.isExternal;
};

export const isExternalProduct = (
  product: ProductInternal | ProductExternal
): product is ProductExternal => {
  return product.isExternal;
};

export type ReportOption = 'week' | 'month' | 'year';

export interface PriceHistoryItem {
  price: number;
  createdAt: Date;
}

export interface PriceHistory {
  product: {
    id: number;
    title: string;
  };
  shop: {
    id: number;
    title: string;
  };
  priceHistory: PriceHistoryItem[];
}
