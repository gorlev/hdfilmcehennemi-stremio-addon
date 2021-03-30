const { addonBuilder } = require("stremio-addon-sdk")
const { scraper } = require("./scraper")

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "community.HDfilmCehennemi",
	"version": "0.0.1",
	"catalogs": [],
	"resources": [
		"stream"
	],
	"types": [
		"movie",
		"series"
	],
	"name": "HDfilmCehennemi",
	"description": "HDFilmCehennemi Stremio Addon brings all the HTTP streams from hdfilmcehennemi.net to Stremio with Turkish dubbing option.",
	"logo": "https://www.hdfilmcehennemi.net/favicon-new2.ico",
	"idPrefixes": [
		"tt"
	]
}
const builder = new addonBuilder(manifest)

builder.defineStreamHandler(async ({type, id}) => {
	console.log("request for streams: "+type+" "+id)
	
	let videoId =  id.split(":")[0]
	let season = id.split(":")[1]
	let episode = id.split(":")[2]
	
	const stream = await scraper(videoId, type, season, episode);
	return Promise.resolve({ streams: stream })
})

module.exports = builder.getInterface()