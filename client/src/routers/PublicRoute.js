import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import NavBar from '../components/NavBar';

export const PublicRoute = ({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth ? (
        <Redirect to="/" />
      ) : (
        <div>
          <NavBar />
          <Component {...props} />
        </div>
      )
    }
  />
);

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps)(PublicRoute);
