import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import ScrollView from "./ScrollView";

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
  scrollViewRoot: {
    paddingTop: `${theme.spacing.unit * 2}px`,
    height: "400px",
    overflowY: "scroll",
    [theme.breakpoints.up("sm")]: {
      height: "500px"
    }
  },
  circularLoader: {
    margin: "0 auto"
  }
});

class FullWidthTabs extends React.Component {
  state = {
    value: this.props.tabPosition
  };

  handleChange = (event, value) => {
    this.setState({ value });
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
        {this.state.value === 0 && (
          <ScrollView
            classes={{
              root: classes.scrollViewRoot,
              circularLoader: classes.circularLoader
            }}
            context="userFollowers"
            userId={this.props.userId}
          />
        )}
        {this.state.value === 1 && (
          <ScrollView
            classes={{
              root: classes.scrollViewRoot,
              circularLoader: classes.circularLoader
            }}
            context="userFollows"
            userId={this.props.userId}
          />
        )}
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  tabPosition: PropTypes.number.isRequired
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
