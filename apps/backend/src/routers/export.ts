import z, { ZodType } from "zod";
import { publicProcedure, router } from "../trpc";
import { SectionConfig, TemplateConfig } from "../db/schema";

const subBulletSchema = z.object({ id: z.string(), text: z.string() });

const mainBulletSchema = z.object({
    id: z.string(),
    text: z.string(),
    subBullets: z.array(subBulletSchema),
});

const subSectionDataSchema = z.object({
    id: z.string(),
    fields: z.record(z.string(), z.string()),
    bullets: z.array(mainBulletSchema),
    order: z.number(),
});

const sectionDataSchema = z.object({
    id: z.string(),
    subSections: z.array(subSectionDataSchema),
    order: z.number(),
});

const configSchema = z.object({
    templateName: z.string(),
    templateConfig: z.record(z.string(), z.any()) as unknown as ZodType<TemplateConfig>,
    sectionConfigs: z.record(z.string(), z.any()) as unknown as ZodType<Record<string, SectionConfig>>,
});

const formatValues = ["jpg", "png", "pdf-s", "pdf-p", "docx"] as const;

export const exportRouter = router({
    downloadResume: publicProcedure
        .input(z.object({
            sections: z.record(z.string(), sectionDataSchema),
            config: configSchema,
            format: z.enum(formatValues),
        }))
        .mutation(async ({ input }) => {
            // Future audit and user checks
            return { ...input };
        }),
});