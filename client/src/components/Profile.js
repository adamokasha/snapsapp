import React from 'react';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';

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
  textField: {
    width: '65%',
    marginLeft: `${theme.spacing.unit}px`,
    marginRight: `${theme.spacing.unit * 3}px`
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
      editEnabled: false
    };
  }

  enableEdit = () => {
    this.setState({ editEnabled: true });
  };

  cancelEdit = () => {
    this.setState({ editEnabled: false });
  };

  render() {
    const { auth } = this.props;

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={auth ? classes.editButtons : classes.hideEditButtons}>
            {
              this.state.editEnabled ? (
              <IconButton onClick={this.cancelEdit}>
                <CancelTwoToneIcon />
              </IconButton>
            ) : (
              <IconButton onClick={this.enableEdit}>
                <EditTwoToneIcon />
              </IconButton>
            )
          }
          </div>
          <form className={classes.form}>
            <div className={classes.avatarContainer}>
              <Avatar>SO</Avatar>
              <div className={classes.userText}>
                <Typography variant="body2">Sam Okasha</Typography>
                <Typography variant="caption">Member since 09/18</Typography>
              </div>
            </div>
            <Divider />
            <div className={classes.fieldGroup}>
              <Typography variant="body2">Name:</Typography>
              <TextField
                margin="normal"
                value="Sam Okasha"
                disabled={this.state.editEnabled ? false : true}
                className={classes.textField}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography variant="body2">Website: </Typography>
              <TextField
                className={classes.textField}
                margin="normal"
                disabled={this.state.editEnabled ? false : true}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography variant="body2">Facebook: </Typography>
              <TextField
                margin="normal"
                className={classes.textField}
                disabled={this.state.editEnabled ? false : true}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography variant="body2">Google+: </Typography>
              <TextField
                margin="normal"
                className={classes.textField}
                disabled={this.state.editEnabled ? false : true}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography variant="body2">Twitter: </Typography>
              <TextField
                margin="normal"
                className={classes.textField}
                disabled={this.state.editEnabled ? false : true}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Typography variant="body2">About Me: </Typography>
              <TextField
                margin="normal"
                multiline
                rows={3}
                className={classes.textField}
                disabled={this.state.editEnabled ? false : true}
              />
            </div>

            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Profile);
