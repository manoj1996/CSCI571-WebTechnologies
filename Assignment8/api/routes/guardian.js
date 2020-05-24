let express = require("express");
let router = express.Router();

router.get("/home", function(req, res) {
    const https = require('https');
    let result = {};
    https.get('https://content.guardianapis.com/search?api-key=36744133-07b2-4428-9313-985c447fb3cb&section=(sport|business|technology|politics)&show-blocks=all&page-size=20', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            let responseJson = JSON.parse(data).response.results;
            let num = 0;
            for (let r in responseJson){
                try{
                    let tempResult = {};
                    if(responseJson[r].webTitle !== '' && responseJson[r].sectionId !== '' && responseJson[r].webPublicationDate.split("T")[0] !== '' && responseJson[r].blocks.body[0].bodyTextSummary !== '' && responseJson[r].id !== '' && responseJson[r].webUrl !== ''){
                        tempResult["Title"] = responseJson[r].webTitle;
                        tempResult["Section"] = responseJson[r].sectionId;
                        tempResult["Source"] = "guardian";
                        let imagesLength = responseJson[r].blocks.main.elements[0].assets.length;
                        if (imagesLength === 0){
                            tempResult["Image"] = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
                        }
                        else{
                            tempResult["Image"] = responseJson[r].blocks.main.elements[0].assets[imagesLength-1].file;
                        }
                        tempResult["Date"] = responseJson[r].webPublicationDate.split("T")[0];
                        tempResult["Description"] = responseJson[r].blocks.body[0].bodyTextSummary;
                        tempResult["id"] = responseJson[r].id;
                        tempResult["url"] = responseJson[r].webUrl;
                        result[num] = tempResult;
                        num += 1;
                    }
                }
                catch (e) {
                    continue;
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
    https.get('https://content.guardianapis.com/'+sectionName.toLowerCase()+'?api-key=36744133-07b2-4428-9313-985c447fb3cb&show-blocks=all&page-size=20', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
        let responseJson = JSON.parse(data).response.results;
        let num = 0;
        for (let r in responseJson){
            try{
                let tempResult = {};
                if (responseJson[r].webTitle !== '' && responseJson[r].sectionId !== '' && responseJson[r].webPublicationDate.split("T")[0] !== '' && responseJson[r].blocks.body[0].bodyTextSummary !== '' && responseJson[r].id !== '' && responseJson[r].webUrl !== ''){
                    tempResult["Title"] = responseJson[r].webTitle;
                    let imagesLength = responseJson[r].blocks.main.elements[0].assets.length;
                    if (imagesLength === 0){
                        tempResult["Image"] = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
                    }
                    else{
                        tempResult["Image"] = responseJson[r].blocks.main.elements[0].assets[imagesLength-1].file;
                    }
                    tempResult["Source"] = "guardian";
                    tempResult["Section"] = responseJson[r].sectionId;
                    tempResult["Date"] = responseJson[r].webPublicationDate.split("T")[0];
                    tempResult["Description"] = responseJson[r].blocks.body[0].bodyTextSummary;
                    tempResult["id"] = responseJson[r].id;
                    tempResult["url"] = responseJson[r].webUrl;
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
    if(!req.query.id.includes('nytimes')){
        let articleId = req.query.id;
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
                result["Section"] = responseJson.sectionId;
                result["id"] = responseJson.id;
                result["Source"] = "guardian";
                result["url"] = responseJson.webUrl;
                res.send(result);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    else{
        let url = req.query.id.replace('=','');
        let result = {};
        const https = require('https');
        https.get('https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(\"'+url+'\")&api-key=mAKH3rwpndhbclb6K6jjgWNdwu47WB77', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                let responseJson = JSON.parse(data).response.docs[0];
                try{
                    result["Title"] = responseJson.headline.main;
                    let date = responseJson.pub_date.split("T")[0];
                    result["DateMMFormat"] = date;
                    let dateF = new Date(date);
                    result["Date"] = dateF.getDate()+" "+dateF.toLocaleString('default', { month: 'long' })+" "+dateF.getFullYear();
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
                                result["Image"] = "https://www.nytimes.com/"+images[i].url;
                                imageFlag = false;
                            }
                        }
                        if (imageFlag) {
                            result["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                        }
                    }
                    catch (e) {
                        result["Image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                    }
                }
                catch (e) {
                    console.log("Error Occurred:", e);
                }
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
    https.get('https://content.guardianapis.com/search?q='+searchQuery+'&api-key=36744133-07b2-4428-9313-985c447fb3cb&show-blocks=all', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            let responseJson = JSON.parse(data).response.results;
            let num = 0;
            for (let r in responseJson) {
                try{
                    if (responseJson[r].webTitle !== '' && responseJson[r].sectionId !== '' && responseJson[r].webPublicationDate.split("T")[0] !== '' && responseJson[r].id !== '' && responseJson[r].webUrl !== ''){
                        let tempResult = {};
                        tempResult["Title"] = responseJson[r].webTitle;
                        tempResult["Section"] = responseJson[r].sectionId;
                        let imagesLength = responseJson[r].blocks.main.elements[0].assets.length;
                        if (imagesLength === 0) {
                            tempResult["Image"] = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
                        } else {
                            tempResult["Image"] = responseJson[r].blocks.main.elements[0].assets[imagesLength - 1].file;
                        }
                        tempResult["Source"] = "guardian";
                        tempResult["Date"] = responseJson[r].webPublicationDate.split("T")[0];
                        tempResult["id"] = responseJson[r].id;
                        tempResult["url"] = responseJson[r].webUrl;
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