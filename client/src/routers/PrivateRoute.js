import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import NavBar from '../components/NavBar';

export const PrivateRoute = ({ isAuth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuth ? (
        <div>
          <NavBar />
          <Component {...props} />
        </div>
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

const mapStateToProps = ({ auth }) => ({
  isAuth: auth
});

export default connect(mapStateToProps)(PrivateRoute);
