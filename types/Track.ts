import { Album } from "./Album"
import { Artist } from "./Artist"

export interface Track {
	id: number,
	title: string,
	album: Album,
	contributors: Artist[],
	artist: Artist,
	duration: number
}