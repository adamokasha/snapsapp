import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import filesize from 'filesize';
import withStyles from '@material-ui/core/styles/withStyles';

import CustomSnackbar from './CustomSnackbar';

const styles = theme => ({
  paper: {
    position: 'relative',
    width: '95%',
    display: 'block',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '560px',
      overflowY: 'scroll'
    },
    [theme.breakpoints.up('sm')]: {
      width: '80%'
    },
    [theme.breakpoints.up('md')]: {
      width: '65%'
    },
    [theme.breakpoints.up('lg')]: {
      width: '45%'
    }
  },
  linearLoader: {
    position: 'absolute',
    top: '0',
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: '4%',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 1)'
  },
  heading: {
    marginBottom: `${theme.spacing.unit}px`
  },
  avatar: {
    margin: `${theme.spacing.unit}px auto`,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  blankImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    border: '1px dashed rgba(0, 0, 0, .5)',
    width: '50%',
    margin: '0 auto',
    borderRadius: '3%',
    [theme.breakpoints.up('sm')]: {
      width: '30%'
    },
    [theme.breakpoints.up('md')]: {
      width: '20%'
    }
  },
  blankIcon: {
    fontSize: '48px',
    color: 'rgba(0, 0, 0, .5)'
  },
  previewImage: {
    maxHeight: '100px',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
    margin: '0 auto',
    display: 'block'
  },
  fileInputContainer: {
    width: '85%',
    [theme.breakpoints.up('sm')]: {
      width: '50%'
    },
    [theme.breakpoints.up('md')]: {
      width: '40%'
    },
    margin: '0 auto'
  },
  fileInput: {
    display: 'none'
  },
  textField: {
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: '100%'
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    padding: `${theme.spacing.unit}px`
  },
  chipTag: {
    marginLeft: `${theme.spacing.unit}px`,
    marginBottom: `${theme.spacing.unit}px`
  },
  button: {
    width: '100%',
    marginTop: '5%'
  },
  aTag: {
    color: 'inherit',
    textDecoration: 'none'
  }
});

class ImageUploadForm extends React.Component {
  state = {
    post: {
      title: '',
      tags: [],
      description: ''
    },
    previewImage: '',
    file: null,
    fileSize: null,
    isLoading: false,
    postLinkObj: null,
    snackbarOpen: false,
    snackbarVar: null,
    snackbarMessage: null
  };

  onFileSelect = e => {
    const src = e.target.files[0] && URL.createObjectURL(e.target.files[0]);
    if (!src) {
      return;
    }
    this.setState({ previewImage: src });
    this.setState({
      file: e.target.files[0],
      fileSize: e.target.files[0].size
    });
  };

  onTitleChange = e => {
    const str = e.target.value;
    const cleanedStr = str.replace(/[^\w\s]/gi, '');
    this.setState({ post: { ...this.state.post, title: cleanedStr } });
  };

  onTagsChange = e => {
    const textInput = e.target.value;
    const tagsArr = textInput
      .replace(/[^\w\s]/gi, '')
      .trim()
      .replace(/\s\s+/g, ' ')
      .split(' ');

    const cleanedTagsArr = tagsArr
      .map(tag => tag.slice(0, 12))
      .slice(0, 5)
      .filter(tag => tag.length); // Edge case: empty string remains after clearing input

    this.setState({ post: { ...this.state.post, tags: cleanedTagsArr } });
  };

  onDescChange = e => {
    this.setState({
      post: { ...this.state.post, description: e.target.value }
    });
  };

