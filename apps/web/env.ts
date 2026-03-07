import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    EXTERNAL_SERVER_API: z.string().url().default('http://example.com')
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1).default("web"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    EXTERNAL_SERVER_API: process.env.EXTERNAL_SERVER_API
  },
})
