import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import type { ProductList as ProductListType } from "./types"
import { ProductImage, ProductPrice } from "./common"

type ProductListProps = {
	products: ProductListType
}

export default function ProductList({ products }: ProductListProps) {
	if (products.length === 0) {
		return (
			<Card>
				<CardContent className="py-8 text-center text-sm text-muted-foreground">No products found.</CardContent>
			</Card>
		)
	}

	return (
		<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<Link key={product.id} href={`/products/${product.id}`} className="group">
					<Card className="h-full overflow-hidden transition-colors group-hover:ring-foreground/20 p-2">
						<div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
							<ProductImage
								src={product.thumbnail}
								alt={product.title}
								className="object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						</div>
						<CardHeader>
							<CardTitle className="line-clamp-1">{product.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<ProductPrice amount={product.price} className="text-sm text-muted-foreground" />
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	)
}

