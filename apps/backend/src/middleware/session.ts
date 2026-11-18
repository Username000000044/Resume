import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export type Env = {
    Variables: {
        sessionId: string;
    };
    Bindings: {
        COOKIE_SECRET: string;
        BROWSER: Fetcher;
        FRONTEND_URL: string;
    }
}

export const anonymousSession = createMiddleware<Env>(async (c, next) => {
    const COOKIE_NAME = "anonymous_session";
    const secret = c.env.COOKIE_SECRET;

    // Try to read the existing signed cookie
    let sessionId = await getSignedCookie(c, secret, COOKIE_NAME);

    console.log(sessionId);

    // If no cookie or tampered with, generate a new one
    if (!sessionId) {
        console.log("No cookie")

        sessionId = crypto.randomUUID();

        await setSignedCookie(c, COOKIE_NAME, sessionId, secret, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            // sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        })
    }

    // Attach to Hono context for downstream routes & tRPC
    c.set("sessionId", sessionId);
    await next();
})