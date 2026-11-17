import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers/trpcRouter";
import { cors } from "hono/cors";
import { exportRouter } from "./routers/exportRouter";
import { anonymousSession } from "./middleware/session";
import { deleteCookie } from "hono/cookie";

const app = new Hono();

const corsMiddlewawre = cors({
	origin: ["http://localhost:3000"], // Replace with frontend URL
	credentials: true,
	allowMethods: ["GET", "POST", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization"],
	exposeHeaders: ["Content-Length"],
	maxAge: 600,
});

// Enforce CORS rules across:
app.use("*", anonymousSession);
app.use("/trpc/*", corsMiddlewawre);
app.use("/api/*", corsMiddlewawre);

// Routers
app.use("/trpc/*", trpcServer({
	router: appRouter,
	createContext: (_opts, c) => ({
		sessionId: c.get("sessionId"),
	})
}));

// Regular REST routes for Cloudflare Browser
app.route("/api/export/", exportRouter);

export default app;
