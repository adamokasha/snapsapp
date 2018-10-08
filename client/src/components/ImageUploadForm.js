import React from 'react';
import {withRouter} from 'react-router'
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Close from '@material-ui/icons/Close';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  paper: {
    position: 'relative',
    width: '95%',
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      width: '80%'
    },
    [theme.breakpoints.up('md')]: {
      width: '65%'
    },
    [theme.breakpoints.up('lg')]: {
      width: '45%'
    },
    // Stops shaking on focus
    minHeight: '550px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  linearLoader: {
    position: 'absolute',
    top: '0',
    width: '100%'
  },
  closeIcon: {
    position: 'absolute',
    right: '4%',
    cursor: 'pointer'
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
    [theme.breakpoints.up('sm')]: {
      width: '30%'
    },
    [theme.breakpoints.up('md')]: {
      width: '20%'
    },
    margin: '0 auto'
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
  button: {
    width: '100%',
    marginTop: '5%'
  }
});

class ImageUploadForm extends React.Component {
  state = {
    post: {
      title: '',
      tags: null,
      description: ''
    },
    previewImage: '',
    file: null,
    isLoading: false
  };

  onFileSelect = e => {
    const src = e.target.files[0]
      ? URL.createObjectURL(e.target.files[0])
      : null;
    if (!src) {
      return;
    }
    this.setState({ previewImage: src });
    this.setState({ file: e.target.files[0] });
  };

  onTitleChange = e => {
    this.setState({ post: { ...this.state.post, title: e.target.value } });
  };

  onTagsChange = e => {
    const textInput = e.target.value;
    const tagsArr = textInput
      .replace(/[^\w\s]/gi, '')
      .trim()
      .replace(/\s\s+/g, ' ')
      .split(' ');

    this.setState({ post: { ...this.state.post, tags: tagsArr } });
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

        const {postData} = await res.json();

        this.setState({ isLoading: false }, () => {
          // this.props.history.push({path: `/post/${postData._id}`, state: {post: postData}});
          this.props.handleClose();
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        {this.state.isLoading && (
          <LinearProgress className={classes.linearLoader} color="secondary" />
        )}
        <div className={classes.heading}>
          <Avatar className={classes.avatar}>
            <AddPhotoAlternate />
          </Avatar>
          <Typography align="center" variant="headline">
            Add Image
          </Typography>
        </div>
        <Close className={classes.closeIcon} onClick={this.props.handleClose} />
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
          </div>
          <div className={classes.fileInputContainer}>
            <Input
              accept="image/*"
              className={classes.fileInput}
              id="hidden-file-input"
              name="image"
              type="file"
              onChange={this.onFileSelect}
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
          />{' '}
          <TextField
            id="full-width"
            label="Tags"
            placeholder="Enter a comma seperate list of tags for you photo"
            margin="normal"
            className={classes.textField}
            onChange={this.onTagsChange}
          />{' '}
          <TextField
            id="full-width"
            label="Description"
            placeholder="Write something about your photo here"
            margin="normal"
            className={classes.textField}
            onChange={this.onDescChange}
          />
          <Button
            color="primary"
            variant="contained"
            size="large"
            className={classes.button}
            type="submit"
            disabled={this.state.isLoading ? true : false}
          >
            Save Post
          </Button>
        </form>
      </Paper>
    );
  }
}

ImageUploadForm.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles)(withRouter(ImageUploadForm));
