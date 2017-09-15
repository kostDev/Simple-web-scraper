var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var dateObj = new Date();
const maxDays = 4;
const saveFileLink = "./sinoptik.txt";
const pageClassArr = ["bd1", "bd2", "bd3", "bd4", "bd5"];
//here a site for examle
// takes some info about weather
// my city : Kiev
const pageToVisit = "https://sinoptik.ua/погода-киев";

// obj info for current day
var dateInfo = {
  monthNow : dateObj.getUTCMonth() + 1, //months from 1-12
  dayNow : dateObj.getUTCDate(),
  yearNow : dateObj.getUTCFullYear(),
  getCurrentAddress : () => "/-"+this.yearNow+"-"+this.monthNow+"-"+this.dayNow,
  getFiveDaysAddresses: (index) => {
     return pageToVisit + "/" + dateInfo.yearNow + "-"+dateInfo.monthNow
                        +"-" + (dateInfo.dayNow + index);
  }
};

var arrReqInfo = () =>{
  console.log("Visiting page " + pageToVisit);
  fs.unlink(saveFileLink, (err)=>{
    if(!err) 
      console.log('update file: ' + saveFileLink.substring(2,saveFileLink.length));
  });

  for (var i = 0; i <= maxDays; i++) {
    request(dateInfo.getFiveDaysAddresses(i), (err, response, body)=>{
      if(err) console.log("Error: " + err);
      if(response.statusCode === 200){
        var $ = cheerio.load(body);
        //var siteTitle = $('title').text();
        // id => wrapper
        $("div#wrapper").each(function(index){
          var info  = $(this).find('div.rSide > table.weatherDetails').text().trim();
          // --------------------------------------------------------
          console.log("info: received" + info);
          fs.appendFileSync(saveFileLink, info);
        });
      }
    });
  }
}

arrReqInfo();


// request(pageToVisit, function(error, response, body) {
//    if(error) {
//      console.log("Error: " + error);
//    }
//    // Check status code (200 is HTTP OK)
//    console.log("Status code: " + response.statusCode);
//    if(response.statusCode === 200){
//      // Parse the document body
//      var $ = cheerio.load(body);
//      var siteTitle = $('title').text();
//      console.log("Page title:  " + siteTitle.substring(0,8)+"...");
//      //div#wrapper> div#content > div#leftCol > div#mainContentBlock > div#blockDays > div.tabsContent
//      $("div#wrapper").each(function( index ){
//     	var info = $(this).find('div.rSide > table.weatherDetails').text().trim();
//       var day  = $(this).find('div#bd1 > p.date').text().trim();
//       var month  = $(this).find('div#bd1 > p.month').text().trim();
//       // =====================
//       if(!info){
//         console.log("nothing =_= | check u code!");
//       }
//     	// delete txt if exist
//     	fs.unlink(saveFileLink,function(err){
//     		if(!err) console.log('update file: sinoptik.txt');
//     	});
//     	// create txt and add info
//     	fs.appendFileSync('sinoptik.txt', info);
//   	 });
//     }
// });