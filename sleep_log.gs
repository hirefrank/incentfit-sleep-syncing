function massage() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // in sheet
  // split the date from the time
  var sheet = ss.getSheetByName('in');
  var last_row = getLastNonEmptyRow(sheet);
  var copy = sheet.getRange(1,2,1,2);
  var target = sheet.getRange(2,2,last_row-1,2);
  copy.copyTo(target);
  
  // out sheet
  // split the date from the time
  var sheet = ss.getSheetByName('out');
  var last_row = getLastNonEmptyRow(sheet);
  var copy = sheet.getRange(1,2,1,2);
  var target = sheet.getRange(2,2,last_row-1,2);
  copy.copyTo(target);

  // log sheet
  var sheet = ss.getSheetByName('log');
  var last_row = getLastNonEmptyRow(sheet);
  
  // find the latest time got into bed
  var copy = sheet.getRange(2,2,1,1);
  var target = sheet.getRange(3,2,last_row-2,1);
  copy.copyTo(target);

  // find the earliest time got out of bed
  var copy = sheet.getRange(2,4,1,1);
  var target = sheet.getRange(3,4,last_row-2,1);
  copy.copyTo(target);
  
  // calculate time in bed
  var copy = sheet.getRange(2,5,1,4);
  var target = sheet.getRange(3,5,last_row-2,4);
  copy.copyTo(target);
}

function getSleepHours(date) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('log');
  var last_row = getLastNonEmptyRow(sheet);
  
  var range = sheet.getRange(2, 3, last_row-1,6);
  var values = (range.getValues()).reverse();
  
  for (var i = 0; i < values.length; i++) {
    var d = (values[i][0]).toString();
    var h = values[i][5];
    if (d.indexOf(date) > -1 && h > 0) {
      return h;
    } else {
      return 7; 
    }
  }
}

function getLastNonEmptyRow(sheet) {
  var range = sheet.getRange(1, 1, sheet.getLastRow());
  var values = range.getValues();
  
  for (var i = 0; i < values.length; i++) {
    if (values[i] == '') {
      return i;
    }
  }
}