import React from 'react';
import ReactDOM from 'react-dom';
import './css/App.css'
import CoordinatesInputBoxes from './CoordinatesInputBoxes.js'
import GetCurrentLocationLink from './GetCurrentLocationLink.js'
import GoogleMaps from './GoogleMaps.js'
import LocalTime from './LocalTime.js'
import DailyWeather from './DailyWeather.js'
import CurrentWeather from './CurrentWeather.js'
import * as H from './Helper'
import './css/Desktop.css'
import './css/Tablet.css'
import './css/Mobile.css'
import logo from './resources/logoimg.png'

class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      lat:0,
      lon:0,
      JSONcurrent:null,
      JSONdaily:null,
      currentWeather: null,
      dailyWeather:null,
      searched: false,
      initialize:false,
    }
  }

  /*Getting the default coordinates by calling the function below.*/
  componentDidMount = () =>
  {
    this.GetDefaultCountryAPI()
  }

  GetCurrentAPI = () => {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+this.state.lat+'&lon='+this.state.lon+'&units=metric&appid=28f91d5f5c4f06562b48743cf25b3e55')
    .then(results => results.json())
    .then(results => this.FetchedCurrentApi(results));
  }

  FetchedCurrentApi = (results) =>
  {
    if(results.cod === 200)
    {
      this.setState({JSONcurrent:results})
      this.printCurrent()
      this.GetDailyAPI()
    }else {
      document.getElementById('day').innerHTML = '<div style="margin-top:20px;">'+results.message+'</div>'
      document.getElementById('prevDaybtn').style.display = 'none'
      document.getElementById('nextDaybtn').style.display = 'none'
      document.getElementById('getCurrentLocLink').style.display = 'none'
    }
    this.setState({initialize:true})
  }

  printCurrent = (lat,lon) =>
  {
      var Arr = []
      Arr.push(<CurrentWeather json={this.state.JSONcurrent} lat={this.state.lat} lon={this.state.lon}></CurrentWeather>)
      this.setState({currentWeather:Arr})
  }

  GetDailyAPI = () => {
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+this.state.lat+'&lon='+this.state.lon+'&units=metric&appid=28f91d5f5c4f06562b48743cf25b3e55')
    .then(results => results.json())
    .then(results => this.FetchedDailyApi(results));
  }

  FetchedDailyApi = (results) =>
  {
    this.setState({JSONdaily:results})
    this.printDay(0)
  }

  printDay = (increase) =>
  {
    var Arr = []
    Arr.push(<DailyWeather increase={increase} json={this.state.JSONdaily} lat={this.state.lat} lon={this.state.lon}></DailyWeather>)
    this.setState({dailyWeather:Arr})
  }

  /*Getting the default longitude and latitude of a users country. Sets the gathered result to the lat and lon variable states. */
  GetDefaultCountryAPI = () => {
    fetch('https://geoip-db.com/json/')
    .then(results => results.json())
    .then((results) => this.FetchedDefaultCountry(results));
  }

  FetchedDefaultCountry = (results) => {
    var lat = results.latitude;
    var lon = results.longitude;
    this.setState({lat:lat,lon:lon})
    this.clickHandle()
  }

  PrintNextDayHandler = (event) => {
    this.printDay(1);
  }

  PrintPrevDayHandler = (event) => {
    this.printDay(-1);
  }

  ClearEvent = (event) => {
    // this.cntTimer = 0;
    // clearInterval(this.interval);
    // var weatherDiv = document.getElementById("weatherInf");
    // weatherDiv.style.display = 'none';
    // var latINput = document.getElementById("lat");
    // latINput.value = '';
    // var lonINput = document.getElementById("lon");
    // lonINput.value = '';
    // if (this.marker !== false)
    // {
    //   this.marker.setMap(null);
    //   this.marker = false;
    // }
    // this.map.setZoom(2.2);
    // this.infoWinClosed = true;
    // this.infoWin = null;
    // this.map.setCenter({lat:0,lng:0})
    this.GetDefaultCountryAPI();
  }

  exitFullS = (event) => {
    this.MapToggle();
  }

  MapToggle = (event) => {
    //window.location.href = '#map';
    var exitFullBtn = document.getElementById("exitFullbtn");
    exitFullBtn.style.display = exitFullBtn.style.display === 'none' ? '' : 'none';
    var mapDiv = document.getElementById("map");
    mapDiv.style.display = mapDiv.style.display === 'none' ? '' : 'none';
    var CompsDiv = document.getElementById("comps");
    CompsDiv.style.display = CompsDiv.style.display === 'none' ? '' : 'none';
  }

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.clickHandle();
    }
  }

