import React from 'react';
import './css/App.css'
import * as H from './Helper'

export default class CurrentWeather extends React.Component{
  constructor(props)
  {
    super(props)
    this.state = {
      locationTime: null
    }
  }

//Before Component renders timer runs at an interval of 1 second.
  componentDidMount = () =>
  {
    setInterval(this.timer,1000)
  }

//This function is called when the timer is set.
  timer = () =>
  {
    var ltime = null;
    try {
      ltime = H.getTimeZoneName(document.getElementById('lat').value,document.getElementById('lon').value)+' '+H.UnixTimeStampToTimeOnly(H.coordsToUnixTimeStamp(document.getElementById('lat').value,document.getElementById('lon').value),true);
    } catch (e) {

    } finally {

    }
    this.setState({locationTime:ltime})
  }

  //When the current weather info is gathered the results are used to create an object so current weather info can be accessed easily.
  GetWT_Current = () => {
    var json = this.props.json;
    if (json !== null && json.coord !== undefined) {
      var WT = {
        wt_id: json.weather[0].id,
        wt_lat: json.coord.lat,
        wt_lon: json.coord.lon,
        wt_cond: json.weather[0].main,
        wt_cond_descr: json.weather[0].description,
        wt_temp: json.main.temp,
        // wt_pressure: json.main.pressure,
        wt_humidity: json.main.humidity,
        // wt_temp_min: json.main.temp_min,
        // wt_temp_max: json.main.temp_max,
        // wt_sealevel: null,
        // wt_grndlevel: null,
        wt_rain: null,
        // wt_visib: json.visibility,
        wt_wind_speed: json.wind.speed,
        wt_wind_gust: json.wind.gust,
        wt_wind_deg: json.wind.deg,
        wt_clouds: json.clouds.all,
        wt_unixDateTime: json.dt,
        wt_convertedUnixDateOnly: H.UnixTimeStampToDateTime(json.dt,false),
        wt_placeName: json.name,
        wt_country: json.sys.country,
        wt_sunrise: json.sys.sunrise,
        wt_sunset: json.sys.sunset,
        wt_icon: json.weather[0].icon
      }
      // WT.wt_sealevel = json.main.sea_level === undefined ? null : json.main.sea_level;
      // WT.wt_grndlevel = json.main.grnd_level === undefined ? null : json.main.grnd_level;
      WT.wt_rain = json.rain === undefined ? null : json.rain['3h'];
      if(WT.wt_rain === null)
      {
        WT.wt_rain = json.rain === undefined ? null : json.rain['1h'];
      }
      return(WT);
    }
    return null;
  }

