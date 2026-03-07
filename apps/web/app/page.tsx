import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ProductList } from "@/components/products"
import { getProducts } from "@/lib/productsApi"
import { Result } from "@workspace/utils"
import { ErrorToast } from "@workspace/ui/components/error-toast"

export default async function Page() {
    const productsResult = await getProducts()
    return Result.match(productsResult, {
        err: (error) => {
            <main className="mx-auto min-h-svh w-full max-w-6xl px-4 py-10">
                <ErrorToast message={error.message} />
                <Card>
                    <CardHeader>
                        <CardTitle>Unable to load products</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{error.message}</CardContent>
                </Card>
            </main>
        },
        ok: (data) => (
            <main className="mx-auto min-h-svh w-full max-w-6xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Browse products and open details.</p>
                </div>
                <ProductList products={data.products} />
            </main>
        )
    })
}
