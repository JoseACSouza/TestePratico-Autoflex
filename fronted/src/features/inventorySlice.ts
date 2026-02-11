import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Product, PaginatedResponse, Feedstock } from '../types';

const api = axios.create({ baseURL: 'http://localhost:3000' });

// Thunks para Produtos
export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async ({ page = 0, size = 10, q = '' }: { page?: number; size?: number; q?: string }) => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: { page, size, q }
    });
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  'inventory/createProduct',
  async (newProduct: Partial<Product>) => {
    const response = await api.post<Product>('/products', newProduct);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'inventory/deleteProduct',
  async (id: number) => {
    await api.delete(`/products/${id}`);
    return id;
  }
);

// Thunk para Matérias-Primas (Exemplo Index)
export const fetchFeedstocks = createAsyncThunk(
  'inventory/fetchFeedstocks',
  async ({ page = 0, size = 10 }: { page?: number; size?: number }) => {
    const response = await api.get<PaginatedResponse<Feedstock>>('/feedstocks', {
      params: { page, size }
    });
    return response.data;
  }
);

interface InventoryState {
  products: Product[];
  feedstocks: Feedstock[];
  totalProducts: number;
  loading: boolean;
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { products: [], feedstocks: [], totalProducts: 0, loading: false } as InventoryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.totalProducts = action.payload.total;
        state.loading = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(fetchFeedstocks.fulfilled, (state, action) => {
        state.feedstocks = action.payload.items;
        state.loading = false;
      })
      .addMatcher(action => action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      });
  }
});

export default inventorySlice.reducer;