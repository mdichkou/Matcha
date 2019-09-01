import React, { useEffect } from "react";
import { connect } from "react-redux";
import openSocket from "socket.io-client";

var token = localStorage.token;

const socket = openSocket("http://localhost:5000", {
  query: { token: token }
});

const Socket = ({ auth: { user, loading } }) => {
  useEffect(() => {
    !loading &&
      user &&
      socket.emit("login", {
        id: user.User[0].id,
        username: user.User[0].username
      });
  });

  return <div />;
};

Socket.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth
});

export { socket };

export default connect(
  mapStateToProps,
  {}
)(Socket);
