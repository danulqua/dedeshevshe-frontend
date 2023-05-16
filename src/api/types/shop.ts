export interface ShopDTO {
  id: number;
  title: string;
  isExternal: boolean;
  externalId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopListDTO {
  totalCount: number;
  totalPages: number;
  items: ShopDTO[];
}
