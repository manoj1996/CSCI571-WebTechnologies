let express = require("express");
let router = express.Router();

router.get("/home", function(req, res) {
    const https = require('https');
    let result = {};
    https.get('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=mAKH3rwpndhbclb6K6jjgWNdwu47WB77', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            let responseJson = JSON.parse(data).results;
            let num = 0;
            for (let r in responseJson){
                try{
                    if(responseJson[r].title !== '' && responseJson[r].published_date.split("T")[0] !== '' && responseJson[r].url !== '' && responseJson[r].abstract !== '' && responseJson[r].section !== ''){
                        let tempResult = {};
                        tempResult["Title"] = responseJson[r].title;
                        tempResult["Date"] = responseJson[r].published_date.split("T")[0];
                        tempResult["url"] = responseJson[r].url;
                        tempResult["Description"] = responseJson[r].abstract;
                        tempResult["Section"] = responseJson[r].section;
                        tempResult["Source"] = "nyTimes";
                        let images = responseJson[r].multimedia;
                        let imageFlag = true;
                        try {
                            for (i in images) {
                                if (imageFlag && images[i].width >= 2000) {
                                    tempResult["Image"] = images[i].url;
                                    imageFlag = false;
                                }
                            }
                            if (imageFlag) {
                                tempResult["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                            }
                        }
                        catch (e) {
                            tempResult["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                        }
                        result[num] = tempResult;
                        num += 1;
                    }

                }
                catch (e) {
                    console.log(e);
                }
            }
            res.send(result);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

router.get("/news", function (req, res) {
    let sectionName = req.query.section;
    let result = {};
    const https = require('https');
    https.get('https://api.nytimes.com/svc/topstories/v2/'+sectionName.toUpperCase()+'.json?api-key=mAKH3rwpndhbclb6K6jjgWNdwu47WB77', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            let responseJson = JSON.parse(data).results;
            let num = 0;
            for (let r in responseJson){
                try{
                    if(responseJson[r].title !== '' && responseJson[r].published_date.split("T")[0] !== '' && responseJson[r].abstract !== '' && responseJson[r].section !== '' && responseJson[r].url !== ''){
                        let tempResult = {};
                        tempResult["Title"] = responseJson[r].title;
                        tempResult["Date"] = responseJson[r].published_date.split("T")[0];
                        tempResult["Description"] = responseJson[r].abstract;
                        tempResult["Section"] = responseJson[r].section;
                        tempResult["url"] = responseJson[r].url;
                        tempResult["Source"] = "nyTimes";
                        let images = responseJson[r].multimedia;
                        let imageFlag = true;
                        try {
                            for (let i in images) {
                                if (imageFlag && images[i].width >= 2000) {
                                    tempResult["Image"] = images[i].url;
                                    imageFlag = false;
                                }
                            }
                            if (imageFlag) {
                                tempResult["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                            }
                        }
                        catch (e) {
                            tempResult["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                        }
                        result[num] = tempResult;
                        num += 1;
                        if (num >= 10){
                            break;
                        }
                    }

                }
                catch (e) {
                    console.log(e);
                }
            }
            res.send(result);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});


router.get("/article", function (req, res) {
    if(req.query.url.includes('nytimes')){

        let url = req.query.url.replace('=','');
        let result = {};
        const https = require('https');
        https.get('https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(\"' + url + '\")&api-key=mAKH3rwpndhbclb6K6jjgWNdwu47WB77', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                let responseJson = JSON.parse(data).response.docs[0];
                try {
                    result["Title"] = responseJson.headline.main;
                    let date = responseJson.pub_date.split("T")[0];
                    let dateF = new Date(date);
                    result["Date"] = dateF.getDate() + " " + dateF.toLocaleString('default', {month: 'long'}) + " " + dateF.getFullYear();
                    result["DateMMFormat"] = date;
                    result["Description"] = responseJson.abstract;
                    result["web_url"] = responseJson.web_url;
                    result["url"] = responseJson.web_url;
                    result["Source"] = "nyTimes";
                    result["Section"] = responseJson.section_name;

                    let images = responseJson.multimedia;
                    let imageFlag = true;
                    try {
                        for (i in images) {
                            if (imageFlag && images[i].width >= 2000) {
                                result["Image"] = "https://www.nytimes.com/" + images[i].url;
                                imageFlag = false;
                            }
                        }
                        if (imageFlag) {
                            result["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                        }
                    } catch (e) {
                        result["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                    }
                } catch (e) {
                    console.log("Error Occurred:", e);
                }
                res.send(result);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    else{
        let articleId = req.query.url;
        let result = {};
        const https = require('https');
        https.get('https://content.guardianapis.com/' + articleId.toLowerCase() + '?api-key=36744133-07b2-4428-9313-985c447fb3cb&show-blocks=all', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                let responseJson = JSON.parse(data).response.content;
                result["Title"] = responseJson.webTitle;
                let imagesLength = responseJson.blocks.main.elements[0].assets.length;
                if (imagesLength === 0) {
                    result["Image"] = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
                } else {
                    result["Image"] = responseJson.blocks.main.elements[0].assets[imagesLength - 1].file;
                }
                let date = responseJson.webPublicationDate.split("T")[0];
                result["DateMMFormat"] = date;
                let dateF = new Date(date);
                result["Date"] = dateF.getDate() + " " + dateF.toLocaleString('default', {month: 'long'}) + " " + dateF.getFullYear();
                result["Description"] = responseJson.blocks.body[0].bodyTextSummary;
                result["id"] = responseJson.id;
                result["Section"] = responseJson.sectionId;
                result["Source"] = "guardian";
                result["url"] = responseJson.webUrl;
                res.send(result);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
});

router.get("/news/search", function (req, res) {
    let searchQuery = req.query.q;
    let result = {};
    const https = require('https');
    https.get('https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+searchQuery+'&api-key=mAKH3rwpndhbclb6K6jjgWNdwu47WB77', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            let responseJson = JSON.parse(data).response.docs;
            let num = 0;
            for (let r in responseJson){
                try{
                    if(responseJson[r].headline.main !== '' && responseJson[r].pub_date.split("T")[0] !== '' && responseJson[r].abstract !== '' && responseJson[r].news_desk !== '' && responseJson[r].web_url !== ''){
                        let tempResult = {};
                        tempResult["Title"] = responseJson[r].headline.main;
                        tempResult["Date"] = responseJson[r].pub_date.split("T")[0];
                        tempResult["Description"] = responseJson[r].abstract;
                        tempResult["Section"] = responseJson[r].news_desk;
                        tempResult["url"] = responseJson[r].web_url;
                        tempResult["Source"] = "nyTimes";
                        let images = responseJson[r].multimedia;
                        let imageFlag = true;
                        try{
                            for (let i in images){
                                if (imageFlag && images[i].width >= 2000){
                                    tempResult["Image"] = "https://www.nytimes.com/"+images[i].url;
                                    imageFlag = false;
                                }
                            }
                            if (imageFlag){
                                tempResult["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                            }
                        }
                        catch (e) {
                            tempResult["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                        }
                        result[num] = tempResult;
                        num += 1;
                        if(num >= 5){
                            break;
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            res.send(result);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});


module.exports = router;