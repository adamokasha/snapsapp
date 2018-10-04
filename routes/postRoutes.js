const requireAuth = require('../middlewares/requireAuth');
const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Faves = mongoose.model('Faves');
const Follows = mongoose.model('Follows');

module.exports = app => {
  // ScrollView context: New
  app.get('/api/posts/new/:page', async (req, res) => {
    try {
      const { page } = req.params;

      const posts = await Post.find({})
        .sort({ createdAt: -1 })
        .limit(12)
        .skip(12 * page)
        .populate({
          path: '_owner',
          select: 'profilePhoto displayName'
        })
        .exec();

      if (req.user) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          '_faves',
          { lean: true }
        );
        const { _faves } = favesDoc;

        posts.forEach(post => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.send(posts);
      }

      res.send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // ScrollView context: Popular
  app.get('/api/posts/popular/:page', async (req, res) => {
    try {
      const { page } = req.params;

      const posts = await Post.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: 12 * page },
        { $limit: 12 },
        { $sort: { faveCount: -1 } }
      ]).exec();

      await Post.populate(posts, {
        path: '_owner',
        select: 'displayName profilePhoto'
      });

      if (req.user) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          '_faves',
          { lean: true }
        );
        const { _faves } = favesDoc;

        posts.forEach(post => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.send(posts);
      }

      res.send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // ScrollView context: Follows Feed
  app.get('/api/posts/follows/:page', requireAuth, async (req, res) => {
    try {
      const { page } = req.params;
      const follows = await Follows.find({ _owner: req.user.id }, 'follows');
      console.log('FOLLOWS: ', follows[0].follows);
      const posts = await Post.find({ _owner: { $in: follows[0].follows } })
        .sort({ createdAt: -1 })
        .limit(12)
        .skip(12 * page)
        .populate({ path: '_owner', select: 'displayName profilePhoto' })
        .exec();

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // ScrollView context: User posts all
  app.get('/api/posts/user/all/:user/:page', async (req, res) => {
    try {
      const { page, user } = req.params;
      console.log(page, user);

      const userId = await User.find({ displayName: user }, '_id');
      console.log(userId);
      const posts = await Post.find({ _owner: userId })
        .populate({
          path: '_owner',
          select: 'profilePhoto displayName'
        })
        .limit(6)
        .skip(6 * page)
        .exec();

      if (req.user) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          '_faves',
          { lean: true }
        );
        const { _faves } = favesDoc;

        posts.forEach(post => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.status(200).send(posts);
      }

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // ScrollView context: User faves all
  app.get('/api/posts/user/faves/:user/:page', async (req, res) => {
    try {
      const { page, user } = req.params;

      const userId = await User.find({ displayName: user }, '_id');
      const faves = await Faves.find({ _owner: userId })
        .populate({
          path: '_faves',
          select: '_id'
        })
        .exec();

      const favesArray = faves[0]._faves;

      const posts = await Post.find({ _id: { $in: favesArray } })
        .populate({ path: '_owner', select: 'profilePhoto displayName' })
        .limit(6)
        .skip(6 * page)
        .exec();

      if (req.user) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          '_faves',
          { lean: true }
        );
        const { _faves } = favesDoc;

        posts.forEach(post => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.status(200).send(posts);
      }

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // Get all user posts (protected)
  app.get('/api/posts/myposts/all', requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const posts = await Post.find({ _owner: userId }, 'imgUrl');
      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // Get post comments
  app.get('/api/posts/comments/all/:postId', async (req, res) => {
    try {
      const postComments = await Post.findOne(
        { _id: req.params.postId },
        'comments'
      );
      res.status(200).send(postComments);
    } catch (e) {
      console.log(e);
    }
  });

  // Add a comment
  app.post('/api/posts/comments/add/:postId', requireAuth, async (req, res) => {
    try {
      const { commentBody } = req.body;
      const comment = {
        _owner: req.user.id,
        createdAt: Date.now(),
        body: commentBody
      };
      const postComment = await Post.findOneAndUpdate(
        { _id: req.params.postId },
        { $push: { comments: comment } },
        {new: true}
      );
      res.status(200).send({success: 'Comment added'});
    } catch (e) {
      console.log(e);
    }
  });

  // Search by tag or title
  app.post('/api/posts/search/:page', async (req, res) => {
    try {
      const { searchTerms } = req.body;
      const { page } = req.params;

      const posts = await Post.find({
        $or: [
          { tags: { $in: searchTerms } },
          { title_lower: { $in: searchTerms } }
        ]
      })
        .populate({ path: '_owner', select: 'profilePhoto displayName' })
        .limit(12)
        .skip(12 * page)
        .exec();

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // Fave
  app.post('/api/posts/fave/:id', requireAuth, async (req, res) => {
    try {
      const postId = mongoose.Types.ObjectId(req.params.id);
      const fave = await Faves.findOne(
        {
          _owner: req.user.id,
          _faves: postId
        },
        { '_faves.$': postId }
      );
      console.log(fave);
      if (!fave) {
        await Faves.findOneAndUpdate(
          { _owner: req.user.id },
          { $push: { _faves: postId } },
          { upsert: true }
        );
        await Post.findOneAndUpdate(
          { _id: postId },
          { $inc: { faveCount: 1 } },
          { new: true }
        );
        return res.status(200).send({ success: 'Post faved!' });
      }

      fave.remove({ $pull: { _faves: postId } });
      await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { faveCount: -1 } },
        { new: true }
      );

      res.status(200).send({ success: 'Post unfaved!' });
    } catch (e) {
      console.log(e);
    }
  });
};
