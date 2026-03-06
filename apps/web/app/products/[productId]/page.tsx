import { notFound } from "next/navigation"

import { Product } from "@/components/products"
import { getProductById } from "@/lib/productsApi"

type ProductPageProps = {
  params: Promise<{
    productId: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params
  const id = Number(productId)

  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  const productResult = await getProductById(id)

  if (productResult.tag === "err") {
    notFound()
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-5xl px-4 py-10">
      <Product product={productResult.value} />
    </main>
  )
}