  onSubmit = e => {
    try {
      e.preventDefault();

      this.setState({ isLoading: true }, async () => {
        const { post, file } = this.state;

        const data = new FormData();
        // name must match multer upload('name')
        data.append('image', file);
        data.append('data', JSON.stringify(post));

        const res = await fetch('/api/upload', {
          mode: 'no-cors',
          method: 'POST',
          body: data
        });

        const { postData } = await res.json();
        // Profile info pulled out of redux store to avoid a populate call to mongo db. Keeps upload process faster.
        const { _id, displayName, profilePhoto } = this.props.auth;
        postData._owner = {
          _id,
          displayName,
          profilePhoto
        };

        this.setState({ isLoading: false }, () => {
          this.setState(
            {
              postLinkObj: {
                pathname: `/post/${postData._id}`,
                state: { post: postData }
              }
            },
            () => {
              this.setState({
                snackbarOpen: true,
                snackbarVar: 'success',
                snackbarMessage: 'Click here to see your post!'
              });
            }
          );
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  onSnackbarOpen = () => {
    this.setState({ snackbarOpen: true }, () => {});
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Paper className={classes.paper}>
          {this.state.isLoading && (
            <LinearProgress
              className={classes.linearLoader}
              color="secondary"
            />
          )}
          <div className={classes.heading}>
            <Avatar className={classes.avatar}>
              <AddPhotoAlternate />
            </Avatar>
            <Typography align="center" variant="headline">
              Add Post
            </Typography>
          </div>
          <IconButton
            onClick={this.props.handleClose}
            className={classes.closeButton}
          >
            <Close />
          </IconButton>
          <form
            method="post"
            action=""
            encType="multipart/form-data"
            onSubmit={this.onSubmit}
          >
            <div>
              {this.state.previewImage ? (
                <img
                  src={this.state.previewImage}
                  alt="preview"
                  className={classes.previewImage}
                />
              ) : (
                <div className={classes.blankImage}>
                  <InsertDriveFileOutlinedIcon className={classes.blankIcon} />
                </div>
              )}
              <div>
                <Typography variant="caption">Limit: 2 MB</Typography>
                <Typography
                  color={
                    this.state.fileSize > 2097152 ? 'secondary' : 'default'
                  }
                  variant="caption"
                >
                  File size:{' '}
                  {this.state.file &&
                    filesize(this.state.file.size, { exponent: 2 })}
                </Typography>
              </div>
            </div>
            <div className={classes.fileInputContainer}>
              <Input
                className={classes.fileInput}
                id="hidden-file-input"
                name="image"
                type="file"
                onChange={this.onFileSelect}
                inputProps={{ accept: 'image/*' }}
              />
              <label htmlFor="hidden-file-input">
                <Button
                  variant="raised"
                  component="span"
                  className={classes.button}
                >
                  Browse for an Image File
                </Button>
              </label>
            </div>{' '}
            <TextField
              id="full-width"
              label="Title"
              placeholder="Give your photo a title"
              margin="normal"
              className={classes.textField}
              onChange={this.onTitleChange}
              inputProps={{ maxLength: 30 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {this.state.post.title.length}
                    /30
                  </InputAdornment>
                )
              }}
              value={this.state.post.title}
              required
            />{' '}
            <div className={classes.tagContainer}>
              {this.state.post.tags &&
                this.state.post.tags.map(tag => {
                  if (tag === '') {
                    return;
                  }
                  return <Chip className={classes.chipTag} label={tag} />;
                })}
            </div>
            <TextField
              id="full-width"
              label="Tags"
              placeholder="Enter a comma seperate list of tags for you photo"
              margin="normal"
              className={classes.textField}
              onChange={this.onTagsChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {this.state.post.tags.length}
                    /5 Tags
                  </InputAdornment>
                )
              }}
            />{' '}
            <TextField
              id="full-width"
              label="Description"
              placeholder="Write something about your photo here"
              margin="normal"
              className={classes.textField}
              onChange={this.onDescChange}
              inputProps={{ maxLength: 120 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {this.state.post.description.length}
                    /120
                  </InputAdornment>
                )
              }}
            />
            <Button
              color="primary"
              variant="contained"
              size="large"
              className={classes.button}
              type="submit"
              disabled={
                this.state.file &&
                this.state.fileSize < 2097152 &&
                this.state.post.title.length > 4 &&
                !this.state.isLoading
                  ? false
                  : true
              }
            >
              Save Post
            </Button>
          </form>
        </Paper>
        <CustomSnackbar
          variant={this.state.snackbarVar}
          message={
            this.state.postLinkObj && (
              <Link
                onClick={this.props.handleClose}
                className={classes.aTag}
                to={this.state.postLinkObj}
              >
                <p>{this.state.snackbarMessage}</p>
              </Link>
            )
          }
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
          snackbarOpen={this.state.snackbarOpen}
        />
      </React.Fragment>
    );
  }
}

ImageUploadForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(withRouter(ImageUploadForm));
