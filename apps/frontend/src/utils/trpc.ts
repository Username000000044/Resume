import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@resume/backend/src/routers/trpcRouter.ts"

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: import.meta.env.VITE_TRPC_API_URL,
		}),
	],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});
