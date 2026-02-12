export interface FeedstockInProduct {
  id: number;
  feedstockCode: string;
  name: string;
  stock: number;
  quantity: number;
}

export interface Product {
  id: number;
  productCode: string;
  name: string;
  unitPrice: number;
  feedstocks: FeedstockInProduct[];
}

export interface ProductInFeedstock {
  id: number;
  productCode: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Feedstock {
  id: number;
  feedstockCode: string;
  name: string;
  stock: number;
  unitOfMeasure: string;
  products: ProductInFeedstock[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface CreateFeedstockDTO {
  feedstockCode: string;
  name: string;
  stock: number;
  unitOfMeasure: string;
}

export interface CreateProductDTO {
  productCode: string;
  name: string;
  unitPrice: number;
  feedstocks: {
    feedstockId: number;
    quantity: number;
  }[];
}