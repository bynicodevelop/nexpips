import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock minimal de react-hook-form pour permettre le rendu sans erreurs de hooks
vi.mock('react-hook-form', () => {
  return {
    useForm: () => ({
      register: () => ({ name: 'email', onChange: () => {}, onBlur: () => {}, ref: () => {} }),
      handleSubmit: (cb: any) => (e?: any) => { e?.preventDefault?.(); cb({ email: '' }) },
      formState: { errors: {}, isSubmitting: false },
      reset: () => {},
    }),
  }
})

import FormComponent from './FormComponent'

describe('FormComponent', () => {
  it('renders form with default props', () => {
    const mockHandleSubmit = vi.fn()

    render(<FormComponent handleSubmit={mockHandleSubmit} />)

    // label accessible (sr-only)
    expect(screen.getByLabelText('Votre email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Votre email')).toBeInTheDocument()
    // Accepte l’apostrophe ASCII (') OU typographique (’)
    const buttonRegex = /→\s*Rejoindre\s+la\s+liste\s+d[’']attente/i
    expect(screen.getByRole('button', { name: buttonRegex })).toBeInTheDocument()
  })

  it('renders form with custom props', () => {
    const mockHandleSubmit = vi.fn()

    render(
      <FormComponent
        handleSubmit={mockHandleSubmit}
        id="custom-email"
        placeholder="Enter your email"
        label="Email Address"
        buttonText="Subscribe"
      />
    )

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('renders accessibility attributes correctly', () => {
    const mockHandleSubmit = vi.fn()

    render(<FormComponent handleSubmit={mockHandleSubmit} />)

    const emailInput = screen.getByLabelText('Votre email')

    expect(emailInput).toHaveAttribute('aria-required', 'true')
    expect(emailInput).toHaveAttribute('autocomplete', 'email')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('aria-invalid', 'false')
  })

  it('calls mockHandleSubmit when the form is submitted', () => {
    const mockHandleSubmit = vi.fn()

    render(<FormComponent handleSubmit={mockHandleSubmit} />)

    const buttonRegex = /→\s*Rejoindre\s+la\s+liste\s+d[’']attente/i
    const submitButton = screen.getByRole('button', { name: buttonRegex })

    fireEvent.click(submitButton)

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
    expect(mockHandleSubmit).toHaveBeenCalledWith({ email: '' })
  })
})