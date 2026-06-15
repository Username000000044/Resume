import z from "zod";
import { publicProcedure, router } from "./trpc";
import { db } from "../drizzle";

export const appRouter = router({
  templatesList: publicProcedure.query(async () => {
    const templates = await db.query.templatesTable.findMany();
    return templates;
  }),
  templatesById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts; //id input

    const template = await db.query.templatesTable.findFirst({
      where: (templates, { eq }) => eq(templates.id, input),
    });
    return template;
  }),

  // userCreate: publicProcedure
  //   .input(z.object({ name: z.string() }))
  //   .mutation(async (opts) => {
  //     const { input } = opts;

  //     // Create the user in your DB
  //     const user: User = { id: "1", ...input };
  //     return user;
  //   }),
});

export type AppRouter = typeof appRouter;
