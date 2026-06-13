import { createRootRoute, Outlet } from "@tanstack/react-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import "../styles.css";

const queryClient = new QueryClient()

export const Route = createRootRoute({
	component: RootComponent,
	errorComponent: ({ error }) => <div>{error.message}</div>,
});

function RootComponent() {
	return (
		<>
		 	<QueryClientProvider client={queryClient}>
				<div className="h-screen w-full bg-[url('/assets/textured-paper.webp')] bg-cover bg-fixed">
					<Outlet />
				</div>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
			{/* <TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/> */}
		</>
	);
}
