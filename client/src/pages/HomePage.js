import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import Search from '../components/Search';
import HeroUnit from '../components/HeroUnit';
import Feed from '../components/Feed';
import NavBar from '../components/NavBar';

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentContext: 'home',
      searchTerms: null
    };
  }

  setContext = (context, searchTermsArr) => {
    this.setState({ currentContext: context, searchTerms: searchTermsArr });
  };

  render() {
    const { isAuth } = this.props;
    return (
      <div>
        <NavBar />
        {isAuth ? null : <HeroUnit />}
        <Search setContext={this.setContext} />
        <Button onClick={() => this.setState({ currentContext: 'home' })}>
          Back
        </Button>
        {this.state.currentContext === 'home' ? <Feed context="home" /> : null}
        {this.state.currentContext === 'searchPosts' ? (
          <Feed context='searchPosts' searchTerms={this.state.searchTerms} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isAuth: auth
});

export default connect(mapStateToProps)(HomePage);
