import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { Product } from "@/components/products"
import { ErrorToast } from "@/components/error-toast"
import { getProductById } from "@/lib/productsApi"

type ProductPageProps = {
  params: Promise<{
    productId: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId: rawId } = await params
  const id = Number(rawId)

  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  const productResult = await getProductById(id)

  if (productResult.tag === "err") {
    if (productResult.error.status === 404) {
      notFound()
    }

    return (
      <main className="mx-auto min-h-svh w-full max-w-5xl px-4 py-10">
        <ErrorToast message={productResult.error.message} />
        <Card>
          <CardHeader>
            <CardTitle>Unable to load product</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{productResult.error.message}</CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-5xl px-4 py-10">
      <Product product={productResult.value} />
    </main>
  )
}
