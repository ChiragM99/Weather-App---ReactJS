import React from 'react';

import { renderToString } from 'react-dom/server'
import './css/App.css'
import * as H from './Helper'

export default class DailyWeather extends React.Component{
  constructor(props) {
    super(props)
    this.day = 0
  }

  //When the dailt weather info is gathered the results are used to create an object so weather info can be accessed easily.
  //Returns an array of objects that represent each day of the week.
  //Each object has weather information for that particular day.
  GetWT_Daily = () => {
    if (this.props.json !== undefined)
    {
      var json = this.props.json;
      if (json !== null && json.city !== undefined) {
        var WT = {
          wt_lat: json.city.coord.lat,
          wt_lon: json.city.coord.lon,
          wt_placeName: json.city.name,
          wt_country: json.city.country,
          // wt_population: json.city.population,
          wt_list: json.list
        };
        var List = WT.wt_list;
        var Day = [];
        var Days = [];
        var dt_str = null;
        for(var t in List)
        {
          json = List[t];
          var WTd = {
            wt_id: json.weather[0].id,
            wt_cond: json.weather[0].main,
            wt_cond_descr: json.weather[0].description,
            wt_temp: json.main.temp,
            wt_pressure: json.main.pressure,
            wt_humidity: json.main.humidity,
            wt_temp_min: json.main.temp_min,
            wt_temp_max: json.main.temp_max,
            wt_sealevel: null,
            wt_grndlevel: null,
            wt_rain: null,
            wt_visib: json.visibility,
            wt_wind_speed: json.wind.speed,
            wt_wind_deg: json.wind.deg,
            wt_wind_gust: json.wind.gust,
            wt_clouds: json.clouds.all,
            wt_unixDateTime: json.dt,
            wt_convertedUnixDateOnly: null,
            wt_convertedUnixTimeOnly: null,
            wt_icon:json.weather[0].icon
          }
          WTd.wt_sealevel = json.main.sea_level === undefined ? null : json.main.sea_level;
          WTd.wt_grndlevel = json.main.grnd_level === undefined ? null : json.main.grnd_level;
          WTd.wt_rain = json.rain === undefined ? null : json.rain['3h'];
          if(WTd.wt_rain === null)
          {
            WT.wt_rain = json.rain === undefined ? null : json.rain['1h'];
          }
          WTd.wt_convertedUnixDateOnly = H.UnixTimeStampToDateTime(WTd.wt_unixDateTime,false);
          WTd.wt_convertedUnixTimeOnly = H.UnixTimeStampToDateTime(WTd.wt_unixDateTime,true).replace(WTd.wt_convertedUnixDateOnly+' ','');
          var unixDT = WTd.wt_convertedUnixDateOnly;
          if(dt_str === unixDT)
          {
            Day.push(WTd);
          }else
          {
            dt_str = unixDT;
            Days.push(Day);
            Day = [];
            Day.push(WTd);
          }
          if (Number(t)+1 === List.length)
          {
            Days.push(Day);
          }
        }
        Days.splice(0,1);
        var newDays = [];
        for(var d in Days)
        {
          var TempWTd = {
            wt_lat: WT.wt_lat,
            wt_lon: WT.wt_lon,
            wt_placeName: WT.wt_placeName,
            wt_country: WT.wt_country,
            wt_temp: null,
            // wt_pressure: null,
            wt_humidity: null,
            // wt_temp_min: null,
            // wt_temp_max: null,
            // wt_sealevel: null,
            // wt_grndlevel: null,
            wt_rain: null,
            // wt_visib: null,
            wt_wind_speed: null,
            wt_wind_deg: null,
            wt_wind_gust: null,
            wt_clouds: null,
            wt_unixDateTime: null,
            wt_convertedUnixDateOnly: null,
            wt_precip: null,
            wt_icon: null
          }
          Day = Days[d];
          TempWTd.wt_convertedUnixDateOnly = Day[0].wt_convertedUnixDateOnly;
          TempWTd.wt_unixDateTime = Day[0].wt_unixDateTime;
          TempWTd.wt_icon = Day[0].wt_icon;
          var freqCount = [];
          // console.log('Day:'+d)
          for(var dayTime in Day)
          {
            var condIndex = this.LinearSearchFreq(freqCount,Day[dayTime].wt_id);
            if (condIndex !== -1)
            {
              freqCount[condIndex].time.push(Day[dayTime].wt_convertedUnixTimeOnly);
            }else {
              freqCount.push({id: Day[dayTime].wt_id, descr:Day[dayTime].wt_cond_descr, time:[Day[dayTime].wt_convertedUnixTimeOnly]});
            }
            TempWTd.wt_temp += Day[dayTime].wt_temp;
            // TempWTd.wt_pressure += Day[dayTime].wt_pressure;
            TempWTd.wt_humidity += Day[dayTime].wt_humidity;
            // TempWTd.wt_temp_min += Day[dayTime].wt_temp_min;
            // TempWTd.wt_temp_max += Day[dayTime].wt_temp_max;
            // TempWTd.wt_sealevel += Day[dayTime].wt_sealevel;
            // TempWTd.wt_grndlevel += Day[dayTime].wt_grndlevel;
            // console.log(Day[dayTime].wt_rain)
            if(Day[dayTime].wt_rain !== undefined)
            {
              TempWTd.wt_rain += Day[dayTime].wt_rain;
            }
            // TempWTd.wt_visib += Day[dayTime].wt_visib;
            TempWTd.wt_wind_speed += Day[dayTime].wt_wind_speed;
            TempWTd.wt_wind_deg += Day[dayTime].wt_wind_deg;
            TempWTd.wt_wind_gust += Day[dayTime].wt_wind_gust;
            TempWTd.wt_clouds += Day[dayTime].wt_clouds;
          }
          TempWTd.wt_temp /= Day.length;
          // TempWTd.wt_pressure /= Day.length;
          TempWTd.wt_humidity /= Day.length;
          // TempWTd.wt_temp_min /= Day.length;
          // TempWTd.wt_temp_max /= Day.length;
          // TempWTd.wt_sealevel /= Day.length;
          // TempWTd.wt_grndlevel /= Day.length;
          TempWTd.wt_rain /= Day.length;
          // TempWTd.wt_visib /= Day.length;
          TempWTd.wt_wind_speed /= Day.length;
          TempWTd.wt_wind_deg /= Day.length;
          TempWTd.wt_clouds /= Day.length;
          TempWTd.wt_temp = Math.round(TempWTd.wt_temp*100)/100;
          // TempWTd.wt_pressure= Math.round(TempWTd.wt_pressure*100)/100;
          TempWTd.wt_humidity= Math.round(TempWTd.wt_humidity*100)/100;
          // TempWTd.wt_temp_min= Math.round(TempWTd.wt_temp_min*100)/100;
          // TempWTd.wt_temp_max= Math.round(TempWTd.wt_temp_max*100)/100;
          // TempWTd.wt_sealevel= Math.round(TempWTd.wt_sealevel*100)/100;
          // TempWTd.wt_grndlevel= Math.round(TempWTd.wt_grndlevel*100)/100;
          TempWTd.wt_rain= TempWTd.wt_rain.toFixed(2);
          // TempWTd.wt_visib= Math.round(TempWTd.wt_visib*100)/100;
          TempWTd.wt_wind_speed= Math.round(TempWTd.wt_wind_speed*100)/100;
          TempWTd.wt_wind_deg= Math.round(TempWTd.wt_wind_deg*100)/100;
          TempWTd.wt_wind_gust= Math.round(TempWTd.wt_wind_gust*100)/100;
          TempWTd.wt_clouds= Math.round(TempWTd.wt_clouds*100)/100;
          TempWTd.wt_precip = freqCount;
          // console.log('AVG:'+TempWTd.wt_rain)
          newDays.push(TempWTd);
        }
        return newDays;
      }
    }
    return null;
  }

