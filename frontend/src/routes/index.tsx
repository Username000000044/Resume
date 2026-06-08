import { createFileRoute, Link } from "@tanstack/react-router";
import { Feather, Plus } from "lucide-react";
import { Header } from "#/components/Header";
import { Button, buttonVariants } from "#/components/ui/button";

import "#/styles/animations.css";
import { TemplatesOverlay } from "#/components/TemplatesOverlay";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-[1fr_50rem] h-screen px-6 pt-6 lg:px-12 lg:pt-12">
			{/* Left */}
			<div>
				<Header />
				<div className="lg:flex lg:flex-col lg:items-center lg:justify-center lg:min-h-[calc(100vh-20rem)]">
					<div className="-rotate-6 h-full">
						<div className="slide-in-bottom mt-10 mb-18 ml-6 lg:m-0">
							<div className="relative w-min">
								<p className="text-6xl font-semibold border-2 border-primary px-2 lg:text-8xl">
									ATS
								</p>
								<img
									src="assets/cursor.svg"
									alt=""
									className="absolute size-6 -bottom-2 -right-4 lg:-bottom-6 lg:-right-8 lg:size-max"
								></img>
							</div>
							<h2 className="text-primary mt-4 text-6xl/14 font-serif lg:mt-8 lg:ml-16 lg:text-8xl/22">
								Resumes Built <br /> Confidently
							</h2>
							<div className="hidden 2xl:block lg:absolute left-50 -bottom-60 rotate-6">
								<svg
									role="presentation"
									className="w-200"
									viewBox="0 0 579 139"
									fill="none"
									xmlns="http://w3.org"
								>
									<defs>
										<linearGradient id="gradient-line">
											<stop offset="0%" stopColor="#AD2E24" stopOpacity="0.1" />
											<stop
												offset="100%"
												stopColor="#AD2E24"
												stopOpacity="0.2"
											/>
										</linearGradient>
									</defs>
									<path
										className="arrow-animate"
										d="M8.31248 2.00055C-5.96321 42.0111 -5.23283 124.485 111.894 134.298C258.303 146.564 283.667 101.268 296.614 75.86C310.108 49.3801 298.099 16.0761 276.187 9.9429C249.343 2.429 221.832 7.25903 198.925 28.2866C179.421 46.1894 164.616 104.196 271.251 126.413C346.945 142.184 437.579 129.041 460.487 126.413C503.978 122.032 553.393 101.019 576.5 87.0005C576.5 87.0005 574.976 96.7522 574 103.001C574.976 96.7522 576.5 87.0005 576.5 87.0005L562 81.0005"
										stroke="url(#gradient-line)"
										strokeWidth="4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>
					</div>
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
					<div className="flex flex-col gap-4 mt-18 [&>*]:w-75">
						{/* TODO: Make TemplateOverlay button a child of TemplateOverlay so it can be used in many locations with different button.*/}

						<TemplatesOverlay
							trigger={
								<Button className="shadow-md cursor-pointer" size="lg">
									Create Resume <Plus className="ml-auto" />
								</Button>
							}
						/>
						{/* <Button className="shadow-md cursor-pointer" size="lg">
							Create Resume <Plus className="ml-auto" />
						</Button> */}
						<p className="text-center text-muted-foreground italic text-sm">
							or
						</p>
						<Button
							className="shadow-md"
							size="lg"
							variant="secondary"
							disabled
						>
							Tailor Resume <Feather className="ml-auto" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
