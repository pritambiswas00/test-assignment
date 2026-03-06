"use client"

import { useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/sonner"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    toast.error(error.message || "Something went wrong")
  }, [error])

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{error.message}</CardContent>
        <CardFooter>
          <Button onClick={reset}>Try again</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
