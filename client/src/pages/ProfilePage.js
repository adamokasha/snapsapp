import React from 'react';

import NavBar from '../components/NavBar';
import Profile from '../components/Profile';
import ProfileTabs from '../components/ProfileTabs';

export class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <NavBar />
        <Profile user={this.props.match.params.user} />
        <ProfileTabs user={this.props.match.params.user} />
      </div>
    )
  }
}

export default ProfilePage;