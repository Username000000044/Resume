import puppeteer from "@cloudflare/puppeteer";
import { Hono } from "hono";
import { Env } from "../middleware/session";
import z from "zod";
import { PageSize, pageSizeMap } from "@resume/renderer/constants";
import { zValidator } from "@hono/zod-validator";

const exportSchema = z.object({
    config: z.any(),
    defaultConfig: z.any(),
    dbSections: z.any(),
    sections: z.any(),
    pagesMatrix: z.any(),
    pageSize: z.enum(Object.keys(pageSizeMap) as [PageSize, ...PageSize[]]).default("letter"),
});

export const exportRouter = new Hono<Env>();

exportRouter.post("/pdf", zValidator("json", exportSchema), async (c) => {
    const sessionId = c.get("sessionId");
    if (!sessionId) return c.json({ error: "Unauthorized: No Session" }, 401);

    const payload = c.req.valid("json");
    const frontendOrgin = new URL(c.env.FRONTEND_URL).origin;

    // Domains Puppeteer is allowed t ofetch assets/fonts from
    const ALLOWED_ORGINS = new Set([
        frontendOrgin,
    ]);

    // Launch Cloudflare Browser
    const browser = await puppeteer.launch(c.env.BROWSER);

    try {
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const url = req.url();

            // Always allow data: and blob: (inline SVGs or base64 profile photos)
            if (url.startsWith("data:") || url.startsWith("blob:")) {
                return req.continue();
            }

            try {
                const reqOrigin = new URL(url).origin;
                if (ALLOWED_ORGINS.has(reqOrigin)) {
                    req.continue();
                }
            } catch {
                // Invalid URL --> abort
            }

            // Abort analytics, chat widgets, or any unauthorized domain immediately
            return req.abort();
        });

        // Inject resume JSON before page scripts run
        await page.evaluateOnNewDocument((data) => {
            (globalThis as Record<string, unknown>).__RESUME_PAYLOAD__ = data;
        }, payload);

        // Navigate & wait for fonts + JS bundle
        await page.goto(`${c.env.FRONTEND_URL}/create/raw`, {
            waitUntil: "networkidle0",
            timeout: 15000,
        });

        // Ensure custom web fonts are fully painted before snapshotting
        await page.evaluate(() => document.fonts.ready);

        const pdf = await page.pdf({
            format: payload.pageSize || "letter",
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });

        return new Response(new Uint8Array(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="resume.pdf"'
            }
        });
    } finally {
        // Always close the browser
        await browser.close();
    }
});