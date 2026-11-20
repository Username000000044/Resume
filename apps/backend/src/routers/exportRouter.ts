import { Hono } from "hono";
import { Env } from "../middleware/session";
import z from "zod";
import { PageSize, pageSizeMap } from "@resume/renderer/constants";
import { zValidator } from "@hono/zod-validator";
import { createDownloadResponse, withRenderedPage } from "../helpers/export";
import { requireSession } from "../middleware/requireSession";

export const exportRouter = new Hono<Env>();
exportRouter.use("/api/export/*", requireSession);

export type ExportExtentions = "pdf" | "png" | "jpeg" | "json";
export const exportSchema = z.object({
    templateId: z.string(),
    templateName: z.string(),

    pagination: z.boolean(),
    pageSize: z.enum(Object.keys(pageSizeMap) as [PageSize, ...PageSize[]]).default("letter"),
    pagesMatrix: z.any(),

    config: z.any(),
    defaultConfig: z.any(),
    dbSections: z.any(),
    sections: z.any(),
    preferences: z.any(),
});

exportRouter.post("/pdf", zValidator("json", exportSchema), async (c) => {
    const payload = c.req.valid("json");

    const pdf = await withRenderedPage({
        browserBinding: c.env.BROWSER,
        frontendURL: c.env.FRONTEND_URL,
        payload,
    },
        async (page) => {
            if (payload.pagination) {
                return await page.pdf({
                    format: payload.pageSize || "letter",
                    printBackground: true,
                    margin: { top: 0, right: 0, bottom: 0, left: 0 },
                });
            }

            return await page.pdf({
                pageRanges: "1",
                width: `${pageSizeMap[payload.pageSize].w}in`,
                height: `${Math.ceil(Number(payload.pagesMatrix.totalHeight))}px`,
                printBackground: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            });
        }
    );

    return createDownloadResponse(
        new Uint8Array(pdf),
        payload.templateName,
        "pdf",
        "application/pdf"
    );
});

exportRouter.post("/png", zValidator("json", exportSchema), async (c) => {
    const payload = c.req.valid("json");

    const png = await withRenderedPage({
        browserBinding: c.env.BROWSER,
        frontendURL: c.env.FRONTEND_URL,
        payload,
    },
        async (page) => {
            await page.setViewport({
                width: Math.round(pageSizeMap[payload.pageSize].w * 96),
                height: Math.ceil(Number(payload.pagesMatrix.totalHeight)),
                deviceScaleFactor: 2,
            });
            return page.screenshot({ type: "png", fullPage: true })
        }
    );

    return createDownloadResponse(
        new Uint8Array(png),
        payload.templateName,
        "png",
        "image/png"
    );
});

exportRouter.post("/jpeg", zValidator("json", exportSchema), async (c) => {
    const payload = c.req.valid("json");

    const jpeg = await withRenderedPage({
        browserBinding: c.env.BROWSER,
        frontendURL: c.env.FRONTEND_URL,
        payload,
    },
        async (page) => {
            await page.setViewport({
                width: Math.round(pageSizeMap[payload.pageSize].w * 96),
                height: Math.ceil(Number(payload.pagesMatrix.totalHeight)),
                deviceScaleFactor: 2,
            });
            return page.screenshot({ type: "jpeg", quality: 90, fullPage: true })
        }
    );

    return createDownloadResponse(
        new Uint8Array(jpeg),
        payload.templateName,
        "jpeg",
        "image/jpeg"
    );
});

exportRouter.post("/json", zValidator("json", exportSchema), async (c) => {
    const payload = c.req.valid("json");

    const data = {
        templateId: payload.templateId,
        sections: payload.sections,
        config: payload.config,
        preferences: payload.preferences,
    }

    const jsonString = JSON.stringify(data);
    const body = new TextEncoder().encode(jsonString);


    return createDownloadResponse(
        body,
        payload.templateName,
        "json",
        "application/json"
    );
});

