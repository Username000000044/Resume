import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient, trpc } from "#/utils/trpc";
import texturedPaper from "@/assets/textured-paper.webp";
import "../styles.css";
import { TooltipProvider } from "#/components/ui/tooltip";

export const Route = createRootRoute({
  loader: async () => {
    const templateList = await queryClient.query(
      trpc.templatesList.queryOptions(),
    );
    return { templateList };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HeadContent />

        <div
          className="min-h-screen w-full bg-cover bg-fixed bg-no-repeat bg-top bg-[#ffffff]"
          style={{ backgroundImage: `url(${texturedPaper})` }}
        >
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
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
