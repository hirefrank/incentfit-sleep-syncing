/***********************************************************************************
 * INCENTFIT SLEEP TRACKING
 * ---
 * Author: Frank Harris (frank@hirefrank.com)
 * Initial Date: Mar 2, 2019
 * MIT License
 *
 * This script records the user's sleep duration to Incenfit on an ongoing basis. 
 * Currently, this generates a random sleep duration but the script could be extended
 * to support an api call to a sleep tracking system or external source (e.g. spreadsheet)
 * Inspired by @dholdren's incentsleep. ;)
 *
 * property name                  value
 * -------------                  -----
 * cookie                         the user's webappincentfitcom incentfit.com cookie
 * hour_of_day (optional)         triggers the script at n hour of day (12)
 *
 * Instructions:
 * 1. Create a new Google App Script (https://script.google.com/home/my) project 
 *    with the contents of this script.
 * 2. Create cookie property and any other desired properties from above. 
 *    (File > Project properties > Script properties)
 * 3. Run the setup function to configure the script to run daily. 
 *    (Run > Run function > setup)
 * 4. Enable Stackdriver Logging (View > Stackdriver Logging). OPTIONAL
 * 
 * More info:
 * https://github.com/hirefrank/incentfit-sleep-tracking/blob/master/README.md
 ***********************************************************************************/

/**
 * Sets up the time-based trigger and runs the initial sync.
 * ---
 * This should only be run once. Running it more frequently will create multiple
 * triggers. To see the project's triggers: Edit > Current project's triggers
 */

function setup() {
  if (checkCookie() == true) {
    // if no property override, use the default: 12
    const HOUR_OF_DAY = PropertiesService.getScriptProperties().getProperty('hour_of_day') || 12;
    
    // create the trigger
    // runs at noon in the timezone of the script
    ScriptApp.newTrigger("recordSleep")
      .timeBased()
      .atHour(HOUR_OF_DAY)
      .everyDays(1)
      .create();
    
    // run the initial sync
    recordSleep();
  }
}

/**
 * Checks to make sure the cookie script property has been set properly
 */

function checkCookie() {
  var c = false;
  // verifies the property exist
  if (PropertiesService.getScriptProperties().getProperty('cookie') == null) {
    logIt('Cookie script property does not exist.');
  } else {
    var c = PropertiesService.getScriptProperties().getProperty('cookie'); 
    var s = 'webappincentfitcom=';
    // verifies the property contain 'webappincentfitcom='
    // todo: should check to make sure it begins with this string
    if (c.match(s)) {
      c = true;
    } else {
      // prepends the s string to the property
      PropertiesService.getScriptProperties().setProperty('cookie', s + c);
      c = true;
    }
  }
  return c;
}

/**
 * Record multiple days of sleep tracking
 */

function bulkRecordSleep() {
  // format is YYYY, MM, DD; 00 is Jan
  var start_date = new Date(2019,00,01); // Jan 1, 2019
  var end_date = new Date(2019,02,01); // March 1, 2019
  
  var d = start_date;
  while (d <= end_date) {
    recordSleep(d);
    Utilities.sleep(5000);
    d.setDate(d.getDate() + 1);
  }  
}

/**
 * Record sleep tracking in Incentfit
 */

function recordSleep(date) {
  // if date isn't passed in, use the current date
  var date = date || new Date();
  
  // randomly return hours slept between max and min
  // you could replace this with an api call to a 
  // sleep tracking system or external source (e.g. spreadsheet)
  var sleep_max = 8;
  var sleep_min = 6;
  var sleep_hours = Math.floor(Math.random() * (sleep_max - sleep_min) ) + sleep_min;
  
  // assumes today is the activity date
  // you could replace this with an api call to a 
  // sleep tracking system or external source (e.g. spreadsheet)
  var activity_date = formatDate(date);
  
  var params = {                                                                 
    'ts': Date.now(),
    'svc': 'AddActivity%5CAddReportActivity',
    'timezone': 300, // nyc timezone
    'dst': false,
    'hasdst': true,
    'activityTypeID': 74, // the ID for sleep tracking
    'whenOccur': activity_date,
    'IPATS[0][BaseUnitID]': 49, // hours
    'IPATS[0][Value]': sleep_hours,
    'IPATS[0][Title]': '',
  }

  // add sleep activity 
  incentfit(params);
}

/**
 * Makes an authenticated Incentfit request and returns the response
 * ---
 * Accepts params for activity date, type, value, etc. Requires authentication
 * via COOKIE variable declared at the top of the script.
 */

function incentfit(params) {
  const BASE_URL = 'https://webapp.incentfit.com/ajax/ironhide.php?';
  const COOKIE = PropertiesService.getScriptProperties().getProperty('cookie');

  // assemble the header
  // spoof user-agent, origin, referer
  var headers = {                                                              
    'Cookie': COOKIE,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',
    'Origin': 'https://webapp.incentfit.com',
    'Referer': 'https://webapp.incentfit.com/add-activity/report-activity?activitytypeid=74'
  };
  
  // assembles the options
  // sets the headers, form data, method
  var options = {                                                                                                                
    'headers': headers,                                                                                                 
    'method': 'get',                                                          
    'muteHttpExceptions': true,
  };
  
  // constructs the url, makes the request, returns the response
  var path = Object.keys(params).map(function(key) { return encodeURIComponent(key) + '=' + params[key] }).join('&');
  var url = BASE_URL + path;
  
  var response = UrlFetchApp.fetch(url, options);
  logIt(response);
}

/**
 * Returns the date in an Incenfit friendly format, e.g. YYYY-MM-DD
 */

function formatDate(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

/**
 * Logs locally and in Stackdriver for debugging
 */

function logIt(msg) {
  Logger.log(msg);
  console.log(msg); // Stackdriver
}