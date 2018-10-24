import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import { fetchFollows } from "../async/scrollview";
import { onScroll } from "../utils/utils";
import axios from "axios";

import Grid from "./Grid";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "300px",
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    paddingBottom: `${theme.spacing.unit}px`,
    borderRadius: "3px"
  },
  gridRoot: {
    paddingTop: `${theme.spacing.unit * 2}px`,
    background: "#fafafa",
    height: "400px",
    overflowY: "scroll",
    [theme.breakpoints.up("sm")]: {
      height: "500px"
    }
  },
  circularProgress: {
    margin: "0 auto"
  }
});

class ProfileNetworkTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      context: this.props.context,
      followers: null,
      followersPage: 0,
      hasMoreFollowers: true,
      following: null,
      followingPage: 0,
      hasMoreFollowing: true,
      isFetching: true,
      value: this.props.tabPosition
    };

    this.signal = axios.CancelToken.source();
    // this.onScroll = onScroll.bind(this);
  }

  async componentDidMount() {
    // window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);
    try {
      const { data: pages } = await fetchFollows(
        this.signal.token,
        this.state.context,
        0,
        this.props.userId
      );
      if (this.state.context === "userFollowers") {
        return this.setState({
          followers: [pages],
          followersPage: this.state.followersPage + 1,
          isFetching: false
        });
      }

      return this.setState({
        following: [pages],
        followingPage: this.state.followingPage + 1,
        isFetching: false
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  }

  componentWillUnmount() {
    // Remove onScroll event listener
    // window.removeEventListener("scroll", this.onScroll, false);
    // Cancel asyncs
    this.signal.cancel("Async call cancelled.");
  }

  fetchNextPage = () => {
    console.log("called next page");
    if (
      this.state.value === 0 &&
      (this.state.isFetching || !this.state.hasMoreFollowers)
    ) {
      return;
    }
    if (
      this.state.value === 1 &&
      (this.state.isFetching || !this.state.hasMoreFollowing)
    ) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      try {
        const { data: pages } = await fetchFollows(
          this.signal.token,
          this.state.context,
          this.state.value === 0
            ? this.state.followersPage
            : this.state.followingPage,
          this.props.userId
        );

        if (!pages.length) {
          if (this.state.value === 0) {
            return this.setState(
              { isFetching: false, hasMoreFollowers: false },
              () => {}
            );
          }
          return this.setState(
            { isFetching: false, hasMoreFollowing: false },
            () => {}
          );
        }

        if (this.state.value === 0) {
          return this.setState(
            {
              isFetching: false,
              followers: [...this.state.followers, pages],
              followersPage: this.state.followersPage + 1
            },
            () => {}
          );
        }
        this.setState(
          {
            isFetching: false,
            following: [...this.state.following, pages],
            followingPage: this.state.followingPage + 1
          },
          () => {}
        );
      } catch (e) {}
    });
  };

  handleChange = (event, value) => {
    console.log(
      this.state.followersPage,
      this.state.followingPage,
      this.state.context
    );
    let context;
    value === 0 ? (context = "userFollowers") : (context = "userFollows");
    if (context === "userFollowers" && this.state.followers) {
      return this.setState({ value });
    }
    if (context === "userFollows" && this.state.following) {
      return this.setState({ value });
    }
    this.setState({ isFetching: true, value, context }, async () => {
      try {
        const { data: pages } = await fetchFollows(
          this.signal.token,
          context,
          context === "userFollowers"
            ? this.state.followersPage
            : this.state.followingPage,
          this.props.userId
        );

        if (!pages.length) {
          if (this.state.value === 0) {
            return this.setState(
              { isFetching: false, hasMoreFollowers: false },
              () => {}
            );
          }
          return this.setState(
            { isFetching: false, hasMoreFollowing: false },
            () => {}
          );
        }

        if (context === "userFollowers") {
          return this.setState(
            {
              isFetching: false,
              followers: [pages],
              followersPage: this.state.followersPage + 1
            },
            () => {}
          );
        }
        return this.setState({
          isFetching: false,
          following: [pages],
          followingPage: this.state.followingPage + 1
        });
      } catch (e) {
        if (axios.isCancel()) {
          return console.log(e.message);
        }
        console.log(e);
      }
    });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleScroll = e => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      this.fetchNextPage();
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Followers" />
            <Tab label="Following" />
          </Tabs>
        </AppBar>
        <div className={classes.gridRoot}>
          {this.state.value === 0 && (
            <Grid
              gridContext="profiles"
              gridData={this.state.followers}
              userId={this.props.userId}
              isFetching={this.state.isFetching}
            />
          )}
          {this.state.value === 1 && (
            <Grid
              gridContext="profiles"
              gridData={this.state.following}
              userId={this.props.userId}
              isFetching={this.state.isFetching}
            />
          )}
          <Button
            onClick={this.fetchNextPage}
            disabled={
              this.state.isFetching ||
              (this.state.value === 0 && !this.state.hasMoreFollowers) ||
              (this.state.value === 1 && !this.state.hasMoreFollowing)
            }
          >
            Load More
          </Button>
        </div>
      </div>
    );
  }
}

ProfileNetworkTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  tabPosition: PropTypes.number.isRequired
};

export default withStyles(styles, { withTheme: true })(ProfileNetworkTabs);
