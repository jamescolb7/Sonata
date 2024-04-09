import { Artist } from "./Artist"
import { Track } from "./Track"

export interface Album {
	id: string,
	title: string,
	artist: Artist,
	cover_big: string,
	cover_medium: string,
	cover_small: string,
	contributors: Artist[],
	tracks: {
		data: Track[]
	}
}