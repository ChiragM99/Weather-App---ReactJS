import React from 'react';
import './css/App.css'
import * as H from './Helper'


export default class GoogleMaps extends React.Component {
  constructor(props) {
    super(props)
    this.map = null;
    this.marker = false;
    this.infoWin = null;
    this.infoWinClosed = false;
    this.state = {
      OfflineLocDate: null,
      OfflineLocTime: null
    }
  }

  //Before the component render the map is hidden from the users and runs the timer every millisecond.
  componentDidMount = () =>
  {
    this.renderMap();
    this.interval = setInterval(this.timer, 1);
    var mapDiv = document.getElementById("map");
    mapDiv.style.display = mapDiv.style.display === 'none' ? '' : 'none';
  }

  //When the timer is set this function is called and the content of the info window is set when the marker is clicked.
  timer = () => {
    try {
      var Arr = [];
      this.infoWinArrayContent(Arr);
      this.infoWin.setContent(Arr.join(''))
    } catch (e) {

    } finally {

    }
    try {
      if(this.props.Init)
      {
        this.initiateMapMarkerInfo()
        this.props.StopInit();
      }
    } catch (e) {

    } finally {

    }
    try {
      if(this.props.Submit)
      {
        this.clickHandle()
        this.props.SetSubmitOff();
      }
    } catch (e) {
    } finally {

    }
    try {
      this.setState({OfflineLocDate:H.UnixTimeStampToDateTime(H.coordsToUnixTimeStamp(document.getElementById('lat').value,document.getElementById('lon').value),false)});
      this.setState({OfflineLocTime:H.getTimeZoneName(document.getElementById('lat').value,document.getElementById('lon').value)+' '+H.UnixTimeStampToTimeOnly(H.coordsToUnixTimeStamp(document.getElementById('lat').value,document.getElementById('lon').value),true)});
    } catch (e) {

    } finally {

    }
  }

  //Loads the google maps API from the javascript file. initializes the map with function initMap2.
  renderMap = () => {
    // H.loadScript("https://maps.googleapis.com/maps/api/js?key='PLACEHERE'=initMap");
    // window.initMap = this.initMap;
    H.loadScript("https://maps.googleapis.com/maps/api/js?&callback=initMap");
    window.initMap = this.initMap2;
  }

  //Event listener listens to when the user clicks the map. Sets the map attributes such as zoom value and so on.
  initMap2 = () => {
    this.map = new window.google.maps.Map(document.getElementById("map"), {
        center: new window.google.maps.LatLng(this.props.lat, this.props.lon),
        zoom: 1,
        mapTypeId: "OSM",
        mapTypeControl: false,
        streetViewControl: false
    });
    this.map.mapTypes.set("OSM", new window.google.maps.ImageMapType({
                getTileUrl: (b, m)=>this.getURL(b, m),
                tileSize: new window.google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 18
            }));
    window.google.maps.event.addListener(this.map, 'click', (e) =>this.mapOnClick(e));
  }

  //Gets the map layer.
  getURL = (coord, zoom) => {
      var tilesPerGlobe = 1 << zoom;
      var x = coord.x % tilesPerGlobe;
      if (x < 0) x = tilesPerGlobe+x;
      return "https://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
    }

  //When the map is clicked this function is called. A marker is set on the map with click event listener that displays info window for that marker.
  mapOnClick = (e) => {
    var clickedLocation = e.latLng;
    if (this.marker === false)
    {
      this.marker = new window.google.maps.Marker({
                        position: clickedLocation,
                        map: this.map,
                        draggable: true //make it draggable
                    });
      window.google.maps.event.addListener(this.marker, 'dragend', (e) => this.markerLocation(e));
      this.marker.addListener('click', (e) => this.MarkerClicked(e));
    }else {
      this.marker.setPosition(clickedLocation);
    }
    this.markerLocation();
  }

  MarkerClicked = (e) => {
    this.ClickedMarker(true);
  }

  //Sets the info window when the marker is clicked in the map.
  //Adds the event listener to the info window. When the close button is clicked the info window closes.

