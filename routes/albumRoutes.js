const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const Album = mongoose.model("Album");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

module.exports = app => {
  // Add new album
  app.post("/api/albums", requireAuth, async (req, res) => {
    try {
      const { albumName, albumPosts } = req.body;

      // Default cover image: last image in array
      const coverImgId = albumPosts[albumPosts.length - 1];
      const coverImgDoc = await Post.findById({ _id: coverImgId }, "imgUrl");

      const album = await new Album({
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

  // ScrollView context: User albums
  app.get("/api/albums/all/:user/:page", async (req, res) => {
    try {
      const { user, page } = req.params;
      const userId = await User.find({ displayName: user }, "_id");
      const albums = await Album.find({ _owner: userId }, "_id name coverImg")
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
  app.get("/api/albums/myalbums", requireAuth, async (req, res) => {
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
      const album = await Album.findById(id, "posts");

      const posts = await Post.find({ _id: { $in: album.posts } })
        .limit(12)
        .skip(12 * page)
        .populate("_owner", "displayName profilePhoto");

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // Update an album
  app.patch("/api/albums/update/:id", requireAuth, async (req, res) => {
    try {
      const { albumName, albumPosts } = req.body;
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
};
