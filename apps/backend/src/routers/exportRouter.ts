import { Hono } from "hono";
import { renderToString } from "hono/jsx/dom/server";
import path from "path";

export const exportRouter = new Hono();

// async function generatePurgedTailwindCSS(htmlContent: string): Promise<string> {

//     const 

//     const result = await postcss([
//         tailwindcss({
//             base,
//             optimize,
//             transformAssetUrls
//         })
//     ]).process(baseCSSInput, { from: undefined })



//     return null;
// }

exportRouter.get("/pdf", async (context) => {
    try {
        const token = context.req.query("token");
        if (!token) return context.text("Missing export transaction token",)

        const decodedPayload = Buffer.from(token, "base64url").toString("utf-8");
        const payloadData = JSON.parse(decodedPayload);

        const cssPath = path.resolve(__dirname, "../../")
        // Template
        const componentHTML = renderToString("");

        const fullHTMLDocument = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <style>
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        @page { size: letter; margin: 0; }
                    </style>
                </head>
                <body>
                    <div id="resume-document-root">${componentHTML}</div>
                    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
                </body>
            </html>
        `


    } catch {

    }
})