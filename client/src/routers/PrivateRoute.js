import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const routeUser = (auth, Component, props) => {
  if (auth) {
    if (auth.registered) {
      return <Component {...props} />;
    }
    return <Redirect to="/register_user" />;
  }
  return <Redirect to="/" />;
};

export const PrivateRoute = ({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return routeUser(auth, Component, props);
    }}
  />
);

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps)(PrivateRoute);
