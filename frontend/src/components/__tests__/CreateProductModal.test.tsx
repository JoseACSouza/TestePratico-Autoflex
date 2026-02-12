import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateProductModal from '../CreateProductModal';
import { describe, it, expect, vi, beforeEach } from "vitest";


const mockDispatch = vi.fn();
const mockUseSelector = vi.fn();

vi.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (fn: any) => mockUseSelector(fn),
}));

const fetchFeedstocks = vi.fn();
const createProduct = vi.fn();
const fetchProducts = vi.fn();

vi.mock('../../features/inventorySlice', () => ({
  fetchFeedstocks: (...args: any[]) => fetchFeedstocks(...args),
  createProduct: (...args: any[]) => createProduct(...args),
  fetchProducts: (...args: any[]) => fetchProducts(...args),
}));

function setSelectorFeedstocks() {
  mockUseSelector.mockImplementation((selectorFn: any) =>
    selectorFn({
      inventory: {
        feedstocks: [
          { id: 1, name: 'Madeira', feedstockCode: 'F-1', stock: 10, unitOfMeasure: 'KG' },
          { id: 2, name: 'Tecido', feedstockCode: 'F-2', stock: 5, unitOfMeasure: 'M' },
        ],
      },
    })
  );
}

describe('CreateProductModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setSelectorFeedstocks();
  });

  it('does not render when closed', () => {
    const { container } = render(<CreateProductModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('fetches feedstocks when opened', () => {
    mockDispatch.mockReturnValue({});
    fetchFeedstocks.mockReturnValue({ type: 'inventory/fetchFeedstocks' });

    render(<CreateProductModal isOpen={true} onClose={() => {}} />);

    expect(fetchFeedstocks).toHaveBeenCalledWith({ page: 0, size: 100 });
    expect(mockDispatch).toHaveBeenCalledWith(expect.anything());
  });

  it('requires at least one item and submits payload', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    mockDispatch
      .mockReturnValueOnce({}) // fetchFeedstocks (useEffect)
      .mockReturnValueOnce({ unwrap: vi.fn().mockResolvedValue({ id: 99 }) }) // createProduct
      .mockReturnValueOnce({}); // fetchProducts

    fetchFeedstocks.mockReturnValue({ type: 'inventory/fetchFeedstocks' });
    createProduct.mockReturnValue({ type: 'inventory/createProduct' });
    fetchProducts.mockReturnValue({ type: 'inventory/fetchProducts' });

    render(<CreateProductModal isOpen={true} onClose={onClose} />);

    const submitBtn = screen.getByRole('button', { name: /Criar Produto/i });
    expect(submitBtn).toBeDisabled();

    await user.type(screen.getByPlaceholderText(/Poltrona/i), 'Mesa');
    await user.type(screen.getByPlaceholderText('P001'), 'P-9');

    
    const priceLabel = screen.getByText(/Preço Unitário/i);
    const priceWrapper = priceLabel.closest('div')!;
    const priceInput = within(priceWrapper).getByRole('spinbutton');
    await user.clear(priceInput);
    await user.type(priceInput, '150.50');

    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '1'); // Madeira
    const qtyInput = screen.getByPlaceholderText('Qtd');
    await user.clear(qtyInput);
    await user.type(qtyInput, '2');

    const buttons = screen.getAllByRole('button');
    const addBtn = buttons.find(b => b.className.includes('bg-stone-100') && b.getAttribute('type') === 'button') || buttons[buttons.length - 3];
    await user.click(addBtn);

    expect(submitBtn).toBeEnabled();

    await user.click(submitBtn);

    expect(createProduct).toHaveBeenCalledWith({
      name: 'Mesa',
      productCode: 'P-9',
      unitPrice: 150.5,
      feedstocks: [{ feedstockId: 1, quantity: 2 }],
    });

    expect(fetchProducts).toHaveBeenCalledWith({ page: 0, size: 5 });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
