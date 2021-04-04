const axios = require('axios');
module.exports = async function lastURLfinder(downloadLink){
    try{
        const response = await axios({url: downloadLink, method: "GET", maxRedirects: 0,});
        //console.log(response.request.res.responseUrl)

    } catch(e){
        const lastURL = e.response.data.substring(22);
        //console.log(lastURL)
        return lastURL
    }
}

//lastURLfinder('https://hdfilmcehennemi.download/download-redirect/g9e3mdsyq28z/8fe9bdcdb4df8ce032782e8a85e2c9162b305757689f11ab730cd3d486d738d23b0e38a8ebd4a468bfc6a179eea21bae')