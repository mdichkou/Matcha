import React, { Component } from "react";
import * as moment from "moment";

class Message extends Component {
  constructor() {
    super();
    this.state = {
      time: ""
    };
  }

  componentDidMount() {
    this.setState({
      time: moment(this.props.time).format("MMMM DD , HH:mm")
    });
  }

  render() {
    return (
      <div className="outgoing_msg mb-2">
        <div className="sent_msg">
          <p>{this.props.message}</p>
          <span className="time_date">{this.state.time}</span>
        </div>
      </div>
    );
  }
}
export default Message;
