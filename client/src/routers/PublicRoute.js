import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export const PublicRoute = ({ isAuth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuth ? (
        <Redirect to="/" />
      ) : (
        <div>
          <Component {...props} />
        </div>
      )
    }
  />
);

PublicRoute.propTypes = {
  auth: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
};

const mapStateToProps = auth => ({
  isAuth: auth
});

export default connect(mapStateToProps)(PublicRoute);
