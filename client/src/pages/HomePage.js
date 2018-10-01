import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import Search from '../components/Search';
import HeroUnit from '../components/HeroUnit';
import ScrollView from '../components/ScrollView';
import NavBar from '../components/NavBar';

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentContext: 'home',
      searchTerms: null
    };
  }

  setSearch = (context, searchTermsArr) => {
    this.setState({ currentContext: context, searchTerms: searchTermsArr });
  };

  render() {
    const { isAuth } = this.props;
    return (
      <div>
        <NavBar />
        {isAuth ? null : <HeroUnit />}
        <Search setSearch={this.setSearch} />
        <Button onClick={() => this.setState({ currentContext: 'home' })}>
          Back
        </Button>
        {this.state.currentContext === 'home' ? <ScrollView context="home" /> : null}
        {this.state.currentContext === 'searchPosts' ? (
          <ScrollView context='searchPosts' searchTerms={this.state.searchTerms} />
        ) : null}
        {this.state.currentContext === 'searchUsers' ? (
          <ScrollView context='searchUsers' searchTerms={this.state.searchTerms} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isAuth: auth
});

export default connect(mapStateToProps)(HomePage);
