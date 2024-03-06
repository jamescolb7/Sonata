import { Track } from "./Track"

export interface Album {
	id: number,
	title: string,
	artist: {
		name: string
	},
	cover_big: string,
	cover_medium: string,
	cover_small: string,
	tracks: {
		data: Track[]
	}
}