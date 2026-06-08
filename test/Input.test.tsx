import { render, screen } from '@testing-library/react';
import Input from '@/components/ui/Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when label prop is provided', () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('does not render a label when label prop is absent', () => {
    render(<Input id="email" />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders an error message when error prop is provided', () => {
    render(<Input error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('does not render an error message when error prop is absent', () => {
    render(<Input />);
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it('applies input--error class when error is set', () => {
    render(<Input error="Bad input" />);
    expect(screen.getByRole('textbox').className).toContain('input--error');
  });

  it('does not apply input--error class when there is no error', () => {
    render(<Input />);
    expect(screen.getByRole('textbox').className).not.toContain('input--error');
  });

  it('forwards extra props to the input', () => {
    render(<Input placeholder="Enter email" type="email" />);
    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('type', 'email');
  });
});
