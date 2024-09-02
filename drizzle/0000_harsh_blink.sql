CREATE TABLE `Album` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`artistId` text,
	`cover_big` text NOT NULL,
	`cover_medium` text NOT NULL,
	`cover_small` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL,
	FOREIGN KEY (`artistId`) REFERENCES `Artist`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `Artist` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`picture_big` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `History` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`trackId` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`trackId`) REFERENCES `Track`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `Liked` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`trackId` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`trackId`) REFERENCES `Track`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `PlaylistTracks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`playlistId` text NOT NULL,
	`trackId` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL,
	FOREIGN KEY (`playlistId`) REFERENCES `Playlists`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`trackId`) REFERENCES `Track`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `Playlists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`userId` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Track` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`artistId` text,
	`albumId` text,
	`duration` integer NOT NULL,
	`preview` text,
	`type` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL,
	FOREIGN KEY (`artistId`) REFERENCES `Artist`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`albumId`) REFERENCES `Album`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hashed_password` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Album_id_key` ON `Album` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Artist_id_key` ON `Artist` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `History_id_key` ON `History` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Liked_id_key` ON `Liked` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `PlaylistTracks_id_key` ON `PlaylistTracks` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Playlists_name_key` ON `Playlists` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `Playlists_id_key` ON `Playlists` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Track_id_key` ON `Track` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_key` ON `User` (`email`);