import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import axios from "axios";
import Socket, { socket } from "../chat/Socket";
import uuid from "uuid";
import useStyles from "../../utils/styleClasses";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  CssBaseline,
  Button,
  Divider
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";

const Navbar = ({ auth: { isAuthenticated, user, loading }, logout }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [messagesAnchorEl, setMessagesAnchorEl] = React.useState(null);

  const [countNot, setcountNot] = useState(0);
  const [textNot, settextNot] = useState([]);
  const [countMsg, setcountMsg] = useState(0);
  const [textMsg, settextMsg] = useState([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationsAnchorEl);
  const isMessageMenuOpen = Boolean(messagesAnchorEl);

  const setNotificationAsSeen = () =>
    axios.post("http://localhost:5000/api/notification");

  const setMessagesAsSeen = () => axios.post("http://localhost:5000/api/chat");

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleNotificationsMenuOpen = event => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationAsSeen();
    setcountNot(0);
    settextNot([]);
    setNotificationsAnchorEl(null);
  };

  const handleMessageMenuOpen = event => {
    setMessagesAnchorEl(event.currentTarget);
  };

  const handleMessageMenuClose = () => {
    setcountMsg(0);
    settextMsg([]);
    setMessagesAsSeen();
    setMessagesAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMenuLogout = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    logout();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    socket.on("notification", async () => {
      const notifications = await axios.get(
        "http://localhost:5000/api/notification"
      );
      if (notifications.data.length > 0) {
        var nbCount = 0;
        var data = notifications.data;
        var notarray = [];
        data.map(async user => {
          notarray.push(user.notification);
          nbCount++;
        });
        settextNot(notarray);
        setcountNot(nbCount);
      } else {
        setcountNot(0);
        settextNot([]);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("not_message", async () => {
      const messages = await axios.get("http://localhost:5000/api/chat");
      if (messages.data.length > 0) {
        var nbCount = 0;
        var msgarray = [];
        var data = messages.data;
        data.map(async user => {
          if (user !== null) {
            msgarray.push(user);
            nbCount++;
          }
        });
        settextMsg(msgarray);
        setcountMsg(nbCount);
      } else {
        setcountMsg(0);
        settextMsg([]);
      }
    });
  }, []);

  useEffect(() => {
    const loadNot = async () => {
      const notifications = await axios.get(
        "http://localhost:5000/api/notification"
      );
      if (notifications.data.length > 0) {
        var nbCount = 0;
        var data = notifications.data;
        var notarray = [];
        data.map(async user => {
          notarray.push(user.notification);
          nbCount++;
        });
        settextNot(notarray);
        setcountNot(nbCount);
      } else {
        setcountNot(0);
        settextNot([]);
      }
    };

    const loadData = async () => {
      const messages = await axios.get("http://localhost:5000/api/chat");
      if (messages.data.length > 0) {
        var nbCount = 0;
        var msgarray = [];
        var data = messages.data;
        data.map(async user => {
          if (user !== null) {
            msgarray.push(user);
            nbCount++;
          }
        });
        settextMsg(msgarray);
        setcountMsg(nbCount);
      } else {
        setcountMsg(0);
        settextMsg([]);
      }
    };

    user && isAuthenticated && !loading && loadData() && loadNot();
  }, [loading, isAuthenticated, user]);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
        My account
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose} component={Link} to="/editprofile">
        Edit Account
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuLogout}>Logout</MenuItem>
    </Menu>
  );

  const notificationId = "primary-account-menunotification";
  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={notificationId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNotificationMenuOpen}
      onClose={handleNotificationsMenuClose}
    >
      {textNot.map((data, index) => (
        <div key={uuid.v4()}>
          <MenuItem id={index}>{data}</MenuItem>
          <Divider />
        </div>
      ))}
      <MenuItem
        component={Link}
        to="/notifications"
        onClick={handleNotificationsMenuClose}
      >
        All notifications
      </MenuItem>
    </Menu>
  );

  const messageId = "primary-account-menunotification";
  const renderMessagesMenu = (
    <Menu
      anchorEl={messagesAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={messageId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMessageMenuOpen}
      onClose={handleMessageMenuClose}
    >
      {textMsg.map((data, index) => (
        <div key={uuid.v4()}>
          <MenuItem id={index}>
            {data.username + " : " + data.lastreply}
          </MenuItem>
          <Divider />
        </div>
      ))}
      <MenuItem onClick={handleMessageMenuClose} component={Link} to="/chat">
        All Messages
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {user && isAuthenticated ? (
        <div>
          <MenuItem component={Link} to="/chat">
            <IconButton aria-label="Show" color="inherit">
              <Badge badgeContent={countMsg} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem component={Link} to="/notifications">
            <IconButton aria-label="show 11" color="inherit">
              <Badge badgeContent={countNot} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              aria-label="Account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              {!user.profileimg ? (
                <AccountCircle />
              ) : (
                <Avatar
                  alt="avataruser"
                  src={`/${user.profileimg}`}
                  className={classes.Avatar}
                />
              )}
            </IconButton>
            {<span className="text-dark">{user.User[0].username}</span>}
          </MenuItem>
          <Socket />
        </div>
      ) : (
        <div>
          <MenuItem>
            <Button
              component={Link}
              to="/login"
              color="inherit"
              variant="outlined"
              className={classes.link}
            >
              Login
            </Button>
          </MenuItem>
          <MenuItem>
            <Button
              component={Link}
              to="/register"
              color="inherit"
              variant="outlined"
              className={classes.link}
            >
              Register
            </Button>
          </MenuItem>
        </div>
      )}
    </Menu>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <div className={classes.grow}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Button
              component={Link}
              to="/"
              color="inherit"
              className={classes.link}
            >
              Matcha
            </Button>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {!isAuthenticated ? (
                <div>
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    variant="outlined"
                    className={classes.link}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    color="inherit"
                    variant="outlined"
                    className={classes.link}
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <div>
                  <IconButton
                    aria-label="Show 4 new mails"
                    color="inherit"
                    aria-controls={messageId}
                    aria-haspopup="true"
                    onClick={handleMessageMenuOpen}
                  >
                    <Badge badgeContent={countMsg} color="primary">
                      <MailIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    aria-label="Show 17 new notifications"
                    color="inherit"
                    edge="end"
                    aria-controls={notificationId}
                    aria-haspopup="true"
                    onClick={handleNotificationsMenuOpen}
                  >
                    <Badge badgeContent={countNot} color="primary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="Account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    {!user ? (
                      <p>Loading...</p>
                    ) : !user.profileimg ? (
                      <AccountCircle />
                    ) : (
                      <Avatar
                        alt="avataruser"
                        src={`/${user.profileimg}`}
                        className={classes.Avatar}
                      />
                    )}
                  </IconButton>
                </div>
              )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="Show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        {renderNotificationsMenu}
        {renderMessagesMenu}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
