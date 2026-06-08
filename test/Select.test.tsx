import { render, screen } from '@testing-library/react';
import Select from '@/components/ui/Select';

const options = [
  { value: 'oil', label: 'Oil Painting' },
  { value: 'digital', label: 'Digital Art' },
];

describe('Select', () => {
  it('renders all options', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'Oil Painting' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Digital Art' })).toBeInTheDocument();
  });

  it('renders a label when label prop is provided', () => {
    render(<Select label="Medium" id="medium" options={options} />);
    expect(screen.getByLabelText('Medium')).toBeInTheDocument();
  });

  it('does not render a label when label prop is absent', () => {
    render(<Select options={options} />);
    expect(screen.queryByText('Medium')).not.toBeInTheDocument();
  });

  it('renders a placeholder option when placeholder is provided', () => {
    render(<Select options={options} placeholder="Select one" />);
    expect(screen.getByRole('option', { name: 'Select one' })).toHaveValue('');
  });

  it('does not render a placeholder when not provided', () => {
    render(<Select options={options} />);
    expect(screen.queryByRole('option', { name: 'Select one' })).not.toBeInTheDocument();
  });

  it('renders an error message when error prop is provided', () => {
    render(<Select options={options} error="Please select a value" />);
    expect(screen.getByText('Please select a value')).toBeInTheDocument();
  });

  it('applies input--error class when error is set', () => {
    render(<Select options={options} error="Error" />);
    expect(screen.getByRole('combobox').className).toContain('input--error');
  });

  it('does not apply input--error class when there is no error', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox').className).not.toContain('input--error');
  });
});
