import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateFeedstockModal from '../CreateFeedstockModal';
import { describe, it, expect, vi, beforeEach } from "vitest";


const mockDispatch = vi.fn();

vi.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch
}));

const createFeedstock = vi.fn();
const fetchFeedstocks = vi.fn();

vi.mock('../../features/inventorySlice', () => ({
  createFeedstock: (...args: any[]) => createFeedstock(...args),
  fetchFeedstocks: (...args: any[]) => fetchFeedstocks(...args),
}));

describe('CreateFeedstockModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when closed', () => {
    const { container } = render(<CreateFeedstockModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('submits payload, reloads list and closes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    mockDispatch
      .mockReturnValueOnce({ unwrap: vi.fn().mockResolvedValue({}) })
      .mockReturnValueOnce({});

    createFeedstock.mockReturnValue({ type: 'inventory/createFeedstock' });
    fetchFeedstocks.mockReturnValue({ type: 'inventory/fetchFeedstocks' });

    render(<CreateFeedstockModal isOpen={true} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText(/Carvalho/i), 'Carvalho');
    await user.type(screen.getByPlaceholderText('F-001'), 'F-123');
    await user.clear(screen.getByPlaceholderText('0.0000'));
    await user.type(screen.getByPlaceholderText('0.0000'), '12.5');

    await user.click(screen.getByRole('button', { name: /Salvar Material/i }));

    expect(createFeedstock).toHaveBeenCalledWith({
      name: 'Carvalho',
      feedstockCode: 'F-123',
      stock: 12.5,
      unitOfMeasure: 'KG'
    });

    expect(fetchFeedstocks).toHaveBeenCalledWith({ page: 0, size: 10 });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
