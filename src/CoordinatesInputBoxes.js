import React from 'react';
import './css/App.css'

export default class CoordinatesInputBoxes extends React.Component {
  //KeyDown function is called whenever the user enters a key in the coordiante input boxes.
  KeyDown = (e) =>
  {
    this.props.KeyDown(e);
  }

//Changed function detects whever the values in the coordiante input boxes are changed.
  Changed = (e) =>
  {
    this.props.Change(e);
  }

  render(){
    return(
      <div>
        <input placeholder={'Latitude:  Default=Current latitude'} className="lat" type="number" step="any" id='lat' name='lat' value={this.props.lat} onKeyDown={event => this.KeyDown(event)} onChange={event => this.Changed(event)} />
        <input placeholder={'Longitude: Default=Current longitude'}  className="lon" type="number" step="any" id='lon' name='lon'value={this.props.lon} onKeyDown={event => this.KeyDown(event)}  onChange={event => this.Changed(event)} />
      </div>
    );
  }
}
