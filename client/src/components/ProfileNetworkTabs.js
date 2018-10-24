import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
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
      following: null,
      followingPage: 0,
      page: 0,
      isFetching: true,
      value: this.props.tabPosition
    };

    this.signal = axios.CancelToken.source();
    this.onScroll = onScroll.bind(this);
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll(this.fetchNextPage), false);
    try {
      const { data: pages } = await fetchFollows(
        this.signal.token,
        this.state.context,
        this.state.page,
        this.props.userId
      );
      if (this.state.context === "userFollowers") {
        return this.setState({
          followers: [pages],
          followersPage: this.state.page + 1,
          isFetching: false
        });
      }

      return this.setState({
        following: [pages],
        followingPage: this.state.page + 1,
        isFetching: false
      });
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  }

  fetchNextPage = () => {};

  handleChange = (event, value) => {
    let context;
    value === 0 ? (context = "userFollowers") : (context = "userFollows");
    if (context === "userFollowers" && this.state.followers) {
      return this.setState({ value });
    }
    if (context === "userFollows" && this.state.following) {
      return this.setState({ value });
    }
    this.setState({ isFetching: true, value }, async () => {
      try {
        const { data: pages } = await fetchFollows(
          this.signal.token,
          context,
          this.state.page,
          this.props.userId
        );
        if (context === "userFollowers") {
          return this.setState(
            { isFetching: false, followers: [pages] },
            () => {}
          );
        }
        return this.setState({ isFetching: false, following: [pages] });
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
        {!this.state.isFetching &&
          this.state.value === 0 &&
          this.state.followers && (
            <Grid
              classes={{
                root: classes.gridRoot,
                circularProgress: classes.circularProgress
              }}
              gridContext="profiles"
              gridData={this.state.followers}
              userId={this.props.userId}
            />
          )}
        {!this.state.isFetching &&
          this.state.value === 1 &&
          this.state.following && (
            <Grid
              classes={{
                root: classes.gridRoot,
                circularProgress: classes.circularProgress
              }}
              gridContext="profiles"
              gridData={this.state.following}
              userId={this.props.userId}
            />
          )}
        {this.state.isFetching && (
          <Grid
            classes={{
              root: classes.gridRoot
            }}
            isFetching={true}
          />
        )}
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