//Stops the timer and sets the lon and lat states. Does not display weather results while function is active.
  handleChange = (event) => {
    clearInterval(this.interval)
    var weatherDiv = document.getElementById("weatherInf");
    weatherDiv.style.display = 'none';
    var dWeather = document.getElementById("dWeather");
    dWeather.style.display = 'none';
    this.setState({lat:document.getElementById("lat").value})
    this.setState({lon:document.getElementById("lon").value})
  }

  positionSet = (position) => {
    this.setState({lat:position.coords.latitude,lon:position.coords.longitude})
    // document.getElementById("lat").value = position.coords.latitude;
    // document.getElementById("lon").value = position.coords.longitude;
    this.clickHandle();
  }

  markerLocation = (currentLoc) =>
  {
    this.setState({lat:currentLoc.lat()})
    this.setState({lon:currentLoc.lng()})
    this.GetCurrentAPI(this.state.lat,this.state.lon);
    var weatherDiv = document.getElementById("weatherInf");
    weatherDiv.style.display = '';
    var dWeather = document.getElementById("dWeather");
    dWeather.style.display = '';
  }

  clickHandle = (event) =>
  {
    try {
      if (!document.getElementById('lat').value || !document.getElementById('lon').value)
      {
        // if (navigator.geolocation) {
        //   navigator.geolocation.getCurrentPosition(this.positionSet);
        // }
        this.GetDefaultCountryAPI();
        return;
      }
      var lati = this.state.lat;
      var longi = this.state.lon;
      if(longi <= 180 && longi >= -180 && lati >= -85 && lati <= 85)
      {
        this.day= 0
        this.GetCurrentAPI(lati,longi);
        var weatherDiv = document.getElementById("weatherInf");
        weatherDiv.style.display = '';
        var dWeather = document.getElementById("dWeather");
        dWeather.style.display = '';
        // this.setState({lat:this.state.lat,lon:this.state.lon})
        this.setState({searched:true})
      }
    } catch (e) {
    } finally {

    }
  }

  SetSearchedOFF = () =>{
    this.setState({searched:false})
  }

  setInitializeOFF = () =>{
    this.setState({initialize:false})
  }

  render = () =>
  {
    const exitFullSStyle = {
       position: 'absolute',
       top: 10,
       left: 10,
       zIndex: 1,
       fontSize:'25pt',
       padding: '10px 20px 10px 20px',
       display: 'none'
    }

    //Sets the background to run a video file.
    //Displays the current time and the application logo.
    //Displays the coordinate input boxes and sets the coordiante's as from the state value.
    //Displays a button that allows users to get their current acccurate location.

    //Displays buttons for searching, clearing and map button.
    //Beneath the buttons, the current weather data are displaued in columns within the top row.

    //Beneath the current weather data, forecast weather information for next five days are shows.
    //Initially the map is hidden from the users when front page loads.

    //Left button and right button is displayed so the user can navigate through the forecast weather to view further weather information.
    return(
      <div id="app" className={"overAllBackgroundColour"}>
        <video autoPlay muted loop id="myVideo">
          <source src={require('./resources/bg.mp4')} type="video/mp4"/>
        </video>
        <div style={{height: '100%',width: '100%',position: 'absolute'}}>
          <div id="comps">
            <div className="row">
              <LocalTime/>
              <div className="LogoContainer">
                <h1>OneWeather</h1>
                <img src={logo} alt="error"/>
              </div>
            </div>

            <div className="row">
              <div className="columnTop">
                <CoordinatesInputBoxes lat={this.state.lat} lon={this.state.lon} KeyDown={this.onKeyDown} Change={this.handleChange} />
              </div>
              <div className="columnTop noPadding">
                <div id="getCurrentLocLink" className="getCurrentWeatherBtn"><GetCurrentLocationLink OnLocationAccess={this.positionSet} /></div>
              </div>
            </div>



          <div className="row rowTopMargin">
            <div id="searchBtnDiv" className="columnThreeLayer">
              <button id='searchBtn' className="button" onClick={event => this.clickHandle(event)}><span role="img" aria-label="search">&#128269;</span> Search</button>
            </div>
            <div id="clearBtnDiv" className="columnThreeLayer">
              <button id='clearBtn' className="button" onClick={event => this.ClearEvent(event)}><span role="img" aria-label="clear">&#10006;</span> Clear</button>
            </div>
            <div id="mapBtnDiv" className="columnThreeLayer">
              <button id='mapTbtn' className="button" onClick={event => this.MapToggle(event)}><span role="img" aria-label="map">&#9875;</span> Map</button>
            </div>
          </div>

          <div className="row">
            <div className="oneColumn" style={{paddingBottom:'0px'}}>
              <div id="weatherInf">
                <div style={{textAlign: 'center'}}>
                  <div id="current">
                    {this.state.currentWeather}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{height:'1px',borderStyle:'solid',borderWidth:'0.02px',marginLeft:'20px',marginRight: '20px'}}></div>


          <div id="dWeather" className="row rowTopMargin" style={{marginTop:'0px'}}>
            <div id="day">
              <div id="prevbtndiv" className="oneColumn">
                <div className="forecastButtonPrev">
                  <button id="prevDaybtn" onClick={(event) => this.PrintPrevDayHandler(event)}>&#8701;</button>
                </div>
              </div>
              <div id="dailyweatherDiv" className="oneColumn">
                {this.state.dailyWeather}
              </div>
              <div id="nextbtndiv" className="oneColumn">
                <div className="forecastButtonNext">
                  <button id="nextDaybtn" onClick={(event) => this.PrintNextDayHandler(event)}>&#8702;</button>
              </div>
            </div>
          </div>
        </div>

          </div>
        <button id="exitFullbtn" style={exitFullSStyle} onClick={event => this.MapToggle(event)}>&#10799;</button>
        <GoogleMaps lat={this.state.lat} lon={this.state.lon} clickHandle={this.clickHandle.bind(this)}
          markerLocation={this.markerLocation}
          Submit={this.state.searched} SetSubmitOff={this.SetSearchedOFF} Init={this.state.initialize} StopInit={this.setInitializeOFF}/>

        </div>
      </div>
    );
  }
  // <div id="DocumentModifiedDate"style={{color:'white',backgroundColor: 'black', padding: '10px'}}>Last Modified: {lm.toString()}</div>
}



ReactDOM.render(<App />, document.getElementById('root'));
