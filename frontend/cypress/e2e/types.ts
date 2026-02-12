export type Feedstock = {
  id: number;
  name: string;
  feedstockCode: string;
  unitOfMeasure: string;
  stock: number;
  products?: any[];
};

export type Product = {
  id: number;
  name: string;
  productCode: string;
  unitPrice: number;
  feedstocks: Array<{ id: number; name: string; quantity: number; stock: number }>;
};

