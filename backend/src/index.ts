import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./appRouter";

const app = new Hono();

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  }),
);

export default app;
