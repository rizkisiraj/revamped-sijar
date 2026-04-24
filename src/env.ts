import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_PRISMA_URL: z.string().url().default("postgresql://localhost:5432/portfolio_dev"),
    POSTGRES_URL_NON_POOLING: z.string().url().default("postgresql://localhost:5432/portfolio_dev"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXTAUTH_SECRET: z.string().min(1).default("dev-secret-change-in-production"),
    NEXTAUTH_URL: z.string().url().optional(),
    DISCORD_CLIENT_ID: z.string().default("placeholder"),
    DISCORD_CLIENT_SECRET: z.string().default("placeholder"),
    LASTFM_API_KEY: z.string().default("placeholder"),
    LASTFM_USERNAME: z.string().default("placeholder"),
    WAKATIME_API_KEY: z.string().default("placeholder"),
    LEETCODE_USERNAME: z.string().default("placeholder"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    LASTFM_API_KEY: process.env.LASTFM_API_KEY,
    LASTFM_USERNAME: process.env.LASTFM_USERNAME,
    WAKATIME_API_KEY: process.env.WAKATIME_API_KEY,
    LEETCODE_USERNAME: process.env.LEETCODE_USERNAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation: true,
});
