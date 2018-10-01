import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import ScrollView from './ScrollView';

const styles = theme => ({
  root: {
    marginTop: `${theme.spacing.unit * 3}px`,
    backgroundColor: theme.palette.background.paper,
    width: '100%'
  }
});

class FullWidthTabs extends React.Component {
  state = {
    value: 1
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

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
            <Tab label="Faves" />
            <Tab label="Posts" />
            <Tab label="Albums" />
          </Tabs>
        </AppBar>
        {this.state.value === 0 ? (
          <ScrollView context="userFaves" user={this.props.user} /> 
        ) : null}
        {this.state.value === 1 ? (
          <ScrollView context="userPosts" user={this.props.user} />
        ) : null}
        {this.state.value === 2 ? <ScrollView context="userAlbums" user={this.props.user} /> : null}
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
