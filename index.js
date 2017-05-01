const express = require('express')
const Vision = require('@google-cloud/vision')
const request = require('request')
const app = express()
const requesting = require('request-promise')
const prettyjson = require('prettyjson')
const jsonFormat = require('json-format')

// const wineApiKey = require('./apikey').wineApiKey
// const snoothApiKey = require('./apikey').snoothApiKey
// const ipaddress = require('./apikey').ipaddress

process.env.WINEAPIKEY;
process.env.SNOOTHAPIKEY;
process.env>IPADDRESS;

//wine.com variables
const apipath = 'http://services.wine.com/api/beta2/service.svc/JSON/'
const resoure = 'catalog'
const parameters = 'search'
let wineterms = ['2014', 'tolosa', 'no', 'oak','chardonnay']

//snooth.com variables
const snoothVariables = {
  apipath: 'http://api.snooth.com/wines/?akey='
}

//google vision code
const VisionProjectId = 'winelist-165917'
const textinarray = []
const filepath = './list.jpg';


const visionClient = Vision({
  projectId: VisionProjectId
});



//google cloud
function Reading(fileName) {
  visionClient.detectText(fileName)
    .then((results) => {
     let detections = results[0][0];
     console.log('theres are detions', detections)
     return detections.split('\n')
     console.log('Text:', detections);
     //detections.forEach((text) => console.log(text));
   })
  .then(data => {
   return data.filter(filterWineNames)
  })
  .catch(console.log('err'))
}

//wine.com api

function bottleLookUp(urlpath){
 requesting(urlpath)
   .then(function(data){
    data = JSON.parse(data)
    let WineResults = data.Products.List
    //console.log(prettyjson.render(WineResults[0]))
    let parsedResults = WineResults.map(wine => OrganizeData(wine))
    console.log(parsedResults)
  })
  .catch(function(err) {
    console.log(err);
  })

}



//utility functions

function filterWineNames(element){
  return element.length > 5;
}

function OrganizeData(WineResults){
      return  {
      id: WineResults.Id,
      name: WineResults.Name,
      Region: WineResults.Appellation.Region.Name,
      Vineyard: WineResults.Vineyard.Name,
      Price: {
        max: WineResults.PriceMax,
        min: WineResults.PriceMin,
        Retail: WineResults.PriceRetail
      },
      tastingNotes: WineResults.ProductAttributes[0].Name,
      Reviews: {
        community: WineResults.Community.Reviews.HighestScore,
        general: WineResults.Ratings.HighestScore,
      }
    }

}

function searchBuilder(termsarray) {
  let terms = termsarray.join('+');
  let path = apipath + resoure + '?apikey=' + wineApiKey + '&' + parameters + '=' + terms
  return path
}



//function for snooth

function snoothLookUp(path){
  requesting(path)
    .then(function(data){
        console.log(data)
      //console.log(JSON.parse(data))
    })
}
//apipath: 'http://api.snooth.com/wines/?akey='+snoothApiKey+'&ip='+ipaddress+'&q=napa+cabernet&xp=30',

function snoothUrlBuilder(termsarray){
  let terms = termsarray.join('+');
  let path = snoothVariables.apipath + snoothApiKey + '&ip=' + ipaddress + '&=' + terms
  return path
}


//let urlpath = searchBuilder(array)

//bottleLookUp(searchBuilder(wineterms))
//snoothLookUp(snoothUrlBuilder(wineterms))


//console.log(Reading(filepath));



app.get('/', function (req,res){
  res.send('server running')
})

app.listen(8080, function() {
  console.log('serving running on 8080')
  })
