import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import appendReactDOM from "append-react-dom";
import Message from "./message";
import Reply from "./reply";
import { socket } from "./Socket";
import axios from "axios";
import "../../Chat.css";

class Conversation extends Component {
  constructor() {
    super();
    this.state = {
      msgs: "",
      pseudo: "",
      userID: "",
      inputValue: "",
      username: "",
      id: "",
      isTyping: false,
      read: 0,
      last: "",
      renderRedirect: false
    };
    this.inserMessage = this.inserMessage.bind(this);
    this.inserReply = this.inserReply.bind(this);
    this.getMsgs = this.getMsgs.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    socket.on("username", rows => {
      if (rows.length === 0) this.setState({ renderRedirect: true });
      rows.map(async user => {
        if (this.state.pseudo !== user.username)
          this.setState({ username: user.username });
      });
    });
    socket.on("message", rows => {
      this.setState({ read: 0, last: this.state.username });
      this.inserReply(rows.pseudo, rows.msg, rows.time);
    });
    socket.on("updateTyping", rows => {
      if (rows) this.setState({ isTyping: true });
      else this.setState({ isTyping: false });
    });
  }

  componentDidUpdate(prevProps) {
    const { auth } = this.props;
    const { id } = this.props.match.params;
    if (auth.user !== prevProps.auth.user) {
      this.getMsgs(id, auth.user);
    }
  }

  getMsgs(id, user) {
    this.setState({
      pseudo: user.User[0].username,
      userID: user.User[0].id,
      id: id
    });

    socket.emit("conv_id", id);
    axios.get("http://localhost:5000/api/conversation/" + id).then(res => {
      res.data.map(async data => {
        if (data.username !== user.User[0].username) {
          this.setState({ username: data.username });
          this.inserReply(data.username, data.reply, data.time);
          var info = {
            id: data.cr_id,
            read: 1
          };
          socket.emit("read", info);
          this.setState({ read: data.read, last: data.username });
        } else {
          this.inserMessage(data.username, data.reply, data.time);
          this.setState({ read: data.read, last: data.username });
        }
      });
    });
  }

  inserMessage = (pseudo, message, time) => {
    let el = document.getElementById("zone_chat");
    appendReactDOM(Message, el, {
      pseudo: pseudo,
      message: message,
      time: time
    });
  };

  inserReply = (pseudo, message, time) => {
    let el = document.getElementById("zone_chat");
    appendReactDOM(Reply, el, {
      pseudo: pseudo,
      message: message,
      time: time
    });
  };

  handleChange = ({ target }) => {
    const data = {
      to: this.state.username,
      typing: false
    };
    if (target.value !== "") data.typing = true;
    else data.typing = false;
    socket.emit("typing", data);
    this.setState({ [target.name]: target.value });
  };

  onKeyPress = e => {
    if (e.which === 13) {
      this.handleClick();
    }
  };

  handleClick = () => {
    const { pseudo, inputValue, username, id, userID } = this.state;
    if (inputValue.trim() !== "") {
      const chatWindow = document.getElementById("msg_history");
      var xH = chatWindow.scrollHeight;
      chatWindow.scrollTo(0, xH);
      let now = new Date();
      const data = {
        msg: inputValue,
        pseudo: pseudo,
        to: username,
        user_id: userID,
        cr_id: id
      };
      const typing = {
        to: username,
        typing: false
      };
      this.inserMessage(pseudo, inputValue, now);
      socket.emit("privmessage", data);
      if (inputValue !== "") typing.typing = true;
      else typing.typing = false;
      socket.emit("typing", data);
      this.setState({ inputValue: "" });
    }
  };

  render() {
    if (this.state.renderRedirect) return <Redirect to="/chat" />;

    return (
      <div className="col-md-12 mt-4">
        <div className="chat-message">
          <div className="d-flex justify-content-between">
            <div className="text-small">
              <strong>{this.state.username}</strong>
            </div>
          </div>
          <ul className="list-unstyled chat-1 scrollbar-light-blue">
            <div>
              <div id="msg_history" className="msg_history">
                <div id="zone_chat" />
              </div>
            </div>
            <li className="white">
              <div className="chat-footer">
                {this.state.isTyping ? (
                  <p id="istyping" className="text-smaller text-muted mb-0">
                    is Typing ...
                  </p>
                ) : (
                  <p id="istyping" className="text-smaller text-muted mb-0" />
                )}
              </div>
              <div className="form-group">
                <label>Message</label>
                <input
                  type="text"
                  name="inputValue"
                  className="form-control"
                  value={this.state.inputValue}
                  onChange={this.handleChange}
                  onKeyPress={this.onKeyPress}
                  placeholder="type your message"
                />
              </div>
              <button
                type="button"
                onClick={this.handleClick}
                className="btn btn-info btn-rounded btn-sm waves-effect waves-light float-right"
              >
                Send
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Conversation);
