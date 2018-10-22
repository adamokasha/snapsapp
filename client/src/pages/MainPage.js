import React from "react";
import { connect } from "react-redux";
import axios from "axios";

import Search from "../components/Search";
import HeroUnit from "../components/HeroUnit";
import ScrollView from "../components/ScrollView";
import NavBar from "../components/NavBar";
import MainPageMenu from "../components/MainPageMenu";
import { fetchForMainPage } from "../async/scrollview";

export class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      context: "popular",
      gridContext: "posts",
      searchTerms: null,
      page: 1,
      pages: this.props.pages ? this.props.pages : [],
      isFetching: false,
      hasMorePages: true
    };

    this.signal = axios.CancelToken.source();
  }

  componentWillUnmount() {
    // Cancel asyncs
    this.signal.cancel("Async call cancelled.");
  }

  deriveGridContext = context => {
    let gridContext;
    if (["searchUsers"].includes(context)) {
      gridContext = "profiles";
    } else {
      gridContext = "posts";
    }
    return gridContext;
  };

  onSwitchContext = (context, searchTerms = null) => {
    this.setState(
      {
        context,
        isFetching: true,
        page: 0,
        pages: [],
        searchTerms: null
      },
      async () => {
        try {
          const { data } = await fetchForMainPage(
            this.signal.token,
            context,
            0,
            searchTerms
          );

          const gridContext = this.deriveGridContext(context);
          this.setState({
            isFetching: false,
            page: 1,
            pages: [...this.state.pages, data],
            gridContext
          });
        } catch (e) {
          if (axios.isCancel()) {
            return console.log(e.message);
          }
          console.log(e);
        }
      }
    );
  };

  onScrolledToBottom = () => {
    if (this.state.isFetching || !this.state.hasMorePages) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      try {
        const { data } = await fetchForMainPage(
          this.signal.token,
          this.state.context,
          this.state.page,
          this.state.searchTerms
        );

        if (!data.length) {
          return this.setState(
            { hasMorePages: false, isFetching: false },
            () => {}
          );
        }

        this.setState({
          isFetching: false,
          page: this.state.page + 1,
          pages: [...this.state.pages, data]
        });
      } catch (e) {
        if (axios.isCancel()) {
          return console.log(e.message);
        }
        console.log(e);
      }
    });
  };

  render() {
    console.log("MAINPAGE RENDERED");
    // debugger;
    return (
      <div>
        {/* <NavBar /> */}
        {/* {isAuth ? null : <HeroUnit />} */}
        <Search onSwitchContext={this.onSwitchContext} />
        <MainPageMenu onSwitchContext={this.onSwitchContext} />
        {this.state.pages.length > 0 && (
          <ScrollView
            pages={this.state.pages}
            gridContext={this.state.gridContext}
            searchTerms={this.state.searchTerms}
            isFetching={this.state.isFetching}
            onScrolledToBottom={this.onScrolledToBottom}
          />
        )}
      </div>
    );
  }
}

export default MainPage;
