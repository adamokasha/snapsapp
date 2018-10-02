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
    flexGrow: 1,
    width: '30%',
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    paddingBottom: `${theme.spacing.unit}px`,
    borderRadius: '3px'
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
            <Tab label="Followers" />
            <Tab label="Following" />
          </Tabs>
        </AppBar>
        {this.state.value === 0 ? <p>Tab 0</p> : null}
        {this.state.value === 1 ? (
          <ScrollView context="userFollows" userId={this.props.userId} />
        ) : null}
      </div>
    );
  }
}

/*<ScrollView context="userFollowing" user={this.props.userId} />*/

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  tabPosition: PropTypes.number.isRequired
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
