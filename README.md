<h1 align="center">
  <br />
  <a href="https://github.com/directlycrazy/Sonata"><img src="./public/icons/round.png" alt="Sonata" width="200" /></a>
  <br />
  Sonata
  <br />
</h1>

<h4 align="center">Your self-hosted music streaming platform.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

![screenshot](./docs/screenshots/app.gif)

## Key Features

* Interface made in React and Next.js
* Music data provided by Deezer
	* Artist view of top songs and albums
	* Album view
	* Discover page with various categories of music
* Live, synced lyrics from [lrclib.net](https://lrclib.net)
* Account management system
	* Track history
	* Liked tracks playlist
	* User created playlists
* PWA Installable on iOS, Android, and Desktop
* Self-hostable
* Modular plugin system to utilize different services for playback
* Guest view for users without an account
* And more!

## How To Use

### Environment Variables

Please ensure the following environment variables are set to ensure the correct function of Sonata. Each can be changed depending on your preferences for how "open" the app should be to guests, and if users should be allowed to sign up.

```env
# Public URL of the application
BASE_URL=http://localhost:3000
# Allow unauthenticated users to access basic functionality (browse, search, listen to audio previews)
GUESTS_ALLOWED=true
# If user signup/account creation is enabled.
SIGNUPS_ALLOWED=false

# Streaming Plugin Configuration
#Music Playback from Deezer
DEEZER_ENABLED=true
DEEZER_ARL=xxxxxxxxxx

#Music Playback from YouTube
YOUTUBE_ENABLED=true
```

### Docker Install

To install Sonata with the Docker method, you must already have Docker installed on your system, either natively or through something like WSL and Docker Desktop.

```bash
# Clone this repository
git clone https://github.com/directlycrazy/Sonata

# Go into the repository
cd sonata

# Create the database directory
mkdir database

# Build Sonata using the Dockerfile 
docker build -t sonata .

# Run Sonata with the database mount and port
docker run sonata -v ./database:/opt/app/database -p 3000:3000
```

### Manual Install

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/directlycrazy/Sonata

# Go into the repository
cd sonata

# Install dependencies
npm install

# Create the database directory
mkdir database

# Generate database
npm run migrate

#Build the app
npm run build
```

### Start the App

```bash
# Run the app
npm prod:start
```

## Download

You can [download](https://github.com/directlycrazy/Sonata/archive/refs/heads/main.zip) the latest version of Sonata for any platform with Node >= 18. Please refer to the build steps above to get your instance running.

## Credits

This software has been made possible thanks to the following open-source packages:

- [d-fi-core](https://github.com/d-fi/d-fi-core/)

## License

GNU GPLv3

---

> Created by [@directlycrazy](https://github.com/directlycrazy)