  //Prints the current weeather information from the current weather object from above function.
  Print = () =>
  {
    var WT_Cur = this.GetWT_Current();
    if (WT_Cur !== null)
    {
      var Lat = null;
      var Lon = null;
      var TempC = null;
      var TempF = null;
      var WindSpeed = null;
      var WindDeg = null;
      var RainP = null;
      var Descr = null;
      var gbFish = null;
      var Loc = null;
      Lat = WT_Cur.wt_lat;
      Lon = WT_Cur.wt_lon;
      TempC = WT_Cur.wt_temp;
      TempF = (TempC * 9/5) + 32;
      WindSpeed = WT_Cur.wt_wind_speed*2.237;
      Descr = WT_Cur.wt_cond_descr;
      // console.log(WT_Cur)
      if(WT_Cur.wt_rain === null || WT_Cur.wt_rain === undefined)
      {
        RainP = 0;
      }else {
        RainP = Number(WT_Cur.wt_rain).toFixed(2);
      }
      WindDeg = WT_Cur.wt_wind_deg;
      gbFish = this.SetFishingStatus(WT_Cur, H.WindDirCode(WindDeg));
      if(WindDeg !== undefined)
      {
        WindDeg = <span id="windDir">{WindDeg} &deg; {H.WindDirCode(WindDeg)} </span>
      }else {
        WindDeg = <span id="windDir"></span>
      }
      var outline1 = {
        textShadow: "rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.416147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px;",
        color: 'green',
        fontWeight: '900',
        letterSpacing: '2px',
        fontFamily: 'Arial'
      }
      var outline2 = {
        textShadow: "rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.416147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px;",
        color: 'red',
        fontWeight: '900',
        letterSpacing: '2px',
        fontFamily: 'Arial'
      }
      if(gbFish.includes("GOOD"))
      {
        gbFish = <h3 id="fishingStatus" style={outline1} >{gbFish}</h3>
      }else {
        gbFish = <h3 id="fishingStatus" style={outline2} >{gbFish}</h3>
      }
      const { getName } = require('country-list');
      if((WT_Cur.wt_country !== undefined) && (getName(WT_Cur.wt_country) !== undefined))
      {
        Loc = <h3 id="currCountryNP">{getName(WT_Cur.wt_country)}, {WT_Cur.wt_placeName}</h3>
      }
      WindSpeed = (WindSpeed/1.151).toFixed(1);
      var barbscalefile = "wind_speed_icons/" + this.getBarbscale(WindSpeed) + ".png";
      var icon = WT_Cur.wt_icon;
      var weatherWarning = ""
      if(icon == "11d" || icon == "11n")
      {
        weatherWarning = <div id="weatherWarning">Warning: Storm Approaching</div>
      }
      return(
        <div>
          <div className="row" >
      			<div className="columnThreeLayer">
      				<div className="oneColumn currentWeatherData">
      					<p id="currCond">{Descr.toUpperCase()}</p>
                {weatherWarning}
                <div className="currentIcon">
      					<img src={require('./resources/WeatherIcons/'+WT_Cur.wt_icon+'.svg')} width="200px" height="200px" style={{filter:'brightness(0) invert(1)'}} alt="error"/>
                </div>
      					{gbFish}
      				</div>
      			</div>
      			<div className="columnThreeLayer">
      				<div className="oneColumn currentWeatherData">
                <h2 id="currentDay">{H.UnixTimeStampToDateTime(H.coordsToUnixTimeStamp(this.props.lat,this.props.lon),false)}</h2>
                {Loc}
      					<p>{Lat}, {Lon}</p>
      					<p id="currTime">{this.state.locationTime}</p>

                <p><span id="currWthUpd">Last updated {H.UnixTimeStampToTimeOnly(WT_Cur.wt_unixDateTime,false)}</span></p>
      				</div>
      			</div>
      			<div className="columnThreeLayer">
      				<div className="oneColumn currentWeatherData">
      					<p id="currTemp">{TempC} &deg;C / {TempF.toFixed(2)} &deg;F</p>
      					<p id="windSpeed">{WindSpeed} knots, {WindDeg}</p>
                <p><img id="Currentbarbscale" src={require('./resources/'+barbscalefile)}/></p>
      					<p id="precip">{Descr.toUpperCase()}~ {RainP} mm</p>
      				</div>
      			</div>
      		</div>
        </div>
      );
      // <pre><h4 id="laterTodayHeader" >Later Today</h4></pre>
      // <div id="laterT"></div>
    }else {
      return null;
    }
  }


  //Gets the barbscale image file name by using the current windSpeed.
  getBarbscale = (windspeed) =>
  {
    windspeed = Math.round(Number(windspeed));
    if(windspeed == 0)
    {
      return 'barbscale_0';
    }
    if(windspeed >= 1 && windspeed <= 2)
    {
      return "barbscale_1-2";
    }
    var x = 3;
    while (x < 108) {
      if(windspeed >= x && windspeed <= x+4)
      {
        return "barbscale_" + x + "-" + Number(x+4);
      }
      x += 5;
    }
  }

  //Determies the fishing status by using the weather condition and the wind Direction.
  SetFishingStatus = (WT_Cur, Wind_Dir) =>{
    var gbFish = null;
    var id = WT_Cur.wt_id;
    var GoodwindDirs = ["NorthEast","East-NorthEast","East","East-SouthEast","SouthEast"]
    var weatherCondIds = [500, 501,800, 801]
    var windDir = this.findAttrInArr(GoodwindDirs, Wind_Dir);
    var weatherCond = this.findAttrInArr(weatherCondIds, id);
    if(weatherCond && windDir)
    {
      gbFish = 'GOOD TIME FOR FISHING';
    }else {
      gbFish = 'BAD TIME FOR FISHING';
    }
    return gbFish;
  }

  findAttrInArr = (arr, attr) => {
    for(var x in arr)
    {
      if(arr[x] === attr)
      {
        return true;
      }
    }
    return false;
  }

  render()
  {
    return(
      this.Print()
    );
  }
}
