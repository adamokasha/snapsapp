const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');


const Album = mongoose.model('Album');

module.exports = (app) => {
  app.post('/api/albums', requireAuth, async (req, res) => {
    try {
      const {albumName, albumPosts } = req.body;
      const album = await new Album({
        name: albumName,
        _owner: req.user.id,
        coverImg: albumPosts[albumPosts.length - 1].imgUrl,
        createdAt: Date.now(),
        posts: albumPosts
      }).save();
      res.status(200).send(album);
    } catch(e) {
      console.log(e);
    }

  });
}