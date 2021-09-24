const { addonBuilder } = require("stremio-addon-sdk")
const mainScraper = require("./lib/mainScraper")

const manifest = {
	"id": "community.hdfilmcehennemi",
	"version": "0.0.6",
	"catalogs": [],
	"resources": ["stream"],
	"types": ["movie","series"],
	"name": "hdfilmcehennemi",
	"description": "HDFilmCehennemi Stremio Addon brings all the HTTP streams from hdfilmcehennemi.net to Stremio with Turkish dubbing option.",
	"logo": "https://raw.githubusercontent.com/gorlev/hdfilmcehennemi-stremio-addon/master/logo.png",
	"idPrefixes": ["tt"]
}
const builder = new addonBuilder(manifest)

const CACHE_MAX_AGE = 4 * 60 * 60; // 4 hours in seconds
const STALE_REVALIDATE_AGE = 4 * 60 * 60; // 4 hours
const STALE_ERROR_AGE = 7 * 24 * 60 * 60; // 7 days

builder.defineStreamHandler(async ({type, id}) => {
	console.log("request for streams: "+type+" "+id)
	
	let videoId =  id.split(":")[0]
	let season = id.split(":")[1]
	let episode = id.split(":")[2]
	
	const stream = await mainScraper(videoId, type, season, episode)
	// console.log(stream)
	return Promise.resolve({ streams: stream, cacheMaxAge: CACHE_MAX_AGE, staleRevalidate: STALE_REVALIDATE_AGE, staleError: STALE_ERROR_AGE})

})

module.exports = builder.getInterface()