import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductImage from '../ProductImage'

vi.mock('next/image', () => ({
    default: ({ src, alt, fill, sizes, className }: any) => (
        <img src={src} alt={alt} data-fill={fill} data-sizes={sizes} className={className} />
    ),
}))

describe('ProductImage', () => {
    it('renders image with required props', () => {
        render(<ProductImage src="/test.jpg" alt="Test image" />)
        const img = screen.getByAltText('Test image')
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute('src', '/test.jpg')
    })

    it('renders with default sizes', () => {
        render(<ProductImage src="/test.jpg" alt="Test image" />)
        const img = screen.getByAltText('Test image')
        expect(img).toHaveAttribute('data-sizes', '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw')
    })

    it('renders with custom sizes', () => {
        render(<ProductImage src="/test.jpg" alt="Test image" sizes="100vw" />)
        const img = screen.getByAltText('Test image')
        expect(img).toHaveAttribute('data-sizes', '100vw')
    })

    it('renders with className', () => {
        render(<ProductImage src="/test.jpg" alt="Test image" className="custom-class" />)
        const img = screen.getByAltText('Test image')
        expect(img).toHaveClass('custom-class')
    })

    it('passes fill prop to Image component', () => {
        render(<ProductImage src="/test.jpg" alt="Test image" />)
        const img = screen.getByAltText('Test image')
        expect(img).toHaveAttribute('data-fill', 'true')
    })
})