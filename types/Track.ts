import { Album } from "./Album"

export interface Track {
	id: number,
	title: string,
	album: Album,
	artist: {
		name: string
	},
	duration: number
}