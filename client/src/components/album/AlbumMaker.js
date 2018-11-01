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
      pages: [],
      page: 0,
      hasMore: true,
      selected: [],
      albumName: this.props.albumName || "",
      isLoading: true,
      isFetching: false,
      isSaving: false
    };

    this.signal = axios.CancelToken.source();
  }

  async componentDidMount() {
    try {
      let allPostsData,
        albumPostsData = [],
        currentAlbumPostIds = [];

      if (this.props.albumId) {
        [{ data: allPostsData }, { data: albumPostsData }] = await axios.all([
          fetchAllUserPosts(this.signal.token, this.state.page),
          fetchAlbumPosts(this.signal.token, this.props.albumId)
        ]);

        currentAlbumPostIds = albumPostsData.map(imgData => imgData._id);
      } else {
        const { data: postsData } = await fetchAllUserPosts(
          this.signal.token,
          this.state.page
        );
        allPostsData = postsData;
      }

      this.setState(
        {
          pages: [...allPostsData],
          page: this.state.page + 1,
          selected: [...currentAlbumPostIds],
          currentAlbumPosts: [...albumPostsData],
          isLoading: false
        },
        () => {}
      );
    } catch (e) {
      if (axios.isCancel(e)) {
        return console.log(e.message);
      }
      console.log(e);
      this.setState(
        {
          isLoading: false,
          isSaving: false
        },
        () => {
          this.props.onSnackbarOpen &&
            this.props.onSnackbarOpen(
              "error",
              "Something went wrong! Try again."
            );
        }
      );
    }
  }

  onFetchNextPage = () => {
    console.log("called onfetchnextpage");
    this.setState({ isFetching: true }, async () => {
      try {
        const { data: postsData } = await fetchAllUserPosts(
          this.signal.token,
          this.state.page
        );

        if (!postsData.length) {
          return this.setState({
            hasMore: false,
            isFetching: false
          });
        }

        this.setState({
          isFetching: false,
          pages: [...this.state.pages, ...postsData],
          page: this.state.page + 1
        });
      } catch (e) {}
    });
  };

  componentWillUnmount() {
    this.signal.cancel("Async call cancelled.");
  }

  filterAlbumPhotos = () => {
    if (this.state.currentAlbumPosts.length > 0) {
      const currentAlbumPhotoIds = this.state.currentAlbumPosts.map(
        img => img._id
      );
      return this.state.pages.filter(
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
              isSaving: false
            },
            () => {
              this.props.onSnackbarOpen &&
                this.props.onSnackbarOpen(
                  "success",
                  "Album updated successfully!"
                );
              this.props.onAlbumNameSet &&
                this.props.onAlbumNameSet(this.state.albumName);
              this.props.onAlbumUpdate && this.props.onAlbumUpdate();
              // this.props.handleClose();
            }
          );
        }
        await createAlbum(this.signal.token, selected, albumName);
        this.setState(
          {
            isSaving: false
          },
          () => {
            this.props.onSnackbarOpen &&
              this.props.onSnackbarOpen("success", "Album added successfully!");
            this.props.handleClose();
          }
        );
      } catch (e) {
        if (axios.isCancel(e)) {
          return console.log(e.message);
        }
        this.setState(
          {
            isSaving: false
          },
          () => {
            this.props.onSnackbarOpen &&
              this.props.onSnackbarOpen(
                "error",
                "Something went wrong! Try again."
              );
          }
        );
      }
    });
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
        {this.state.value === 0 && (
          <AlbumMakerImageView
            selected={this.state.selected}
            onImageSelect={this.onImageSelect}
            imgData={this.state.pages}
            onFetchNextPage={this.onFetchNextPage}
          />
        )}
        {this.state.value === 1 && (
          <AlbumMakerImageView
            selected={this.state.selected}
            onImageSelect={this.onImageSelect}
            imgData={this.filterAlbumPhotos()}
            onFetchNextPage={this.onFetchNextPage}
          />
        )}
        {this.state.value === 2 && (
          <AlbumMakerImageView
            selected={this.state.selected}
            onImageSelect={this.onImageSelect}
            imgData={this.state.currentAlbumPosts}
          />
        )}

        <form className={classes.formContainer} onSubmit={this.onSaveAlbum}>
          <TextField
            id="outlined-name-input"
            label="Album Name"
            className={classes.textField}
            type="text"
            name="name"
            margin="normal"
            variant="outlined"
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
  albumId: PropTypes.string,
  albumName: PropTypes.string,
  method: PropTypes.string,
  onAlbumNameChange: PropTypes.func,
  onAlbumUpdate: PropTypes.func,
  onSnackbarOpen: PropTypes.func
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
