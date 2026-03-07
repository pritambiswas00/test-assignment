"use client"

import { useEffect } from "react"
import { toast } from "@workspace/ui/components/sonner"

type ErrorToastProps = {
  message: string
}

export function ErrorToast({ message }: ErrorToastProps) {
  useEffect(() => {
    toast.error(message)
  }, [message])

  return null
}
