import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, expect, test, describe, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MaterialsPage from '../MaterialsPage';
import { materialsService } from '../../services/materialsService';

vi.mock('../../services/materialsService', () => ({
  materialsService: {
    getMaterials: vi.fn(),
  },
}));

vi.mock('../../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

const mockMaterials = [
  {
    id: '1',
    title: 'Cursor',
    description: 'AI Editor',
    url: 'https://cursor.sh',
    category: 'Narzędzie',
    price: 'Freemium',
    tags: ['AI', 'IDE'],
    icon_url: '💻',
    is_published: true,
  },
  {
    id: '2',
    title: 'LangChain',
    description: 'Framework for LLMs',
    url: 'https://langchain.com',
    category: 'Repozytorium',
    price: 'Free',
    tags: ['Python', 'AI'],
    icon_url: '🦜',
    is_published: true,
  },
];

describe('MaterialsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    materialsService.getMaterials.mockReturnValue(new Promise(() => {}));
    const { container } = render(
      <BrowserRouter>
        <MaterialsPage />
      </BrowserRouter>
    );
    // Check for skeleton loader pulses
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  });

  test('renders materials after loading', async () => {
    materialsService.getMaterials.mockResolvedValue(mockMaterials);
    render(
      <BrowserRouter>
        <MaterialsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Cursor')).toBeInTheDocument();
      expect(screen.getByText('LangChain')).toBeInTheDocument();
    });
  });

  test('filters materials by search text', async () => {
    materialsService.getMaterials.mockResolvedValue(mockMaterials);
    render(
      <BrowserRouter>
        <MaterialsPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Cursor')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/szukaj materiałów/i);
    fireEvent.change(searchInput, { target: { value: 'Cursor' } });

    await waitFor(() => {
      expect(screen.getByText('Cursor')).toBeInTheDocument();
      expect(screen.queryByText('LangChain')).not.toBeInTheDocument();
    });
  });

  test('filters materials by category', async () => {
    materialsService.getMaterials.mockResolvedValue(mockMaterials);
    render(
      <BrowserRouter>
        <MaterialsPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Cursor')).toBeInTheDocument());

    const toolCheckbox = screen.getByLabelText('Narzędzie');
    fireEvent.click(toolCheckbox);

    await waitFor(() => {
      expect(screen.getByText('Cursor')).toBeInTheDocument();
      expect(screen.queryByText('LangChain')).not.toBeInTheDocument();
    });
  });
});
