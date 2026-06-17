import { initTRPC } from "@trpc/server";

// TRPC initialization
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
