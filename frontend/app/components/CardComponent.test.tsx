import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CardComponent from './CardComponent'

describe('CardComponent', () => {
  it('renders title and description', () => {
    render(
      <CardComponent
        title="Test Title"
        description="Test Description"
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(
      <CardComponent
        label="Test Label"
        title="Test Title"
        description="Test Description"
      />
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('does not render label when not provided', () => {
    render(
      <CardComponent
        title="Test Title"
        description="Test Description"
      />
    )

    expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
  })

  it('renders with all props provided', () => {
    render(
      <CardComponent
        label="Complete Label"
        title="Complete Title"
        description="Complete Description"
      />
    )

    expect(screen.getByText('Complete Label')).toBeInTheDocument()
    expect(screen.getByText('Complete Title')).toBeInTheDocument()
    expect(screen.getByText('Complete Description')).toBeInTheDocument()
  })

  it('renders correctly with empty label', () => {
    render(
      <CardComponent
        label=""
        title="Test Title"
        description="Test Description"
      />
    )

    // Le label vide est techniquement rendu mais sans contenu
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders with long text content', () => {
    const longTitle = "This is a very long title that might wrap to multiple lines"
    const longDescription = "This is a very long description that definitely contains enough text to potentially wrap to multiple lines and test how the component handles longer content"

    render(
      <CardComponent
        title={longTitle}
        description={longDescription}
      />
    )

    expect(screen.getByText(longTitle)).toBeInTheDocument()
    expect(screen.getByText(longDescription)).toBeInTheDocument()
  })
})