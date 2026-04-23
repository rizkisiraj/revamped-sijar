import { createTRPCRouter } from "~/server/api/trpc";
import { guestbookRouter } from "~/server/api/routers/guestbook";

export const appRouter = createTRPCRouter({
  guestbook: guestbookRouter,
});

export type AppRouter = typeof appRouter;
