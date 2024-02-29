'use client';

import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";
import { Play, SkipBack, SkipForward, Volume1 } from "lucide-react";

export default function Player({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<>
			<div {...props} className={cn(className, "fixed w-full py-4 bottom-0 border-t bg-background align-center px-4")}>
				<div className="flex flex-row flex-nowrap justify-between w-full">
					<div className="flex items-center space-x-3">
						<img className="h-12 w-12 rounded-md border indent-[-10000px]" src='' alt="" />
						<div>
							<h3 className="text-lg font-semibold">
								Not Playing
							</h3>
							<p className="text-sm"></p>
						</div>
					</div>
					<div className="flex items-center flex-row space-x-3">
						<SkipBack className="h-8 w-8" />
						<Play className="h-8 w-8" />
						<SkipForward className="h-8 w-8" />
					</div>
					<div className="flex items-center space-x-3 fixed invisible md:static md:visible">
						<Volume1 className="h-8 w-8" />
						<Slider className="w-[100px]" defaultValue={[50]} max={100} step={0.01}></Slider>
						<p className="font-semibold">0:00 / 0:00</p>
					</div>
				</div>
			</div>
		</>
	)
}