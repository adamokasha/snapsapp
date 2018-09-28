import React from 'react';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import axios from 'axios';

import { updateProfile } from '../actions/auth';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  paper: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: `${theme.spacing.unit * 2}px`
  },
  editButtons: {
    position: 'absolute',
    top: '1%',
    right: '2%'
  },
  hideEditButtons: {
    display: 'none'
  },
  avatarContainer: {
    display: 'flex',
    marginBottom: `${theme.spacing.unit * 2}px`
  },
  userText: {
    marginLeft: `${theme.spacing.unit}px`
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    width: '100%%'
  },
  socialText: {
    // Stops shaking when edit toggled
    marginTop: `${theme.spacing.unit * 3}px`,
    marginBottom: `12px`
  },
  textField: {
    width: '65%',
    marginLeft: `${theme.spacing.unit}px`,
    marginRight: `${theme.spacing.unit * 3}px`
  },
  disabledCursor: {
    cursor: 'pointer'
  },
  button: {
    marginTop: `${theme.spacing.unit * 2}px`,
    width: '100%',
    margin: '0 auto'
  }
});

export class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editEnabled: false,
      ownProfile: false,
      displayName: this.props.profile ? this.profile.displayName : '',
      profilePhoto: this.props.profile ? this.profile.profilePhoto : '',
      joined: this.props.profile ? this.display.joined : '',
      name: this.props.profile ? this.props.profile.name : '',
      website: this.props.profile ? this.props.profile.website : '',
      facebook: this.props.profile ? this.props.profile.facebook : '',
      gplus: this.props.profile ? this.props.profile.gplus : '',
      twitter: this.props.profile ? this.props.profile.twitter : '',
      about: this.props.profile ? this.props.profile.about : ''
    };
  }

  async componentDidMount() {
    try {
      const res = await axios.get(`/api/profile/get/${this.props.user}`);
      const { profilePhoto, joined, displayName, profile } = res.data;
      this.setState({ profilePhoto, displayName, joined, ...profile }, () => {
        return this.checkIfProfileOwner();
      });
    } catch (e) {
      console.log(e);
    }
  }

  checkIfProfileOwner = () => {
    if (this.props.auth && this.props.auth.displayName === this.props.user) {
      this.setState({ ownProfile: true }, () => {});
    }
  };

  enableEdit = () => {
    this.setState({ editEnabled: true });
  };

  cancelEdit = () => {
    this.setState({
      ...this.state,
      editEnabled: false,
      ...this.props.auth.profile
    });
  };

  onSubmit = async e => {
    e.preventDefault();

    try {
      const { name, website, facebook, gplus, twitter, about } = this.state;
      const profile = {
        profile: {
          name,
          website,
          facebook,
          gplus,
          twitter,
          about
        }
      };
      await axios.post('/api/profile/update', profile);
      console.log(profile);
      this.props.updateProfile(profile);
      this.setState({ editEnabled: false });
    } catch (e) {
      console.log(e);
    }
  };

  onNameChange = e => {
    this.setState({ name: e.target.value });
  };
  onWebsiteChange = e => {
    this.setState({ website: e.target.value });
  };
  onFacebookChange = e => {
    this.setState({ facebook: e.target.value });
  };
  onGplusChange = e => {
    this.setState({ gplus: e.target.value });
  };
  onTwitterChange = e => {
    this.setState({ twitter: e.target.value });
  };
  onAboutChange = e => {
    this.setState({ about: e.target.value });
  };

  onLinkClick = e => {
    var win = window.open(`http://${e.target.value}`, '_blank');
    win.focus();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div
            className={
              this.state.ownProfile
                ? classes.editButtons
                : classes.hideEditButtons
            }
          >
            {this.state.editEnabled ? (
              <IconButton onClick={this.cancelEdit}>
                <CancelTwoToneIcon />
              </IconButton>
            ) : (
              <IconButton onClick={this.enableEdit}>
                <EditTwoToneIcon />
              </IconButton>
            )}
          </div>
          <form onSubmit={this.onSubmit} className={classes.form}>
            <div className={classes.avatarContainer}>
              <Avatar>
                <img src={`${this.state.profilePhoto}`} alt="avatar" />
              </Avatar>
              <div className={classes.userText}>
                <Typography variant="body2">
                  {this.state.displayName}
                </Typography>
                <Typography variant="caption">
                  Member since {this.state.joined}
                </Typography>
              </div>
            </div>
            <Divider />
            <div className={classes.fieldGroup}>
              <Typography variant="body2">Name:</Typography>
              <TextField
                margin="normal"
                inputProps={{style: {color: '#000'}}}
                disabled={this.state.editEnabled ? false : true}
                className={classes.textField}
                value={this.state.name}
                onChange={this.onNameChange}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography variant="body2">Website: </Typography>
              <TextField
                className={classes.textField}
                margin="normal"
                onClick={this.state.editEnabled ? null : this.onLinkClick}
                inputProps={
                  this.state.editEnabled ? {} : { style: { cursor: 'pointer', color: '#000' } }
                }
                disabled={this.state.editEnabled ? false : true}
                value={this.state.website}
                onChange={this.onWebsiteChange}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography className={classes.socialText} variant="body2">
                Facebook:{' '}
              </Typography>
              <TextField
                margin="normal"
                className={classes.textField}
                inputProps={
                  this.state.editEnabled ? {} : { style: { cursor: 'pointer', color: '#3b5999' } }
                }
                disabled={this.state.editEnabled ? false : true}
                onClick={this.state.editEnabled ? null : this.onLinkClick}
                value={this.state.facebook}
                onChange={this.onFacebookChange}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography className={classes.socialText} variant="body2">
                Google+:{' '}
              </Typography>
              <TextField
                margin="normal"
                className={classes.textField}
                inputProps={
                  this.state.editEnabled ? {} : { style: { cursor: 'pointer', color: '#dd4b39' } }
                }
                disabled={this.state.editEnabled ? false : true}
                onClick={this.state.editEnabled ? null : this.onLinkClick}
                value={this.state.gplus}
                onChange={this.onGplusChange}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography className={classes.socialText} variant="body2">
                Twitter:{' '}
              </Typography>
              <TextField
                margin="normal"
                className={classes.textField}
                inputProps={
                  this.state.editEnabled ? {} : { style: { cursor: 'pointer', color: '#55acee' } }
                }
                disabled={this.state.editEnabled ? false : true}
                onClick={this.state.editEnabled ? null : this.onLinkClick}
                value={this.state.twitter}
                onChange={this.onTwitterChange}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography variant="body2">About Me: </Typography>
              <TextField
                margin="normal"
                multiline
                rows={3}
                inputProps={{style: {color: '#000'}}}
                className={classes.textField}
                disabled={this.state.editEnabled ? false : true}
                value={this.state.about}
                onChange={this.onAboutChange}
              />
            </div>

            {this.state.ownProfile ? (
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            ) : null}
          </form>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

Profile.propTypes = {
  user: PropTypes.string.isRequired
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateProfile }
  )
)(Profile);
