import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductDate from '../ProductDate'

describe('ProductDate', () => {
    it('renders formatted date with default locale', () => {
        render(<ProductDate value="2024-01-15" />)
        expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument()
    })

    it('renders formatted date with custom locale', () => {
        render(<ProductDate value="2024-01-15" locale="de-DE" />)
        expect(screen.getByText(/15\.01\.2024/)).toBeInTheDocument()
    })

    it('applies custom className to paragraph', () => {
        render(<ProductDate value="2024-01-15" className="custom-class" />)
        expect(screen.getByText(/Jan 15, 2024/)).toHaveClass('custom-class')
    })

    it('returns null for invalid date', () => {
        const { container } = render(<ProductDate value="invalid-date" />)
        expect(container.firstChild).toBeNull()
    })

    it('handles ISO date format', () => {
        render(<ProductDate value="2024-12-25T10:30:00Z" />)
        expect(screen.getByText(/Dec 25, 2024/)).toBeInTheDocument()
    })

    it('renders paragraph element', () => {
        render(<ProductDate value="2024-06-10" />)
        expect(screen.getByText(/Jun 10, 2024/).tagName).toBe('P')
    })
})