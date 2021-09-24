const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function seriesMainPageScraper(url, season, episode) {

    const requestPage = await fetch(url)
    const responsePage = await requestPage.text()

    let $ = cheerio.load(responsePage)

    streamLinks = []

    // $('#seasonsTabs-tabContent > .tab-pane > .card-list > .card-list-item').each((i, section) => {
    $('.card-list-item').each((i, section) => {
        let episodeLink = $(section).children("a").attr("href").trim()
        let episodeFullName = $(section).children("a").children(".card-list-item-alt").children("h3").text().trim()

        let seasonNumber = episodeFullName.match(RegExp(/[0-9]+/g))[0]
        let episodeNumber = episodeFullName.match(RegExp(/[0-9]+/g))[1]

        streamLinks.push({season: seasonNumber, episode: episodeNumber, url: episodeLink, episodeFullName})

    }).get();
    // console.log(streamLinks)

    let episodeURL, episodeFullName

    streamLinks.forEach(element => {
        if(element.season === season && element.episode === episode){
            episodeURL = element.url
            episodeFullName = element.episodeFullName
        }
    });
    
    // console.log(episodeURL)
    if (episodeURL === undefined){
        console.log("Can't find the url from specified season or episode!")
    }
    
    return {episodeURL, episodeFullName}
}

module.exports = seriesMainPageScraper


