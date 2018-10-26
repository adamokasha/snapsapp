import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

import AlbumMakerImageView from "./AlbumMakerImageView";
import CustomSnackbar from "../snackbar/CustomSnackbar";
import { fetchAllUserPosts } from "../../async/posts";
import { fetchAlbumPosts, createAlbum, updateAlbum } from "../../async/albums";

class AlbumMaker extends React.Component {
  constructor(props) {
    super(props);

    // selected should always be only a list of post _id's
    // posts and album posts are objs with _id and imgUrl keys
    this.state = {
      value: 1,
      currentAlbumPosts: [],
      posts: [],
      selected: [],
      albumName: this.props.albumName || "",
      isLoading: false,
      isSaving: false,
      snackbarOpen: false,
      snackbarVar: "success",
      snackbarMessage: "success"
    };

    this.signal = axios.CancelToken.source();
  }

  componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      try {
        // fetch all posts
        const { data } = await fetchAllUserPosts(this.signal.token);
        this.setState({ posts: [...data] }, async () => {
          // retrieve current album posts from db (editing an album)
          if (this.props.albumId) {
            const { data } = await fetchAlbumPosts(
              this.signal.token,
              this.props.albumId
            );
            const currentAlbumPostIds = data.map(imgData => imgData._id);
            return this.setState(
              {
                selected: [...currentAlbumPostIds],
                currentAlbumPosts: [...data],
                isLoading: false
              },
              () => {}
            );
          }
          this.setState({ isLoading: false });
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        this.setState(
          {
            isSaving: false,
            snackbarVar: "error",
            snackbarMessage: "Something went wrong! Try again."
          },
          () => {
            this.onSnackbarSet();
          }
        );
      }
    });
  }

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
  }

  filterAlbumPhotos = () => {
    if (this.state.currentAlbumPosts.length > 0) {
      const currentAlbumPhotoIds = this.state.currentAlbumPosts.map(
        img => img._id
      );
      return this.state.posts.filter(
        img => !currentAlbumPhotoIds.includes(img._id)
      );
    }

    return this.state.currentAlbumPosts;
  };

  onTabChange = (event, value) => {
    this.setState({ value });
  };

  onImageSelect = imgId => {
    // Already in selected, so filter out;
    if (this.state.selected.includes(imgId)) {
      const filtered = this.state.selected.filter(img => img !== imgId);
      return this.setState({ selected: filtered });
    }
    this.setState({ selected: [...this.state.selected, imgId] });
  };

  onAlbumNameChange = e => {
    this.setState({ albumName: e.target.value });
  };

  onSaveAlbum = e => {
    e.preventDefault();
    this.setState({ isSaving: true }, async () => {
      try {
        const { selected, albumName } = this.state;
        if (this.props.method === "patch") {
          await updateAlbum(
            this.signal.token,
            this.props.albumId,
            albumName,
            selected
          );
          return this.setState(
            {
              isSaving: false,
              snackbarVar: "success",
              snackbarMessage: "Album updated successfully!"
            },
            () => {
              this.onSnackbarSet();
              this.props.handleClose();
            }
          );
        }
        await createAlbum(this.signal.token, selected, albumName);
        this.setState(
          {
            isSaving: false,
            snackbarVar: "success",
            snackbarMessage: "Album created successfully!"
          },
          () => {
            this.onSnackbarSet();
            this.props.handleClose();
          }
        );
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        this.setState(
          {
            isSaving: false,
            snackbarVar: "error",
            snackbarMessage: "Something went wrong! Try again."
          },
          () => {
            this.onSnackbarSet();
          }
        );
      }
    });
  };

  onSnackbarSet = () => {
    const { snackbarVar, snackbarMessage } = this.state;
    this.props.onSnackbarSet(snackbarVar, snackbarMessage);
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.onTabChange} centered>
            <Tab
              classes={{
                labelContainer: classes.tabLabelContainer,
                label: classes.tabLabel
              }}
              label="All Photos"
            />
            <Tab
              classes={{
                labelContainer: classes.tabLabelContainer,
                label: classes.tabLabel
              }}
              label="Non-Album Photos"
            />
            <Tab
              classes={{
                labelContainer: classes.tabLabelContainer,
                label: classes.tabLabel
              }}
              label="Album Photos"
            />
          </Tabs>
        </AppBar>
        {this.state.isSaving && (
          <LinearProgress
            className={classes.linearProgress}
            color="secondary"
          />
        )}
        {this.state.isLoading && (
          <div className={classes.circularProgress}>
            <CircularProgress color="secondary" />
          </div>
        )}
        {this.state.value === 0 ? (
          <AlbumMakerImageView
            selected={this.state.selected}
            onImageSelect={this.onImageSelect}
            imgData={this.state.posts}
          />
        ) : null}
        {this.state.value === 1 ? (
          <AlbumMakerImageView
            selected={this.state.selected}
            onImageSelect={this.onImageSelect}
            imgData={this.filterAlbumPhotos()}
          />
        ) : null}
        {this.state.value === 2 ? (
          <AlbumMakerImageView
            selected={this.state.selected}
            onImageSelect={this.onImageSelect}
            imgData={this.state.currentAlbumPosts}
          />
        ) : null}

        <form className={classes.formContainer} onSubmit={this.onSaveAlbum}>
          <TextField
            id="outlined-name-input"
            label="Album Name"
            className={classes.textField}
            type="text"
            name="name"
            margin="normal"
            variant="filled"
            onChange={this.onAlbumNameChange}
            value={this.state.albumName}
          />
          <Button
            variant="contained"
            type="submit"
            className={classes.button}
            disabled={this.state.isSaving}
          >
            <SaveIcon className={classes.leftIcon} />
            Save
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => this.props.handleClose()}
            disabled={this.state.isSaving}
          >
            <CloseIcon className={classes.leftIcon} />
            Close
          </Button>
        </form>
        <CustomSnackbar
          variant={this.state.snackbarVar}
          snackbarOpen={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
        />
      </div>
    );
  }
}

AlbumMaker.propTypes = {
  classes: PropTypes.object.isRequired,
  method: PropTypes.string.isRequired,
  withSnackbar: PropTypes.bool.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: "95%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    paddingBottom: `${theme.spacing.unit}px`,
    borderRadius: "3px",
    [theme.breakpoints.up("sm")]: {
      width: "80%"
    },
    [theme.breakpoints.up("md")]: {
      width: "60%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "40%"
    },
    [theme.breakpoints.up("xl")]: {
      width: "30%"
    }
  },
  tabLabelContainer: {
    [theme.breakpoints.down("sm")]: {
      padding: "6px",
      fontWeight: 600
    }
  },
  tabLabel: {
    [theme.breakpoints.down("sm")]: {
      fontSize: ".7rem"
    }
  },
  circularProgress: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  linearProgress: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0
  },
  imgContainer: {
    position: "relative"
  },
  dummyImg: {
    height: "200px",
    width: "auto",
    marginLeft: "8px"
  },
  checkIconContainer: {
    position: "absolute",
    top: "1%",
    right: "1%",
    backgroundColor: "#fff",
    width: "28px",
    height: "28px",
    borderRadius: "5px",
    opacity: "0.8"
  },
  hiddenIconContainer: {
    display: "none"
  },
  checkIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  imgSelected: {
    height: "200px",
    width: "auto",
    marginLeft: "8px",
    border: "2px solid #000"
  },
  formContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

export default withStyles(styles)(AlbumMaker);
