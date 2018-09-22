import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import SocialAuth from '../components/SocialAuth';
import ToS from '../components/ToS'; 

export const RegisterOrLogin = (props) => {
  const { registerOrLogin } = props;
  return (
    <div>
      <Typography
        variant="display3"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        {registerOrLogin === 'register' ? 'Sign Up' : 'Login' }
      </Typography>
      <SocialAuth
        registerOrLogin={registerOrLogin}
      />
      <ToS />
    </div>
  );
};

RegisterOrLogin.propTypes = {
  registerOrLogin: PropTypes.oneOf(['register', 'login'])
}

export default RegisterOrLogin;