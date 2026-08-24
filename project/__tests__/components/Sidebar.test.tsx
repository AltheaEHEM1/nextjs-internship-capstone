import { render, screen } from '@testing-library/react';
import Sidebar from '@/components/sidebar/Sidebar';
import { useCustomSidebarStore } from '@/stores/components/CustomSidebarStore';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/stores/components/CustomSidebarStore', () => ({
  useCustomSidebarStore: jest.fn(),
}));

describe('Sidebar Component', () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    (useCustomSidebarStore as unknown as jest.Mock).mockReturnValue({
      collapsed: false,
      setCollapsed: jest.fn(),
      isHovered: false,
      setIsHovered: jest.fn(),
      openDropdown: null,
      setOpenDropdown: jest.fn(),
      isMobile: false,
      setIsMobile: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sidebar with the project logo', () => {
    render(<Sidebar opened={true} close={mockClose} />);
    expect(screen.getByText('Projectnify')).toBeInTheDocument();
  });

  it('renders copyright notice', () => {
    render(<Sidebar opened={true} close={mockClose} />);
    expect(screen.getByText('© Projectnify')).toBeInTheDocument();
  });
});
