import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Product, Feedstock, PaginatedResponse, CreateProductDTO, CreateFeedstockDTO } from '../types';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async ({ page, size, q, searchType }: { page: number; size: number; q?: string; searchType?: string }) => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: { page, size, q, searchType }
    });
    return response.data;
  }
);

export const createProduct = createAsyncThunk<Product, CreateProductDTO>(
  'inventory/createProduct',
  async (newProduct) => {
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

export const fetchFeedstocks = createAsyncThunk(
  'inventory/fetchFeedstocks',
  async ({ page, size, q }: { page: number; size: number; q?: string }) => {
    const response = await api.get<PaginatedResponse<Feedstock>>('/feedstocks', {
      params: { page, size, q }
    });
    return response.data;
  }
);

export const createFeedstock = createAsyncThunk<Feedstock, CreateFeedstockDTO>(
  'inventory/createFeedstock',
  async (newFeedstock) => {
    const response = await api.post<Feedstock>('/feedstocks', newFeedstock);
    return response.data;
  }
);

export const deleteFeedstock = createAsyncThunk(
  'inventory/deleteFeedstock',
  async (id: number) => {
    await api.delete(`/feedstocks/${id}`);
    return id;
  }
);

interface InventoryState {
  products: Product[];
  feedstocks: Feedstock[];
  totalProducts: number;
  totalFeedstocks: number;
  loading: boolean;
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { 
    products: [], 
    feedstocks: [], 
    totalProducts: 0, 
    totalFeedstocks: 0, 
    loading: false 
  } as InventoryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.totalProducts = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchFeedstocks.fulfilled, (state, action) => {
        state.feedstocks = action.payload.items;
        state.totalFeedstocks = action.payload.total;
        state.loading = false;
      })
      .addCase(createFeedstock.fulfilled, (state, action) => {
        state.feedstocks.unshift(action.payload);
      })
      .addMatcher(action => action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher(action => action.type.endsWith('/rejected'), (state) => {
        state.loading = false;
      });
  }
});

export default inventorySlice.reducer;