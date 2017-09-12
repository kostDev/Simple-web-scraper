var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
//here a site for examle
// takes some info about weather
// my city : Kiev
var pageToVisit = "https://sinoptik.ua/погода-киев";

console.log("Visiting page " + pageToVisit);

request(pageToVisit, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
     console.log("Page title:  " + $('title').text());
     //div#wrapper> div#content > div#leftCol > div#mainContentBlock > div#blockDays > div.tabsContent
     $("div#wrapper").each(function( index ) {
    	var info = $(this).find('div.rSide > table.weatherDetails').text().trim();
    	console.log(info);
    	// delete txt if exist
    	fs.unlink("./sinoptik.txt",function(err){
    		if(!err) console.log('');
    	});
    	// create txt and add info
    	fs.appendFileSync('sinoptik.txt', info);
  	 });
    }
});