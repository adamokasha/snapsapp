import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HowToReg from '@material-ui/icons/HowToReg';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '50%',
    margin: '0 auto',
    minHeight: '250px'
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  subheading: {
    marginTop: theme.spacing.unit
  },
  textField: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%'
  },
  button: {
    marginTop: '5%',
    width: '100%'
  }
});

class DisplayNameForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: ''
    };
  }

  onDisplayNameChange = (e) => {
    this.setState({ displayName: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    // ! NOTE: With MUI must explicitly set Button type="submit"
    this.props.onSubmit(this.state.displayName);
  }

  render() {
    const { classes } = this.props;
    console.log(this.props.onSubmit);

    return (
      <React.Fragment>
        <main className={classes.layout}>
          <Paper className={classes.paper} elevation={1}>
            <Avatar className={classes.avatar}>
              <HowToReg />
            </Avatar>
            <Typography variant="headline">Display Name</Typography>
            <Typography
              align="center"
              variant="subheading"
              className={classes.subheading}
            >
              Thanks for authenticating. Please choose a display name to
              complete registration.
            </Typography>
            <form onSubmit={this.onSubmit} className={classes.container} noValidate autoComplete="off">
              <TextField
                autoFocus
                required
                id="displayName"
                label="Display Name"
                className={classes.textField}
                margin="normal"
                onChange={this.onDisplayNameChange}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
              >
                Complete Registration
              </Button>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

// function DisplayNameForm(props) {
//   const { classes } = props;

//   return (
//     <React.Fragment>
//       <main className={classes.layout}>
//         <Paper className={classes.paper} elevation={1}>
//           <Avatar className={classes.avatar}>
//             <HowToReg />
//           </Avatar>
//           <Typography variant="headline">Display Name</Typography>
//           <Typography
//             align="center"
//             variant="subheading"
//             className={classes.subheading}
//           >
//             Thanks for authenticating. Please choose a display name to complete registration.
//           </Typography>
//           <form className={classes.container} noValidate autoComplete="off">
//             <TextField
//               autoFocus
//               required
//               id="displayName"
//               label="Display Name"
//               className={classes.textField}
//               margin="normal"
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               className={classes.button}
//             >
//               Complete Registration
//             </Button>
//           </form>
//         </Paper>
//       </main>
//     </React.Fragment>
//   );
// }

DisplayNameForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DisplayNameForm);
