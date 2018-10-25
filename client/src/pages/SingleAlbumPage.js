import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import axios from "axios";

import Grid from "../components/Grid";
import { fetchAlbumPostsPaginated } from "../async/albums";
import { onScroll } from "../utils/utils";

export class SingleAlbumPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialFetch: true,
      isFetching: false,
      page: 0,
      pages: null,
      hasMore: true
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.bind(this);
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);
    try {
      const { albumid } = this.props.match.params;
      const { data: albumPosts } = await fetchAlbumPostsPaginated(
        this.signal.token,
        albumid,
        0
      );
      this.setState({
        initialFetch: false,
        pages: [albumPosts],
        page: this.state.page + 1
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e);
      }
      console.log(e);
    }
  }

  fetchNextPage = () => {
    if (this.state.isFetching || !this.state.hasMore) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      try {
        const { albumid } = this.props.match.params;
        const { data: albumPosts } = await fetchAlbumPostsPaginated(
          this.signal.token,
          albumid,
          this.state.page
        );

        if (!albumPosts.length) {
          return this.setState({ isFetching: false, hasMore: false }, () => {});
        }
        this.setState(
          {
            isFetching: false,
            pages: [...this.state.pages, albumPosts],
            page: this.state.page + 1
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

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
    this.signal.cancel("Async call cancelled.");
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.initialFetch &&
          this.state.pages && (
            <Grid
              gridContext="albumPosts"
              gridData={this.state.pages}
              isFetching={this.state.isFetching}
            />
          )}
        {this.state.initialFetch && <div>Loading</div>}
      </React.Fragment>
    );
  }
}

SingleAlbumPage.propTypes = {
  albumId: PropTypes.string
};

export default withRouter(SingleAlbumPage);
