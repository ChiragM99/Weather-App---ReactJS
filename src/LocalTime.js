import React from 'react';
import './css/App.css'
import * as H from './Helper'

export default class LocalTime extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTime: null,
      currentDate: null
    }
  }
  componentDidMount = () =>
  {
    setInterval(this.timer,1000)
  }

  timer = () =>
  {
    var unix = (Date.now() / 1000);
    this.setState({currentTime:H.UnixTimeStampToTimeOnly(unix,true), currentDate:H.UnixTimeStampToDateTime(unix,false)})
  }

  render(){
    return(
      <div style={{padding:'20px',display:'inline-block'}}>
        <div>
          <span id="currentTime">{this.state.currentTime}</span>
        </div>
        <div>
          <span id="currentDate">{this.state.currentDate}</span>
        </div>
      </div>
    );
  }
}
