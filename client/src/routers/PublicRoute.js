import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import NavBar from '../components/NavBar';

export const PublicRoute = ({ isAuth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuth ? (
        <Redirect to="/dashboard" />
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
  isAuth: auth
});

export default connect(mapStateToProps)(PublicRoute);
