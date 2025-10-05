/**
 * @fileoverview Tests for Spinner component
 * @author Clawz Lab Team
 * @version 1.0.0
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    render(<Spinner size="lg" data-testid="spinner" />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('applies custom className', () => {
    render(<Spinner className="text-red-500" data-testid="spinner" />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('text-red-500');
  });

  it('has proper accessibility attributes', () => {
    render(<Spinner />);

    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});
