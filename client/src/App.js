import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Connect from "./components/layout/Connect";
import Alert from "./components/layout/Alert";
import Verify from "./components/auth/Verify";
import Forget from "./components/auth/Forget";
import Reset from "./components/auth/Reset";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardEdit from "./components/editprofile/DashboardEdit";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import PrivateRoute from "./components/routing/PrivateRoute";
import FirstVisit from "./components/firstvisit/FirstVisit";
import Notifications from "./components/notification/Notifications";
import Chat from "./components/chat/chat";
import Conversation from "./components/chat/conversation";
import NotFound from "./components/layout/NotFound";
import { Container } from "@material-ui/core";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";

// FilePond
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

if (localStorage.token) setAuthToken(localStorage.token);

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Container>
            <section>
              <Alert />
              <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/verify" component={Verify} />
                <Route exact path="/forget" component={Forget} />
                <Route exact path="/reset" component={Reset} />
                <PrivateRoute exact path="/connect" component={Connect} />
                <PrivateRoute exact path="/firstvisit" component={FirstVisit} />
                <PrivateRoute exact path="/profiles" component={Profiles} />
                <PrivateRoute exact path="/profile/:id" component={Profile} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/editprofile"
                  component={DashboardEdit}
                />
                <PrivateRoute
                  exact
                  path="/notifications"
                  component={Notifications}
                />
                <PrivateRoute
                  exact
                  path="/conversation/:id"
                  component={Conversation}
                />
                <PrivateRoute exact path="/chat" component={Chat} />
                <Route component={NotFound} />
              </Switch>
            </section>
          </Container>
          <Footer />
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
