const fetch = require('node-fetch');
const cheerio = require('cheerio');
const isoLangConverter = require('./isoLangConverter');

async function rapidrameScraper(url, BASE_URL) {
    
    const requestPage = await fetch(url)
    const responsePage = await requestPage.text()

    let $ = cheerio.load(responsePage)

    const playerLink = $('iframe').attr("data-src").trim();
    // console.log(playerLink)

    const playerClass = $('iframe').attr("class").trim();
    

    const requestPlayerPage = await fetch(playerLink)
    const responsePlayerPage = await requestPlayerPage.text()

    $ = cheerio.load(responsePlayerPage)

    let subtitleList = []
    if(playerClass === "rapidrame"){
        
        const script = $("script").get()[3].children[0].data
        
        const fileLink = script.match(RegExp('(?<=file:").*((?="}],))'))[0].trim()  
        // console.log(fileLink)
        
        const tracks = JSON.parse(script.match(RegExp('(?<=tracks: ).*(?=,)'))[0].trim())
        // console.log(tracks)


        for (element of tracks) {
            if(element && element.kind === "captions"){
                let subID
                if(element.label.toLowerCase().includes("türkçe")){subID = "hdfc-tr"}
                if(element.label.toLowerCase().includes("forced")){subID = "hdfc-tr-forced"}
                if(element.label.toLowerCase().includes("gilizce")){subID = "hdfc-en"}
                let subLink = BASE_URL + element.file
                let subLang = await isoLangConverter(element.language)
                subtitleList.push({id: subID, url: subLink, lang: subLang})
            }      
        }
        
        // console.log(subtitleList)

        return {url: fileLink, subtitles: subtitleList}

    } else {
        return {url: "", subtitles: []}
    }


}

module.exports = rapidrameScraper

