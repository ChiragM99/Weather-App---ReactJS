import React from 'react';
import './css/App.css'

export default class GetCurrentLocationLink extends React.Component {
  //This function requests the user to get their location permisson, so their accurate location coordinate can be gathered.
  getCurrentLocation = (event) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.props.OnLocationAccess, this.NavGeoLocErr);
    }
  }

//This function is triggered when ever the user denies the location access permission.
  NavGeoLocErr =(err) =>{
    alert(`ERROR(${err.code}): ${err.message}`)
  }

  render()
  {
    // var buttonLink = {
    //  // background:'none',
    //  // color:'blue',
    //  // border:'none',
    //  // padding:'0',
    //  cursor: 'pointer'
    // }
    return(
      <div>
        <button id="getCurrentLocLinkBtn" onClick={(event) => this.getCurrentLocation(event)}>Get my current latitude and longitude</button>
      </div>
    );
  }
}
