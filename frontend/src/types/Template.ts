import type { AppRouter } from "@resume/backend/src/appRouter.ts";
import type { inferRouterOutputs } from "@trpc/server";

export type TemplateListType = inferRouterOutputs<AppRouter>["templatesList"];
export type TemplateType = inferRouterOutputs<AppRouter>["templateById"];

export type SectionType = TemplateType["sections"][number];
export type FieldType = TemplateType["sections"][number]["fields"][number];
export type GroupType = TemplateType["sections"][number]["groups"][number];
