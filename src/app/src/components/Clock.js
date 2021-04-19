import React from "react";
// import Clock from 'react-live-clock';
// import {DateTime} from 'luxon'
import moment from "moment";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timemoment: moment().format("LT"),
    };
  }
  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 10000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.setState({
      timemoment: moment().format("LT"),
    });
  }
  render() {
    return <p className="App-clock">{this.state.timemoment}</p>;
  }
}
export default Clock;
