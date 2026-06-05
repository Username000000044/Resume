import { createFileRoute, Link } from "@tanstack/react-router";
import { Feather, Plus } from "lucide-react";
import { Header } from "#/components/Header";
import { AspectRatio } from "#/components/ui/aspect-ratio";
import { buttonVariants } from "#/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-[1fr_50rem] h-screen p-6 lg:px-12 lg:pt-12 lg:pb-0">
			{/* Left */}
			<div>
				<Header />
				<div className="relative mt-10 mb-18 ml-6 -rotate-6">
					<p className="text-6xl font-semibold border-2 border-destructive px-2 w-min">
						ATS
					</p>

					<h2 className="mt-4 text-6xl/14 font-serif">
						Resumes Built <br />
						Confidently
					</h2>
				</div>
			</div>

			{/* Call To Action */}
			<div className="h-full bg-background/25 border-x-3 border-t-3 border-zinc-300 border-dashed">
				<div className="h-full min-h-150 p-6 flex flex-col justify-center items-center">
					<div className="size-40 rounded-full bg-primary mx-auto">
						<img
							src="assets/written-paper.svg"
							alt=""
							className="relative bottom-5"
						></img>
					</div>
					<div className="flex flex-col gap-6 mt-18 [&>*]:w-75">
						<Link to="." className={buttonVariants({ size: "lg" })}>
							Create Resume <Plus className="ml-auto" />
						</Link>
						<Link
							to="."
							className={buttonVariants({ variant: "secondary", size: "lg" })}
						>
							Tailor Resume <Feather className="ml-auto" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

{
	/* <div className="flex-1">
				<Header />
				<div className="relative mt-10 mb-18 ml-6 -rotate-6">
					<p className="text-6xl font-semibold border-2 border-destructive px-2 w-min">
						ATS
					</p>
					<img
						src="/assets/cursor.svg"
						alt=""
						className="absolute size-7 -bottom-4 -right-5 rotate-6"
					/>

				
					<h2 className="mt-4 text-6xl/14 font-serif">Resumes</h2>
				</div>
			</div> */
}
