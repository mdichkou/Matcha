import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './components/layout/NotFound';
import { Container } from '@material-ui/core';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

// FilePond
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import routes from './routes';

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
                {routes.map((route) =>
                  route.privateRoute ? (
                    <PrivateRoute
                      key={route.path}
                      exact
                      path={route.path}
                      component={route.component}
                    />
                  ) : (
                    <Route
                      key={route.path}
                      exact
                      path={route.path}
                      component={route.component}
                    />
                  )
                )}
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
