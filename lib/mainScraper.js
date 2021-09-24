const fetch = require('node-fetch');
const pageFinder = require('./pageFinder');
const rapidrameScraper = require('./rapidrameScraper');
const seriesMainPageScraper = require('./seriesMainPageScraper');
const streamPageFinder = require('./streamPageFinder');

async function mainScraper(imdbID, type, season, episode) {

    const BASE_URL = "https://www.hdfilmcehennemi.tv"

    let stremioElements =[]

    const pageURL = (await pageFinder(imdbID, BASE_URL)).url
    const contentTitle = (await pageFinder(imdbID, BASE_URL)).title

    if (pageURL.length > 0 && contentTitle.length > 0) {

        if  (type === "movie") {
            
            const streamingPageList = await streamPageFinder(pageURL)
            // console.log(streamingPageList)
            
            for (let i = 0; i < streamingPageList.length; i++){

                if(streamingPageList[i].type === "rapidrame"){

                    const streamURL = (await rapidrameScraper(streamingPageList[i].url, BASE_URL)).url
                    const streamSubtitles = (await rapidrameScraper(streamingPageList[i].url, BASE_URL)).subtitles
                    
                    // console.log(streamURL)
                    // console.log(streamSubtitles)
                    if (streamSubtitles.length === 0) {
                        stremioElements.push({
                            title: contentTitle + "\n" + streamingPageList[i].title,
                            url: streamURL
                        })
                        
                    } else {
                        stremioElements.push({
                            title: contentTitle + "\n" + streamingPageList[i].title,
                            url: streamURL,
                            subtitles: streamSubtitles
                        })
                    }
                }
            }
            
        } else if (type === "series"){

            const seriesMainPageURL = (await seriesMainPageScraper(pageURL, season, episode)).episodeURL
            const episodeFullName = (await seriesMainPageScraper(pageURL,season, episode)).episodeFullName

            if(seriesMainPageURL !== undefined){
                // console.log("yeeeey")

                const streamingPageList = await streamPageFinder(seriesMainPageURL)
                // console.log(streamingPageList)
                
                for (let i = 0; i < streamingPageList.length; i++){
                    if(streamingPageList[i].type === "rapidrame"){
                        
                        const streamURL = (await rapidrameScraper(streamingPageList[i].url, BASE_URL)).url
                        const streamSubtitles = (await rapidrameScraper(streamingPageList[i].url, BASE_URL)).subtitles
                        
                        // console.log(streamURL)
                        // console.log(streamSubtitles)
                        if (streamSubtitles.length === 0) {
                            stremioElements.push({
                                title: contentTitle + "\n" + episodeFullName + "\n" + streamingPageList[i].title,
                                url: streamURL
                            })
                            
                        } else {
                            stremioElements.push({
                                title: contentTitle + "\n" + episodeFullName + "\n" + streamingPageList[i].title,
                                url: streamURL,
                                subtitles: streamSubtitles
                            })
                        }
                    }
                }


            }
        }
        
        // console.log(stremioElements)
        return stremioElements
    }
}
    
module.exports = mainScraper
