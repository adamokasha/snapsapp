import React from "react";
import axios from "axios";

import Search from "../components/Search";
import HeroUnit from "../components/HeroUnit";
import Grid from "../components/Grid";
import MainPageMenu from "../components/MainPageMenu";

import { fetchForMainPage } from "../async/scrollview";
import { fetchPopular } from "../async/posts";
import { onScroll } from "../utils/utils";

export class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      context: "popular",
      gridContext: "posts",
      searchTerms: null,
      page: 0,
      pages: [],
      initialFetch: true,
      isFetching: false,
      hasMore: true,
      showNavToTop: false
    };

    this.onScroll = onScroll.bind(this);
    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);

    try {
      const { data: postData } = await fetchPopular(this.signal.token, 0);
      this.setState(
        { initialFetch: false, page: 1, pages: [postData] },
        () => {}
      );
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  }

  componentWillUnmount() {
    // Remove onScroll event listener
    window.removeEventListener("scroll", this.onScroll, false);
    // Cancel asyncs
    this.signal.cancel("Async call cancelled.");
  }

  fetchNextPage = () => {
    if (this.state.isFetching || !this.state.hasMore) {
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
          return this.setState({ hasMore: false, isFetching: false }, () => {});
        }

        this.setState(
          {
            isFetching: false,
            page: this.state.page + 1,
            pages: [...this.state.pages, data]
          },
          () => {}
        );
      } catch (e) {
        if (axios.isCancel()) {
          return console.log(e.message);
        }
        console.log(e);
      }
    });
  };

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
    try {
      this.setState({ isFetching: true, pages: [] }, async () => {
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
          pages: [data],
          gridContext
        });
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  };

  render() {
    console.log("MAINPAGE RENDERED");
    // debugger;
    return (
      <div>
        {this.state.initialFetch && <div>Loading...</div>}
        {!this.state.initialFetch && (
          <React.Fragment>
            <Search onSwitchContext={this.onSwitchContext} />
            <MainPageMenu onSwitchContext={this.onSwitchContext} />
            <Grid
              gridData={this.state.pages}
              gridContext={this.state.gridContext}
              isFetching={this.state.isFetching}
              showNavToTop={this.state.showNavToTop}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default MainPage;
