import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import Search from '../components/Search';
import HeroUnit from '../components/HeroUnit';
import ScrollView from '../components/ScrollView';
import NavBar from '../components/NavBar';
import MainPageMenu from '../components/MainPageMenu';

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentContext: 'popular',
      searchTerms: null
    };
  }

  setSearch = (context, searchTermsArr) => {
    this.setState({ currentContext: context, searchTerms: searchTermsArr });
  };

  setContext = (context) => {
    this.setState({currentContext: context}, () => {})
  }

  render() {
    const { isAuth } = this.props;
    return (
      <div>
        <NavBar />
        {isAuth ? null : <HeroUnit />}
        <Search setSearch={this.setSearch} />
        <MainPageMenu setContext={this.setContext} />
        {this.state.currentContext === 'new' ? <ScrollView context="new" /> : null}
        {this.state.currentContext === 'searchPosts' ? (
          <ScrollView context='searchPosts' searchTerms={this.state.searchTerms} />
        ) : null}
        {this.state.currentContext === 'following' ? (
          <ScrollView context='following' />
        ) : null}
        {this.state.currentContext === 'popular' ? (
          <ScrollView context='popular' />
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
