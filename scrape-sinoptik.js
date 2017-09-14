var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var dateObj = new Date();

//here a site for examle
// takes some info about weather
// my city : Kiev
var pageToVisit = "https://sinoptik.ua/погода-киев";
console.log("Visiting page " + pageToVisit);
// obj info for current day
var dateInfo = {
  monthNow : dateObj.getUTCMonth() + 1, //months from 1-12
  dayNow : dateObj.getUTCDate(),
  yearNow : dateObj.getUTCFullYear(),
  getCurrentAddress : () => "/-"+this.yearNow+"-"+this.monthNow+"-"+this.dayNow,
  getFiveDaysAddresses: () => {
    var arr = [];
    // for 5 addresses
    var maxLength = 4;
    for(var i = 0; i <= maxLength; i++){
      arr[i] = pageToVisit + "/" + dateInfo.yearNow + "-"+dateInfo.monthNow +"-" + (dateInfo.dayNow + i);
      console.log(arr[i]);
    }
    return arr;
  }
};
//console.log(dateInfo.getCurrentAddress());
var addresses = dateInfo.getFiveDaysAddresses();

request(pageToVisit, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200){
     // Parse the document body
     var $ = cheerio.load(body);
     var siteTitle = $('title').text();
     console.log("Page title:  " + siteTitle.substring(0,8)+"...");
     //div#wrapper> div#content > div#leftCol > div#mainContentBlock > div#blockDays > div.tabsContent
     $("div#wrapper").each(function( index ){
    	var info = $(this).find('div.rSide > table.weatherDetails').text().trim();
      var day  = $(this).find('div#bd1 > p.date').text().trim();
      var month  = $(this).find('div#bd1 > p.month').text().trim();
      // =====================
      if(!info){
        console.log("nothing =_= | check u code!");
      }
    	// delete txt if exist
    	fs.unlink("./sinoptik.txt",function(err){
    		if(!err) console.log('update file: sinoptik.txt');
    	});
    	// create txt and add info
    	fs.appendFileSync('sinoptik.txt', info);
  	 });
    }
});