import z from "zod";
import { publicProcedure, router } from "./trpc";
import { db } from "../drizzle";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const appRouter = router({
	templatesList: publicProcedure.query(async () => {
		const templates = await db.query.templatesTable.findMany({
			with: {
				sections: {
					orderBy: (sections, { asc }) => [asc(sections.order)],
					with: {
						fields: {
							orderBy: (fields, { asc }) => [asc(fields.order)],
						},
					},
				},
			},
		});
		return templates;
	}),
	templatesById: publicProcedure.input(z.string()).query(async (opts) => {
		const { input } = opts; //id input

		const template = await db.query.templatesTable.findFirst({
			with: {
				sections: {
					orderBy: (sections, { asc }) => [asc(sections.order)],
					with: {
						fields: {
							orderBy: (fields, { asc }) => [asc(fields.order)],
						},
					},
				},
			},
			where: {
				RAW: (template, { eq }) => eq(template.id, input),
			},
		});

		if (!template) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Template Not Found: ${input}`,
			});
		}

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
