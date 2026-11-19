import { createMiddleware } from "hono/factory";
import { Env } from "./session";

export const requireSession = createMiddleware<Env>(async (c, next) => {
    const sessionId = c.get("sessionId");

    if (!sessionId) {
        return c.json({ error: "Unauthorized: No Session" }, 401);
    }
    await next();
});