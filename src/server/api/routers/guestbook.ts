import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const guestbookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, image: true } } },
    });
  }),

  postMessage: protectedProcedure
    .input(z.object({ message: z.string().min(1).max(280) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.guestbookEntry.create({
        data: { message: input.message, userId: ctx.session.user!.id! },
        include: { user: { select: { name: true, image: true } } },
      });
    }),
});
