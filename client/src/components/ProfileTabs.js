import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from "axios";

import ScrollView from "./ScrollView";
import { clearPosts } from "../actions/posts";
import { fetchForProfilePage } from "../async/scrollview";

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
      isFetching: false
    };

    this.signal = axios.CancelToken.source();
  }

  handleChange = (event, value) => {
    this.props.clearPosts();
    this.setState({ value, isFetching: true }, async () => {
      const mappedValToContext = {
        0: "userFaves",
        1: "userPosts",
        2: "userAlbums"
      };
      await fetchForProfilePage(
        this.signal.token,
        mappedValToContext[value],
        0,
        this.props.user
      );

      this.setState({ isFetching: false }, () => {});
    });
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
          this.props.posts && (
            <ScrollView
              gridContext="posts"
              pages={this.props.posts}
              user={this.props.user}
              isFetching={this.state.isFetching}
            />
          )}
        {this.state.value === 1 &&
          this.props.posts && (
            <ScrollView
              gridContext="posts"
              pages={this.props.posts}
              user={this.props.user}
              isFetching={this.state.isFetching}
            />
          )}
        {this.state.value === 2 &&
          this.props.albums && (
            <ScrollView
              gridContext="albums"
              pages={this.props.albums}
              user={this.props.user}
              isFetching={this.state.isFetching}
            />
          )}
      </div>
    );
  }
}

const mapStatetoProps = ({ albums, posts }) => ({
  albums,
  posts
});

ProfileTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  profileTabPos: PropTypes.number
};

export default compose(
  withStyles(styles),
  connect(
    mapStatetoProps,
    { clearPosts }
  )
)(ProfileTabs);
