const fetch = require('node-fetch');

async function isoLangConverter(code) {
    if (code === "forced") {
        code = "tr"
    }
    const request = await fetch("https://raw.githubusercontent.com/haliaeetus/iso-639/750b7e72d245964ebc9a272137d68d8572e81e02/data/iso_639-1.json")
    const responseJSON = await request.json()
    const langCode =  responseJSON[code]["639-2"].trim()
    return langCode
}

module.exports = isoLangConverter