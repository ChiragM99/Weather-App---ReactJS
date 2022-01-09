//Converts unix time stamp to date time in string format.
export function UnixTimeStampToDateTime(unix, time) {
  var date = new Date(unix*1000);
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  var day = days[date.getDay()];
  var month = months[date.getMonth()];
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var formattedTime = day + ' '+getZeroFrontDigit(date.getDate())+' ' + month;
  if( time === true){
    formattedTime += ' ' + getZeroFrontDigit(hours) + ':' + getZeroFrontDigit(minutes.substr(-2));
  }
  return formattedTime;
}

//Converts unix time stamp to time/seconds in string format.
export function UnixTimeStampToTimeOnly(unix, sec) {
  var date = new Date(unix*1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var formattedTime = getZeroFrontDigit(hours) + ':' + getZeroFrontDigit(minutes.substr(-2))
  if(sec)
  {
    var seconds = "0" + date.getSeconds();
    formattedTime += ':' + getZeroFrontDigit(seconds.substr(-2));
  }
  return formattedTime;
}

//Converts unix time stamp to full date including time in string format.
export function UnixTimeStampToDateTimeWSec(unix, time) {
  var date = new Date(unix*1000);
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  var day = days[date.getDay()];
  var month = months[date.getMonth()];
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var formattedTime = day + ' '+getZeroFrontDigit(date.getDate())+' ' + month;
  if( time === true){
    formattedTime += ' ' +date.getFullYear() + ', ' + getZeroFrontDigit(hours) + ':' + getZeroFrontDigit(minutes.substr(-2)) + ':' + getZeroFrontDigit(seconds.substr(-2));
  }
  return formattedTime;
}

//Returns unix time stamp from a particular coordinates.
export function coordsToUnixTimeStamp(lat,lng)
{
  const {
    findTimeZone, getZonedTime
  } = require('timezone-support')
  var unix = getZonedTime(new Date(),findTimeZone(getTimeZoneName(lat,lng)));
  var d =  unix.year + '-' +getZeroFrontDigit(unix.month) + '-' + getZeroFrontDigit(unix.day)+ 'T' + getZeroFrontDigit(unix.hours) + ':'+ getZeroFrontDigit(unix.minutes) + ':' + getZeroFrontDigit(unix.seconds)
  return new Date(d)/1000;
}

//Returns unix time stamp for the next day time from the coordinates.
export function NextDaycoordsToUnixTimeStamp(lat,lng)
{
  const {
    findTimeZone, getZonedTime
  } = require('timezone-support')
  var unix = getZonedTime(new Date(),findTimeZone(getTimeZoneName(lat,lng)));
  var d =  unix.year + '-' +getZeroFrontDigit(unix.month) + '-' + getZeroFrontDigit(unix.day)+ 'T' + getZeroFrontDigit(unix.hours) + ':'+ getZeroFrontDigit(unix.minutes) + ':' + getZeroFrontDigit(unix.seconds)
  var ndate =  new Date(d);
  ndate.setDate(ndate.getDate()+1);
  return ndate/1000;
}

// places numbers 0 in front of a digit.
export function getZeroFrontDigit(numb)
{
  return ((Number(numb) >= 0) && (Number(numb) <= 9)) ? '0'+ Number(numb) : Number(numb)
}

// Returns the name of the time zone of a particular coordinates.
export function getTimeZoneName(lat,lon)
{
  var tzlookup = require("tz-lookup");
  return tzlookup(lat, lon);
}

// Returns the wind Direction in words by using the wind Direction angle.
export function WindDirCode(WindDegr)
{
  // var wind_dirCs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"];
  var wind_dirCs = ["North","North-NorthEast","NorthEast","East-NorthEast","East","East-SouthEast","SouthEast","South-SouthEast","South","South-SouthWest","SouthWest","West-SouthWest","West","West-NorthWest","NorthWest","North-NorthWest","North"];
  var i = Number(WindDegr)%360
  i = Math.round(i/ 22.5,0)+1
  return wind_dirCs[i];
}

//To load a javascript file from a location.

export function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}
