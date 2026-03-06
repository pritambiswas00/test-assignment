import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ProductList } from "@/components/products"
import { getProducts } from "@/lib/productsApi"

export default async function Page() {
  const productsResult = await getProducts()
  
  if (productsResult.tag === "err") {
    return (
      <main className="mx-auto min-h-svh w-full max-w-6xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Unable to load products</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{productsResult.error.message}</CardContent>
        </Card>
      </main>
    )
  }

  const data = productsResult.value

  return (
    <main className="mx-auto min-h-svh w-full max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse products and open details.</p>
      </div>
      <ProductList products={data.products} />
    </main>
  )
}
