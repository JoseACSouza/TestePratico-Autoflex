import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';
import type { Product } from '../../types';
import { describe, it, expect, vi } from "vitest";


function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Cadeira',
    productCode: 'P-001',
    unitPrice: 199.9,
    feedstocks: [
      { id: 10, name: 'Madeira', feedstockCode: 'F-10', stock: 10, quantity: 2 },
      { id: 11, name: 'Tecido', feedstockCode: 'F-11', stock: 3, quantity: 1 },
    ],
    ...overrides
  };
}

describe('ProductCard', () => {
  it('renders product info and production capacity', () => {
    const product = makeProduct();
    render(<ProductCard product={product} onDelete={() => {}} onEdit={() => {}} />);

    expect(screen.getByText('P-001')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cadeira' })).toBeInTheDocument();

    expect(screen.getByText(/Capacidade de produção:/i)).toBeInTheDocument();
    expect(screen.getByText(/3 unidades/i)).toBeInTheDocument();
    expect(screen.getByText(/Madeira:/i)).toBeInTheDocument();
    expect(screen.getByText(/Tecido:/i)).toBeInTheDocument();
  });

  it('calls onEdit and onDelete', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const product = makeProduct({ id: 42 });

    render(<ProductCard product={product} onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /Editar/i }));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }));

    await user.click(screen.getByRole('button', { name: /Excluir/i }));
    expect(onDelete).toHaveBeenCalledWith(42);
  });

  it('shows zero capacity when no feedstocks', () => {
    const product = makeProduct({ feedstocks: [] });
    render(<ProductCard product={product} onDelete={() => {}} onEdit={() => {}} />);
    expect(screen.getByText(/0 unidades/i)).toBeInTheDocument();
  });
});
