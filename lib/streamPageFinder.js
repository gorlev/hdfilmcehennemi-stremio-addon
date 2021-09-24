const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function streamPageFinder(link) {
    
    const responseLink = await fetch(link)
    const responseHTML = await responseLink.text()

    // console.log(responseHTML)
    const $ = cheerio.load(responseHTML)

    let streamList = []

    $('.card-body > nav > a').each((i, section) => {
        let streamName = $(section).text().trim()
        let streamPageURL = $(section).attr("href").trim()
        let hosterType = "unknown"
        if (streamName.toLowerCase().includes("rapidrame")){
            hosterType = "rapidrame"
        } else if (streamName.toLowerCase().includes("vidmoly")){
            hosterType = "vidmoly"
        }
        if(streamPageURL !== "#"){
            streamList.push({title:streamName, url:streamPageURL, type:hosterType})
        }
    }).get();

    // console.log(streamList.length)
    return streamList
}

module.exports = streamPageFinder
