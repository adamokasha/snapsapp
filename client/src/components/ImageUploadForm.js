import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Close from '@material-ui/icons/Close';
import withStyles from '@material-ui/core/styles/withStyles';

import { submitPost } from '../actions/posts';

const styles = theme => ({
  root: {
    margin: `${theme.spacing.unit * 3}px 0`
  },
  layout: {
    width: '95%',
    display: 'block',
    margin: '0 auto',
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
  paper: {
    position: 'relative',
    minHeight: '300px',
    margin: `${theme.spacing.unit * 3}px auto`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  closeIcon: {
    position: 'absolute',
    right: '4%',
    cursor: 'pointer'
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
  previewImage: {
    maxHeight: '250px',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
    margin: '0 auto',
    display: 'block'
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
    file: null
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
    const tagsArr = textInput.replace(/[^\w\s]/gi, '').trim().replace(/\s\s+/g, ' ').split(' '); 

    this.setState({ post: { ...this.state.post, tags: tagsArr } });
  };

  onDescChange = e => {
    this.setState({
      post: { ...this.state.post, description: e.target.value }
    });
  };

  onSubmit = async e => {
    e.preventDefault();
    const { post, file } = this.state;

    await this.props.submitPost(post, file, this.props.history);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AddPhotoAlternate />
            </Avatar>
            <Typography align="center" variant="headline">
              Add Image
            </Typography>
            <Close
              className={classes.closeIcon}
              onClick={this.props.handleClose}
            />
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
                ) : null}
              </div>
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
                  Click to Choose an Image File
                </Button>
              </label>{' '}
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
                multiline
                rows={4}
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
              >
                Save Post
              </Button>
            </form>
          </Paper>
        </main>
      </div>
    );
  }
}

ImageUploadForm.propTypes = {
  classes: PropTypes.object.isRequired
};

// export default withStyles(styles)(ImageUploadForm);

const mapStateToProps = state => ({
  id: state.auth._id
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { submitPost }
  )
)(withRouter(ImageUploadForm));
