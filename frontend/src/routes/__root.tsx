import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "../styles.css";

export const Route = createRootRoute({
	component: RootComponent,
	errorComponent: ({ error }) => <div>{error.message}</div>,
});

function RootComponent() {
	return (
		<>
			<div className="h-screen w-full bg-[url('/assets/textured-paper.webp')] bg-cover bg-fixed">
				<Outlet />
			</div>
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	);
}