  LinearSearchFreq = (freqCount, inf) =>
  {
    for (var i in freqCount)
    {
      if(freqCount[i].id === inf)
      {
        return i;
      }
    }
    return -1;
  }

  //Prints the attributes of the objects.

  PrintDay = () => {
    var WT = this.GetWT_Daily();
    if(WT !== null)
    {
      var increase = this.props.increase
      var lat = this.props.lat
      var lon = this.props.lon
      if(WT === null)
      {
        document.getElementById('getCurrentLocLink').style.display ='none';
        document.getElementById('day').innerHTML = 'Weather Service Temporarily Unavailable';
        document.getElementById('nextDaybtn').style.display ='none';
        return
      }else {
        document.getElementById('getCurrentLocLink').style.display ='';
        document.getElementById('nextDaybtn').style.display ='';
      }
      if(increase === 1)
      {
        if(this.day === WT.length-1)
        {
          // increase = false
          document.getElementById('nextDaybtn').disabled = true
          document.getElementById('prevDaybtn').disabled = false
        }else {
          document.getElementById('nextDaybtn').disabled = false
          document.getElementById('prevDaybtn').disabled = false
          this.day+=1
        }
      }else if(increase === -1)
      {
        if(this.day-1 > 0)
        {
          document.getElementById('prevDaybtn').disabled = false
          document.getElementById('nextDaybtn').disabled = false
          this.day-=1
        }else {
          document.getElementById('prevDaybtn').disabled = true
          document.getElementById('nextDaybtn').disabled = false
          increase = false
        }
        // else {
        //   this.day = WT.length-1
        // }
      }else if (increase === 0) {
        increase = false;
      }
      var Arr = [];
      var Arr2 =[];
      var todayIndx = 0;
      var todayDone = false;
      for(var d in WT)
      {
        var next = WT[d].wt_convertedUnixDateOnly === H.UnixTimeStampToDateTime(H.NextDaycoordsToUnixTimeStamp(lat,lon));
        var today = WT[d].wt_convertedUnixDateOnly === H.UnixTimeStampToDateTime(H.coordsToUnixTimeStamp(lat,lon));
        if(today)
        {
          todayIndx = d;
          todayDone = true
        }
        if(this.printDayCreate(WT, d,increase,next,Arr))
        {
          break;
        }
      }
      // if(todayDone)
      // {
      //   document.getElementById('laterTodayHeader').style.display = '';
      //   this.printLaterTodayCreate(WT,todayIndx,Arr2)
      //   document.getElementById("laterT").innerHTML = Arr2.join('');
      // }else {
      //   document.getElementById('laterTodayHeader').style.display = 'none';
      // }
      return(
        <div dangerouslySetInnerHTML={{__html: Arr.join('')}}>
        </div>
      );
    }else {
      return null
    }
  }

