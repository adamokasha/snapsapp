import React from 'react';

import HeroUnit from '../components/HeroUnit';
import Feed from '../components/Feed';

export class LandingPage extends React.Component {
    render() {
    return (
      <React.Fragment>
        <HeroUnit />
        <Feed />
      </React.Fragment>
    );
  }
}

export default LandingPage;
