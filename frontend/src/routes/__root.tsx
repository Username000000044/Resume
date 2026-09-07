import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "#/utils/trpc";
import texturedPaper from "@/assets/textured-paper.webp";
import "../styles.css";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error }) => <div>{error.message}</div>,
});

function RootComponent() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div
          className="min-h-screen w-full bg-cover bg-fixed bg-no-repeat bg-top bg-[#ffffff]"
          style={{ backgroundImage: `url(${texturedPaper})` }}
        >
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
