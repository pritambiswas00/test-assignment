import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Product } from "@/components/products"
import { getProductById } from "@/lib/productsApi"
import { Result } from "@workspace/utils"
import { ErrorToast } from "@workspace/ui/components/error-toast"

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
  return Result.match(productResult, {
    err: (error) => {
      if (error.status === 404) {
        notFound()
      }
      return (
        <main className="mx-auto min-h-svh w-full max-w-5xl px-4 py-10">
          <ErrorToast message={error.message} />
          <Card>
            <CardHeader>
              <CardTitle>Unable to load product</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{error.message}</CardContent>
          </Card>
        </main>
      )

    },
    ok: (product) => (
      <main className="mx-auto min-h-svh w-full max-w-5xl px-4 py-10">
        <Product product={product} />
      </main>
    )
  })
}