  //Gets all the weather conditions of the days.
  printDayCreate = (WT,d,increase,next,Arr) =>
  {
    var Arr2 = []
    if ((increase && (this.day === Number(d))) || (!increase && next))
    {
      if(!increase && next)
      {
        this.day = Number(d);
      }
      for (var index in WT[d])
      {
        if (index === 'wt_precip')
        {
          var precipArr = WT[d][index];
          for (var cond in precipArr)
          {
            var descr = precipArr[cond].descr;
            var stTime = '';
            for (var t in precipArr[cond].time)
            {
              stTime += precipArr[cond].time[t] + ', ';
            }
            stTime = stTime.substring(0, stTime.length - 2);

            Arr2.push(renderToString(<div>{descr}: {stTime}</div>))
          }
        }
      }
      var percips = Arr2.join('');
      var results = this.getDay(WT, d, percips);
      Arr.push(renderToString(results))
      return true;
    }
    return false
  }

  //Retuns the weather information for the day specified from array WT.
  getDay = (WT, d ,percips) =>
  {
    console.log('./resources/WeatherIcons/' + WT[d].wt_icon+ '.svg');
    return(
      <div>
        <div className="row">
          <div class="twoColumn">
            <div id="forcastInfo">
              <p>{WT[d].wt_convertedUnixDateOnly}</p>
              <p>{WT[d].wt_temp}&deg;C / {((WT[d].wt_temp * 9/5) + 32).toFixed(2)}&deg;F</p>
              <p>{((WT[d].wt_wind_speed*2.237)/1.151).toFixed(1)} knots, {WT[d].wt_wind_deg}&deg; {H.WindDirCode(WT[d].wt_wind_deg)}</p>
              <p>{Number(WT[d].wt_rain).toFixed(2)} mm</p>
            </div>
          </div>
          <div class="twoColumn">
            <div id="forcastInfo2">
              <p dangerouslySetInnerHTML={{__html: percips}}></p>
            </div>
            <div className={"forecastIcon"}>
              <img src={require('./resources/WeatherIcons/' + WT[d].wt_icon+ '.svg')} width="200px" height="200px" style={{filter:'brightness(0) invert(1)'}} alt="error"/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // printLaterTodayCreate = (WT,d,Arr) =>
  // {
  //
  //   Arr.push(renderToString(<p>Temperature: {WT[d].wt_temp}&deg;C / {((WT[d].wt_temp * 9/5) + 32).toFixed(2)}&deg;F</p>));
  //   Arr.push(renderToString(<p>Precipitation: {Number(WT[d].wt_rain).toFixed(2)} mm</p>));
  //   Arr.push(renderToString(<p>Wind Speed: {((WT[d].wt_wind_speed*2.237)/1.151).toFixed(4)} knots</p>));
  //   Arr.push(renderToString(<p>Wind Direction: {WT[d].wt_wind_deg}&deg; {H.WindDirCode(WT[d].wt_wind_deg)}</p>));
  //   for (var index in WT[d])
  //   {
  //     if (index === 'wt_precip')
  //     {
  //       var precipArr = WT[d][index];
  //       for (var cond in precipArr)
  //       {
  //         var descr = precipArr[cond].descr;
  //         var stTime = '';
  //         for (var t in precipArr[cond].time)
  //         {
  //           stTime += precipArr[cond].time[t] + ', ';
  //         }
  //         stTime = stTime.substring(0, stTime.length - 2);
  //         Arr.push(renderToString(<p> {descr}: {stTime}</p>))
  //       }
  //     }
  //   }
  //
  // }

  render()
  {
    return(
      <div>
        {this.PrintDay()}
      </div>
    );
  }
}
