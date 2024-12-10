interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	src: string | undefined
}

export default function Image({ src, ...props }: ImageProps) {
	if (src === undefined || src === null || src === "") return;
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img src={`${src.includes('dzcdn.net') ? "/image?q=" : ""}${encodeURI(src)}`} {...props} alt=""></img>
	)
}