  ClickedMarker = (markerclicked) =>
  {
    var Arr = [];
    this.infoWinArrayContent(Arr)
    if(this.infoWin !== null)
    {
      this.infoWin.setContent(Arr.join(''))
    }else {
      this.infoWin = new window.google.maps.InfoWindow({
        content: Arr.join('')
      });
      window.google.maps.event.addListener(this.infoWin,'closeclick', (e) => this.closeEventInfoWin(e));
    }
    if(markerclicked === false)
    {
      if(this.infoWinClosed)
      {
        this.infoWinClosed = false;
        this.infoWin.open(this.map, this.marker);
      }else {
        this.infoWinClosed = true;
      }
    }else {
      if(this.infoWinClosed)
      {
        this.infoWinClosed = false;
        this.infoWin.open(this.map, this.marker);
      }else {
        this.infoWinClosed = true;
      }
    }
  }

  //Sets the info windows content based in the marker position.
  infoWinArrayContent = (Arr) =>
  {
    Arr.push('<div style="user-select: none;-moz-user-select: none;-khtml-user-select: none;-webkit-user-select: none;-o-user-select: none;">')
    if (this.marker)
    {
      Arr.push('<div><span style="font-weight:bold">Lat: </span>'+ this.marker.getPosition().lat()+'</div>');
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div><span style="font-weight:bold">Lon: </span>'+ this.marker.getPosition().lng()+'</div>');
    }
    if (document.getElementById("currentDay"))
    {
        Arr.push('<div style="margin-top:10px;"></div>')
        Arr.push(document.getElementById("currentDay").innerHTML);
    }
    if (document.getElementById("currCountryNP"))
    {
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+document.getElementById("currCountryNP").innerHTML+'</div>');
    }
    if(document.getElementById("currTime"))
    {
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+document.getElementById("currCond").innerHTML+'</div>');
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+document.getElementById("currTime").innerHTML+'</div>');
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+document.getElementById("currTemp").innerHTML+'</div>');
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+document.getElementById("windSpeed").innerHTML+'</div>');
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+document.getElementById("precip").innerHTML+'</div>');
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push(document.getElementById("fishingStatus").innerHTML);
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+document.getElementById("currWthUpd").innerHTML+'</div>');
    }else {
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+this.state.OfflineLocDate+'</div>')
      Arr.push('<div style="margin-top:10px;"></div>')
      Arr.push('<div>'+this.state.OfflineLocTime+'</div>')
    }
    Arr.push('</div>')
  }

  closeEventInfoWin = (e) =>
  {
    this.infoWinClosed = true;
  }

  // When the marker is dragged anywhere in the map it updates the marker position in the map.+
  markerLocation = (e) => {
    this.day = 0;
    this.cntTimer = 0;
    var currentLoc = this.marker.getPosition();
    this.props.markerLocation(currentLoc);
    this.ClickedMarker(true);
    if(this.interval !== null)
    {
      clearInterval(this.interval);
    }
    this.interval = setInterval(this.timer, 1);
  }

  //When the user search for a coordiante this function is called.
  clickHandle = (event) => {
    var clickedLocation = {lat:Number(this.props.lat),lng:Number(this.props.lon)};
    this.map.setCenter(clickedLocation);
    this.map.setZoom(15);
    if(this.interval !== null)
    {
      clearInterval(this.interval);
    }
    this.interval = setInterval(this.timer, 1);
  }

  //Marker info is initialized. Updates the long and lati of the marker.
  initiateMapMarkerInfo()
  {
    var lati = Number(document.getElementById("lat").value);
    var longi = Number(document.getElementById("lon").value);
    var clickedLocation = {lat:lati,lng:longi};
    if (this.marker === false)
    {
      this.marker = new window.google.maps.Marker({
                        position: clickedLocation,//{lat: -34.397, lng: 150.644},
                        map: this.map,
                        draggable: true //make it draggable
                    });
      window.google.maps.event.addListener(this.marker, 'dragend', (e) => this.markerLocation(e));
      this.marker.addListener('click', (e) => this.MarkerClicked(e));
    }else {
      this.marker.setPosition(clickedLocation);
    }
    this.ClickedMarker(false);
    return clickedLocation;
  }

  render(){
    const mapStyle = {
      width: '100%',
      height: '100%',
      color:'black'
    };
    return(
      <div id="map" style={mapStyle}></div>
    );
  }
}
