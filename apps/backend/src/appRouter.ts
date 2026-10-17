import z from "zod";
import { publicProcedure, router } from "./trpc";
import { db } from "../drizzle";
import { TRPCError } from "@trpc/server";
import { templateRouter } from "./routers/template";
import { exportRouter } from "./routers/export";

export const appRouter = router({
	template: templateRouter,
	export: exportRouter,
});

export type AppRouter = typeof appRouter;
