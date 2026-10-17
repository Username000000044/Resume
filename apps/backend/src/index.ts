import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./appRouter";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
	"/trpc/*",
	cors({
		origin: ["http://localhost:3000"], // Replace with your frontend URL
		credentials: true,
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
	}),
	trpcServer({
		router: appRouter,
	}),
);

export default app;
