import z from "zod";
import { ExportExtentions, exportSchema } from "../routers/exportRouter";
import puppeteer, { type Page } from "@cloudflare/puppeteer";

type ExportPayload = z.infer<typeof exportSchema>;

interface RenderOptions {
    browserBinding: Fetcher;
    frontendURL: string;
    payload: ExportPayload
};

export async function withRenderedPage<T>(
    { browserBinding, frontendURL, payload }: RenderOptions,
    renderFn: (page: Page) => Promise<T>) {

    const frontendOrgin = new URL(frontendURL).origin;
    const allowedOrgins = new Set([
        frontendOrgin,
    ]);

    const browser = await puppeteer.launch(browserBinding);

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
                if (allowedOrgins.has(reqOrigin)) {
                    return req.continue();
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
        const rawResumeURL = new URL("/create/raw", frontendURL).toString();
        await page.goto(rawResumeURL, {
            waitUntil: "networkidle2",
            timeout: 30000,
        });

        // Ensure custom web fonts are fully painted before snapshotting
        await page.evaluate(() => document.fonts.ready);

        return await renderFn(page);
    } finally {
        await browser.close();
    }
}

export function createDownloadResponse(
    buffer: Uint8Array,
    templateName: string,
    extention: ExportExtentions,
    contentType: string
): Response {
    const body = buffer.slice();

    return new Response(body, {
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${templateName}.${extention}"`
        }
    })

}