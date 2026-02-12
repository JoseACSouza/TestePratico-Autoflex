import reducer, { fetchProducts, fetchFeedstocks, createFeedstock } from '../inventorySlice';
import { describe, it, expect } from "vitest";

describe('inventorySlice reducer', () => {
  it('sets loading=true on any pending', () => {
    const state = reducer(undefined, { type: 'inventory/fetchProducts/pending' });
    expect(state.loading).toBe(true);
  });

  it('sets loading=false on any rejected', () => {
    const state = reducer({ products: [], feedstocks: [], totalProducts: 0, totalFeedstocks: 0, loading: true }, { type: 'inventory/fetchProducts/rejected' });
    expect(state.loading).toBe(false);
  });

  it('handles fetchProducts.fulfilled', () => {
    const prev = { products: [], feedstocks: [], totalProducts: 0, totalFeedstocks: 0, loading: true };
    const action = {
      type: fetchProducts.fulfilled.type,
      payload: { items: [{ id: 1, name: 'A', productCode: 'P', unitPrice: 1, feedstocks: [] }], total: 1, page: 0, size: 10 }
    };
    const next = reducer(prev as any, action as any);
    expect(next.products).toHaveLength(1);
    expect(next.totalProducts).toBe(1);
    expect(next.loading).toBe(false);
  });

  it('handles fetchFeedstocks.fulfilled', () => {
    const prev = { products: [], feedstocks: [], totalProducts: 0, totalFeedstocks: 0, loading: true };
    const action = {
      type: fetchFeedstocks.fulfilled.type,
      payload: { items: [{ id: 10, name: 'Madeira', feedstockCode: 'F', stock: 10, unitOfMeasure: 'KG' }], total: 1, page: 0, size: 10 }
    };
    const next = reducer(prev as any, action as any);
    expect(next.feedstocks).toHaveLength(1);
    expect(next.totalFeedstocks).toBe(1);
    expect(next.loading).toBe(false);
  });

  it('handles createFeedstock.fulfilled (unshift)', () => {
    const prev = { products: [], feedstocks: [{ id: 2, name: 'Old', feedstockCode: 'F2', stock: 1, unitOfMeasure: 'KG' }], totalProducts: 0, totalFeedstocks: 0, loading: false };
    const action = {
      type: createFeedstock.fulfilled.type,
      payload: { id: 1, name: 'New', feedstockCode: 'F1', stock: 1, unitOfMeasure: 'KG' }
    };
    const next = reducer(prev as any, action as any);
    expect(next.feedstocks[0].id).toBe(1);
  });
});
