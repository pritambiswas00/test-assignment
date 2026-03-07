import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductPrice from '../ProductPrice'

describe('ProductPrice', () => {
    it('renders price with default currency (USD) and locale (en-US)', () => {
        render(<ProductPrice amount={100} />)
        expect(screen.getByText('$100.00')).toBeInTheDocument()
    })

    it('renders price with custom currency', () => {
        render(<ProductPrice amount={100} currency="EUR" locale="en-US" />)
        expect(screen.getByText(/€100\.00|EUR\s*100\.00/)).toBeInTheDocument()
    })

    it('renders price with custom locale', () => {
        render(<ProductPrice amount={100} locale="de-DE" currency="EUR" />)
        expect(screen.getByText(/100,00/)).toBeInTheDocument()
    })

    it('applies custom className', () => {
        render(<ProductPrice amount={100} className="text-lg font-bold" />)
        const element = screen.getByText('$100.00')
        expect(element).toHaveClass('text-lg', 'font-bold')
    })

    it('formats decimal amounts correctly', () => {
        render(<ProductPrice amount={99.99} />)
        expect(screen.getByText('$99.99')).toBeInTheDocument()
    })

    it('rounds to 2 decimal places', () => {
        render(<ProductPrice amount={99.999} />)
        expect(screen.getByText('$100.00')).toBeInTheDocument()
    })

    it('handles zero amount', () => {
        render(<ProductPrice amount={0} />)
        expect(screen.getByText('$0.00')).toBeInTheDocument()
    })
})