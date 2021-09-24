const fetch = require('node-fetch');

async function pageFinder(imdbID, BASE_URL){

  const responseWebsite = await fetch(BASE_URL + "/search", {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
      },
      body: `query=${imdbID}`,
      method: "POST"
    });

    const jsonResponseWebsite = await responseWebsite.json()
    // console.log(jsonResponseWebsite)

    if (jsonResponseWebsite.result.length > 0) {

      const slug = jsonResponseWebsite.result[0].slug
      const slug_prefix = jsonResponseWebsite.result[0].slug_prefix
      const title = jsonResponseWebsite.result[0].title.trim()
      
      const LAST_URL = BASE_URL + "/" + slug_prefix + slug
      // console.log(LAST_URL, title)
      
      return {url:LAST_URL, title }
    } else {
      return {url:"", title:""}
    }
    
}

module.exports = pageFinder