import { TRPCError } from "@trpc/server";
import { db } from "../../drizzle";
import { publicProcedure, router } from "../trpc";
import z from "zod";

export const templateRouter = router({
    templatesList: publicProcedure.query(async () => {
        const templates = await db.query.templatesTable.findMany({
            with: {
                sections: {
                    orderBy: (sections, { asc }) => [asc(sections.order)],
                    with: {
                        fields: {
                            with: {
                                alignment: true,
                                group: {
                                    with: {
                                        fields: true,
                                    },
                                },
                            },
                        },
                        groups: true,
                    },
                },
            },
        });
        return templates;
    }),
    templateById: publicProcedure.input(z.string()).query(async (opts) => {
        const { input } = opts; //id input

        const uuidValidation = z.uuid().safeParse(input);

        if (!uuidValidation.success) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Invalid template ID format: ${input}`,
            });
        }

        const template = await db.query.templatesTable.findFirst({
            with: {
                sections: {
                    orderBy: (sections, { asc }) => [asc(sections.order)],
                    with: {
                        fields: {
                            with: {
                                alignment: true,
                                group: {
                                    with: {
                                        fields: true,
                                    },
                                },
                            },
                        },
                        groups: true,
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
});