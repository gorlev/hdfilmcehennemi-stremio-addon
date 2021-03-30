//const request = require('request-promise');
const cheerio = require('cheerio');
const axios = require('axios').default;
const fetch = require("node-fetch");


async function scraper(imdbId, type, season, episode) {
    try {
        //TAKES IMDB ID AND FINDS ITS NAME ON IMDB.COM
        const responseFromIMDB = await fetch(`https://v2.sg.media-imdb.com/suggestion/t/${imdbId}.json`, {
            "referrer": "https://www.imdb.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors"
        });
        const IMDBdata = await responseFromIMDB.json();
        const imdbName = await IMDBdata.d[0]["l"];
        const IMDByear = await IMDBdata.d[0]["y"];
        console.log(imdbName)

        const responseFromTMDB = await fetch(`https://www.themoviedb.org/search?language=tr-TR&query=${imdbName} y:${IMDByear}`);
        const TMDBdata = await responseFromTMDB.text();
        let $ = cheerio.load(TMDBdata);
        const turkishName = $('.details > .wrapper > .title > div').first().text().trim()
        console.log(turkishName)
      
        //TURKISH CHARS TO ENGLISH CHARS
        let chars = {'ı':'i',
                     'ö':'o', 
                     'ü':'u', 
                     'ç':'c', 
                     'ş':'s', 
                     'ğ':'g', 
                     ' ':'-', 
                     '\'':'',
                     ':':''};
        let editedName = imdbName.toLowerCase().replace(/[ıöüçşğ:' ]/g, m => chars[m]);
        let editedNameTR = turkishName.toLowerCase().replace(/[ıöüçşğ:' ]/g, m => chars[m]);
        console.log(editedName);
        console.log(editedNameTR)

        //FINDS THE EMBED URL
        let embedUrl;
        let movieHtml;
        let lang;

        if (type === "movie") {
            try {
                movieHtml = await axios.get(`https://www.hdfilmcehennemi.net/${editedName}`);
                $ = cheerio.load(movieHtml.data);
                embedUrl = $('script[type="application/ld+json"]').last().html().split(",").reverse()[0].split('"')[3];
                console.log(movieHtml.request._redirectable._currentUrl) //redirectedURL
                lang = $('.selected').text().trim();
                
            } catch(e) {
                try{
                    movieHtml = await axios.get(`https://www.hdfilmcehennemi.net/${editedNameTR}`);
                    $ = cheerio.load(movieHtml.data);
                    embedUrl = $('script[type="application/ld+json"]').last().html().split(",").reverse()[0].split('"')[3];
                    console.log(movieHtml.request._redirectable._currentUrl) //redirectedURL
                    lang = $('.selected').text().trim();
                }
                catch(e){
                    movieHtml = await axios.get(`https://www.hdfilmcehennemi.net/${editedNameTR}-izle`);
                    
                    $ = cheerio.load(movieHtml.data);
                    embedUrl = $('script[type="application/ld+json"]').last().html().split(",").reverse()[0].split('"')[3];
                    console.log(movieHtml.request._redirectable._currentUrl)
                    lang = $('.selected').text().trim();
                }                
            }
            
        } else if (type === "series"){
            try {
                const requestSeries = axios.get(`https://www.hdfilmcehennemi.net/${editedName}-${season}-sezon`);
                
                const redirectUrl = (await requestSeries).request._redirectable._currentUrl;
                const seriesUrl = redirectUrl + "bolum-" + episode;
                console.log(seriesUrl);
                
                const seriesHtml = await axios.get(seriesUrl);
                $ = cheerio.load(seriesHtml.data);
    
                embedUrl = $('script[type="application/ld+json"]').last().html().split(",").reverse()[0].split('"')[3];
            } catch (e) {
                const requestSeries = axios.get(`https://www.hdfilmcehennemi.net/${editedNameTR}-${season}-sezon`);
                
                const redirectUrl = (await requestSeries).request._redirectable._currentUrl;
                const seriesUrl = redirectUrl + "bolum-" + episode;
                console.log(seriesUrl);
                
                const seriesHtml = await axios.get(seriesUrl);
                $ = cheerio.load(seriesHtml.data);
                
                embedUrl = $('script[type="application/ld+json"]').last().html().split(",").reverse()[0].split('"')[3];
            }
        }
        if (type === "movie") {
            lang = lang.replace("Rapidrame", "Original");
        }
        //FINDS THE EMBEDID
        const embedID = embedUrl.split("/")[4].split("-")[1].split(".")[0];

        //GOES TO THE DOWNLOAD PAGE
        const requestDownload = await axios.get(`https://hdfilmcehennemi.download/download/${embedID}`);
        $ = cheerio.load(requestDownload.data);

        const mediaName = $('.text-secondary').text(); //finds the media name
        
        let downlaodLinks = [];

        $('.container > .d-flex > a').each((i, section) => {
            let downloadLink = $(section).attr('href');
            let resolution = $(section).text().trim();

            if (type === "movie"){
                downlaodLinks.push({name: 'HD Film \nCehennemi',
                                    title: `${imdbName}\n${mediaName}\n${resolution} | ${lang}`,
                                    url: `https://hdfilmcehennemi.download${downloadLink}`});
            } else if (type === "series") {
                downlaodLinks.push({name: 'HD Film\nCehennemi',
                                    title: `${imdbName} | ${mediaName}\n${season}. Sezon ${episode}. Bölüm\n${resolution}`,
                                    url: `https://hdfilmcehennemi.download${downloadLink}`});
            }
        }).get();

        console.log(downlaodLinks)

        return downlaodLinks;

    } catch (e) {
        console.log('Scraper didn\'t work! :( \n',e);
     }
}

//scraper("tt10265034","movie") //Land+
//scraper("tt12361974", "movie") // zack sneider's justice league+
//scraper("tt5420376","series",5,5) //riverdale+
//scraper("tt3107288","series",7,4) // flash+
//scraper("tt1535109","movie") // kaptan philips+ (izle yazınca olmuyor)
//scraper("tt4844148","movie") //vahşi dostum ++
//scraper("tt11388278","movie") // a week away +
//scraper("tt3731562","movie") //kafatası adası + (izle yazmayınca olmuyor)
//scraper("tt2543164","movie") //geliş + (izle yazınca olmuyor)
//scraper("tt2719848","movie") //everest

//scraper("tt1386697","movie") //suicide squad //sorunlu (linkin başında hd yazıyor diye çalışmıyor)
//scraper("tt12013758","movie") //aynı dalganın içinde // sorunlu neden anlamadım

module.exports.scraper = scraper;