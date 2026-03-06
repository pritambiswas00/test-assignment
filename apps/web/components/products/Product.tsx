import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { AddToCartButton } from "@/components/cart"

import type { Product as ProductType } from "./types"
import { ProductDate, ProductImage, ProductPrice } from "./common"

type ProductProps = {
	product: ProductType
}

export default function Product({ product }: ProductProps) {
	return (
		<Card className="overflow-hidden md:grid md:grid-cols-2 md:gap-8 md:py-0">
			<div className="relative aspect-square w-full overflow-hidden bg-muted">
				<ProductImage
					src={product.thumbnail}
					alt={product.title}
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover"
				/>
			</div>

			<div className="flex flex-col">
				<CardHeader>
					<CardTitle className="text-3xl">{product.title}</CardTitle>
					<CardDescription>{product.description}</CardDescription>
				</CardHeader>

				<CardContent className="space-y-2">
					<ProductPrice amount={product.price} className="text-2xl font-semibold" />
					<p className="text-sm text-muted-foreground">Category: {product.category}</p>
					<div className="text-sm text-muted-foreground">
						Updated: <ProductDate value={product.meta.updatedAt} className="inline" />
					</div>
				</CardContent>

				<CardFooter>
					<AddToCartButton
						product={{
							id: product.id,
							title: product.title,
							price: product.price,
							thumbnail: product.thumbnail,
						}}
					/>
				</CardFooter>
			</div>
		</Card>
	)
}

