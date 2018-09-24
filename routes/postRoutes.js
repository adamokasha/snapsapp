const requireAuth = require('../middlewares/requireAuth');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Faves = mongoose.model('Faves');

module.exports = app => {
  app.get('/api/posts/:page', (req, res) => {
    const { page } = req.params;

    Post.find({})
      .limit(12)
      .skip(12 * page)
      .populate({
        path: '_owner',
        select: 'profilePhoto displayName'
      })
      .exec((err, posts) => {
        if (err) {
          res.send(err);
        } else {
          res.send(posts);
        }
      });
  });

  app.post('/api/posts/fave/:id', requireAuth, async (req, res) => {
    try {
      const fave = await Faves.findOne({ _owner: req.user.id , _faves: {$in: {_id: req.params.id}}});
      if(!fave) {
        await Faves.findOneAndUpdate(
          {_owner: req.user.id},
          { $push: { _faves: req.params.id } },
          { upsert: true }
        );
        return res.status(200).send({ success: 'Post faved!' });
      }
      
      await Faves.findOneAndUpdate(
        {_owner: req.user.id},
        { $pull: { _faves: req.params.id } },
        { upsert: true }
      )

      res.status(200).send({ success: 'Post unfaved!' });      
    } catch (e) {
      res.status(400).send(e);
    }
  });
};
