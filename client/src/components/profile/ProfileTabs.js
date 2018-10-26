import React from "react";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from "axios";

import Grid from "../grid/Grid";
import { onScroll } from "../../utils/utils";
import { fetchForProfilePage } from "../../async/combined";

const styles = theme => ({
  root: {
    marginTop: 0,
    backgroundColor: theme.palette.background.paper,
    width: "100%"
  },
  appBarRoot: {
    marginBottom: `${theme.spacing.unit}px`
  }
});

class ProfileTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.profileTabPos,
      isFetching: false,
      pages: this.props.pages,
      page: 1,
      hasMore: true
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.profileTabPos !== prevProps.profileTabPos) {
      this.handleChange(null, this.props.profileTabPos);
    }
  }

  fetchNextPage = () => {
    if (this.state.isFetching || !this.state.hasMore) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      try {
        const mappedValToContext = {
          0: "userFaves",
          1: "userPosts",
          2: "userAlbums"
        };
        const { data } = await fetchForProfilePage(
          this.signal.token,
          mappedValToContext[`${this.state.value}`],
          this.state.page,
          this.props.user
        );

        if (!data.length) {
          return this.setState({ hasMore: false, isFetching: false }, () => {});
        }
        this.setState(
          {
            pages: [...this.state.pages, data],
            isFetching: false,
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

  handleChange = (event, value) => {
    this.setState(
      { value, isFetching: true, pages: [], page: 0, hasMore: true },
      async () => {
        const mappedValToContext = {
          0: "userFaves",
          1: "userPosts",
          2: "userAlbums"
        };
        const { data } = await fetchForProfilePage(
          this.signal.token,
          mappedValToContext[value],
          0,
          this.props.user
        );

        this.setState({ isFetching: false, pages: [data] }, () => {});
      }
    );
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes } = this.props;
    console.log("PROFILETABS RENDERED", this.props);

    return (
      <div className={classes.root}>
        <AppBar
          classes={{ root: classes.appBarRoot }}
          position="static"
          color="default"
        >
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Faves" />
            <Tab label="Posts" />
            <Tab label="Albums" />
          </Tabs>
        </AppBar>

        {this.state.value === 0 &&
          this.state.pages && (
            <Grid
              gridContext="posts"
              gridData={this.state.pages}
              user={this.props.user}
              isFetching={this.state.isFetching}
            />
          )}
        {this.state.value === 1 &&
          this.state.pages && (
            <Grid
              gridContext="posts"
              gridData={this.state.pages}
              user={this.props.user}
              isFetching={this.state.isFetching}
            />
          )}
        {this.state.value === 2 &&
          this.state.pages && (
            <Grid
              gridContext="albums"
              gridData={this.state.pages}
              user={this.props.user}
              isFetching={this.state.isFetching}
            />
          )}
      </div>
    );
  }
}

ProfileTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  profileTabPos: PropTypes.number
};

export default compose(
  withStyles(styles)
  // connect(
  //   mapStatetoProps,
  //   { clearPosts }
  // )
)(ProfileTabs);
