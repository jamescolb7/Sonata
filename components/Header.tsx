import Image from "./Image"
import { Muted } from "./Text"

interface HeaderType extends React.HTMLAttributes<HTMLElement> {
	img: string
	type: string
	title: string
	subtitle?: string
}

export default function Header({
	className,
	img,
	type,
	title,
	subtitle,
	...props
}: HeaderType) {
	return (
		<>
			<div>
				<Image className="blurred" alt="" src={img}></Image>
				<div className="md:flex dark:border-zinc-800 pb-5 items-end text-center md:text-left space-y-3" style={{ marginTop: "-200px" }}>
					<Image src={img} alt="" className="noselect_image max-w-xs rounded-2xl drop-shadow-2xl inline-block" style={{ maxWidth: 256 }}>
					</Image>
					<div className="md:inline-block md:ml-5">
						<h1 className="tracking-tight font-semibold text-4xl mb-1 lg:text-6xl xl:text-8xl relative drop-shadow-lg text-white">{title}</h1>
						<Muted className="mb-1 ellipsis">
							{type} {subtitle && <>&bull; {subtitle}</>}
						</Muted>
					</div>
				</div>
			</div>
		</>
	)
}