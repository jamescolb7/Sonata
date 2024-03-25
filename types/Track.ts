import { Album } from "./Album"
import { Artist } from "./Artist"

export interface Track {
	id: string,
	title: string,
	album: Album,
	contributors: Artist[],
	artist: Artist,
	duration: number,
	preview: string
}