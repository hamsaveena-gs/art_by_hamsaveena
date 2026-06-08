import { render, screen } from '@testing-library/react';
import Text from '@/components/ui/Text';

describe('Text', () => {
  it('renders a <p> by default', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello').tagName).toBe('P');
  });

  it('renders the correct element when as prop is given', () => {
    render(<Text as="span">Span text</Text>);
    expect(screen.getByText('Span text').tagName).toBe('SPAN');
  });

  it('applies the correct class for each variant', () => {
    const cases: Array<[Parameters<typeof Text>[0]['variant'], string]> = [
      ['brand',    'text-brand'],
      ['muted',    'text-muted'],
      ['subtle',   'text-subtle'],
      ['footnote', 'text-footnote'],
      ['badge',    'text-badge'],
    ];
    cases.forEach(([variant, cls]) => {
      const { unmount } = render(<Text variant={variant}>x</Text>);
      expect(screen.getByText('x').className).toContain(cls);
      unmount();
    });
  });

  it('applies plain variant with no extra class', () => {
    render(<Text variant="plain">plain</Text>);
    const el = screen.getByText('plain');
    expect(el.className).toBe('');
  });

  it('merges extra className', () => {
    render(<Text className="mt-4">extra</Text>);
    expect(screen.getByText('extra').className).toContain('mt-4');
  });
});
