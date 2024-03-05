export interface Track {
	id: number,
	title: string,
	album: {
		id: number,
		title: string,
		cover_medium: string,
		cover_small: string
	},
	artist: {
		name: string
	},
	duration: number
}