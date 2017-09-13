var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');


//here a site for examle
// takes some info about weather
// my city : Kiev
var pageToVisit = "https://sinoptik.ua/погода-киев";

var dateObj = new Date();
var monthNow = dateObj.getUTCMonth() + 1; //months from 1-12
var dayNow = dateObj.getUTCDate();
var yearNow = dateObj.getUTCFullYear();
var address = "/-"+yearNow+"-"+monthNow+"-"+dayNow;
// dn = getDayNow


function getDays(dayNow){
  var d = [];
  for (var i = 0; i <= 4; i++) {
      d[i] = dayNow + i;
      console.log(d[i]);
  }
  return d;
}

var days = getDays(dayNow);

function getAddresses(page, days){
  var arr = [];
  for (var i = 0; i < days.length; i++) {
    arr[i] = page + "/" + yearNow + "-"+monthNow +"-" +days[i];
    console.log(arr[i]);
  }
  return arr;
}


var addresses = getAddresses(pageToVisit, days);


console.log("Visiting page " + pageToVisit);

request(pageToVisit, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200){
     // Parse the document body
     var $ = cheerio.load(body);
     console.log("Page title:  " + $('title').text());
     //div#wrapper> div#content > div#leftCol > div#mainContentBlock > div#blockDays > div.tabsContent
     $("div#wrapper").each(function( index ){
    	var info = $(this).find('div.rSide > table.weatherDetails').text().trim();
      var day  = $(this).find('div#bd1 > p.date').text().trim();
      var month  = $(this).find('div#bd1 > p.month').text().trim();

      // =====================
      console.log(day+' '+ month + "\n" + info);
    	// delete txt if exist
    	fs.unlink("./sinoptik.txt",function(err){
    		if(!err) console.log('');
    	});
    	// create txt and add info
    	fs.appendFileSync('sinoptik.txt', info);
  	 });
    }
});