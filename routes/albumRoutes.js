const mongoose = require("mongoose");

const requireRegistration = require("../middlewares/requireRegistration");

const Album = mongoose.model("Album");
const Post = mongoose.model("Post");
const Faves = mongoose.model("Faves");
const User = mongoose.model("User");

module.exports = app => {
  // Add new album
  app.post("/api/albums", requireRegistration, async (req, res) => {
    try {
      const { albumName, albumPosts } = req.body;

      if (albumPosts.length > 100) {
        return res
          .status(400)
          .send({ error: "Exceeded the limit of images per album." });
      }

      // Default cover image: last image in array
      const coverImgId = albumPosts[albumPosts.length - 1];
      const coverImgDoc = await Post.findById({ _id: coverImgId }, "imgUrl");

      const album = await new Album({
        _displayName: req.user.displayName,
        name: albumName,
        _owner: req.user.id,
        coverImg: coverImgDoc.imgUrl,
        createdAt: Date.now(),
        posts: albumPosts
      }).save();
      res.status(200).send(album);
    } catch (e) {
      console.log(e);
    }
  });

  // ProfileActivity context: User albums
  app.get("/api/albums/all/:user/:page", async (req, res) => {
    try {
      const { user, page } = req.params;
      const albums = await Album.find(
        { _displayName: user },
        "_id name coverImg"
      )
        .sort({ createdAt: -1 })
        .limit(15)
        .skip(15 * page)
        .populate("_owner", "displayName")
        .exec();
      res.status(200).send(albums);
    } catch (e) {
      console.log(e);
    }
  });

  // Get a user's albums (protected)
  app.get("/api/albums/myalbums", requireRegistration, async (req, res) => {
    try {
      const userId = req.user.id;
      const albums = await Album.find(
        { _owner: userId },
        "_id name coverImg"
      ).populate("_owner", "displayName");
      res.status(200).send(albums);
    } catch (e) {
      console.log(e);
    }
  });

  // Get a single album, only imgUrls (for AlbumMaker)
  app.get("/api/albums/get/:id", async (req, res) => {
    try {
      const album = await Album.findById(req.params.id, "posts");
      const posts = await Post.find({ _id: { $in: album.posts } }, "imgUrl");
      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // Get a single album with all Post properties (for SingleAlbumPage)
  app.get("/api/albums/full/:id/:page", async (req, res) => {
    try {
      const { id, page } = req.params;

      const album = await Album.findById(id)
        .where("posts")
        .slice(page * 12, page * 12 + 12)
        .populate({
          path: "posts",
          populate: {
            path: "_owner",
            model: "User",
            select: "displayName profilePhoto"
          }
        })
        .exec();

      if (req.user && req.user.registered && album.posts.length) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          "_faves",
          { lean: true }
        );
        const { _faves } = favesDoc;

        album.posts.forEach(post => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.send(album);
      }

      res.status(200).send(album);
    } catch (e) {
      console.log(e);
    }
  });

  // Update an album
  app.patch("/api/albums/update/:id", requireRegistration, async (req, res) => {
    try {
      const { albumName, albumPosts } = req.body;
      if (albumPosts.length > 100) {
        return res
          .status(400)
          .send({ error: "Exceeded the limit of images per album." });
      }
      const album = await Album.findById({ _id: req.params.id });

      if (album._owner.toHexString() !== req.user.id) {
        return res
          .status(401)
          .send({ error: "You are not authorized to edit this album" });
      }

      await album.update({ name: albumName, posts: [...albumPosts] });
      res.status(200).send(album);
    } catch (e) {
      console.log(e);
    }
  });

  // Delete an album
  app.delete("/api/albums/delete", async (req, res, next) => {
    try {
      const { id: albumId } = req.query;
      await Album.findOneAndDelete({
        _id: albumId,
        _owner: req.user.id
      });

      res.status(200).send({ success: "Album deleted successfully." });
    } catch (e) {
      res.status(400).send({ error: "Album could not be deleted." });
      console.log(e);
    }
  });
};
