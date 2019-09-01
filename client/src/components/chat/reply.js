import React, { Component } from "react";
import moment from "moment";

class Reply extends Component {
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
      <div className="incoming_msg mb-2">
        <div className="received_msg">
          <div className="received_withd_msg">
            <p>{this.props.message}</p>
            <span className="time_date">{this.state.time}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Reply;
