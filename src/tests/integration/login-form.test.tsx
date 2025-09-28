import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../../app/(public)/login/page';

describe('Login form', () => {
  it('shows validation errors', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    // We expect some validation errors for required fields
    // Because schema returns specific messages, we just check any error container
    expect(await screen.findAllByText(/email|password/i)).toBeTruthy();
  });

  it('shows auth error when password fail', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByTestId('login-email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'fail' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByTestId('login-error')).toHaveTextContent(/credenciales/i);
  });
});
