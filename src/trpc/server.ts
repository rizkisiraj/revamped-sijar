import "server-only";
import { createCallerFactory } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { headers } from "next/headers";
import { createTRPCContext } from "~/server/api/trpc";
import { NextRequest } from "next/server";

const createCaller = createCallerFactory(appRouter);

export const api = createCaller(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({
    req: new NextRequest("http://internal", { headers: heads }),
  });
});
