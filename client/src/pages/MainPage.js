import React from "react";
import { connect } from "react-redux";

import Search from "../components/Search";
import HeroUnit from "../components/HeroUnit";
import ScrollView from "../components/ScrollView";
import NavBar from "../components/NavBar";
import MainPageMenu from "../components/MainPageMenu";

export class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentContext: "popular",
      searchTerms: null
    };
  }

  setSearch = (context, searchTermsArr) => {
    this.setState({ currentContext: context, searchTerms: searchTermsArr });
  };

  setContext = context => {
    this.setState({ currentContext: context }, () => {});
  };

  render() {
    const { isAuth } = this.props;
    return (
      <div>
        <NavBar />
        {isAuth ? null : <HeroUnit />}
        <Search setSearch={this.setSearch} />
        <MainPageMenu setContext={this.setContext} />
        <ScrollView
          context={this.state.currentContext}
          searchTerms={this.state.searchTerms}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isAuth: auth
});

export default connect(mapStateToProps)(MainPage);
