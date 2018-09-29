import React from 'react';
import {connect} from 'react-redux';

import HeroUnit from '../components/HeroUnit';
import Feed from '../components/Feed';
import NavBar from '../components/NavBar'

export class HomePage extends React.Component {
    render() {
      const {isAuth} = this.props;
    return (
      <div>
      <NavBar />
        {isAuth ? null : <HeroUnit />}
        <Feed context={'home'} />
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => ({
  isAuth: auth
})

export default connect(mapStateToProps)(HomePage);
