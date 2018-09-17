import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { registerUser } from '../actions/auth';

import DisplayNameForm from '../components/DisplayNameForm';

export class RegistrationPage extends React.Component {
  onSubmit = async (displayName) => {
    try {
      await this.props.registerUser(displayName);
      this.props.history.push('/dashboard');
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    return (
      <div>
        <DisplayNameForm onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default connect(
  null,
  { registerUser }
)(withRouter(RegistrationPage));
