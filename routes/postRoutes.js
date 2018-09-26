const requireAuth = require('../middlewares/requireAuth');
const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Faves = mongoose.model('Faves');

module.exports = app => {
  // Feed
  app.get('/api/posts/:page', async (req, res) => {
    try {
      const { page } = req.params;

      const posts = await Post.find({})
      .limit(12)
      .skip(12 * page)
      .populate({
        path: '_owner',
        select: 'profilePhoto displayName'
      }).exec();
  
      if(req.user) {
        const favesDoc = await Faves.findOne({_owner: req.user.id}, '_faves', { lean: true }); 
        const {_faves } = favesDoc;
        
        posts.forEach(post => {
          if(_faves.toString().includes(post._id)) {
            return post.isFave = true;
          }
        });
  
      return res.send(posts);
      }

      res.send(posts);

    } catch(e) {
      console.log(e)
    }
  });

  // Get all user posts
  app.get('/api/posts/myposts/all', requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const posts = await Post.find({_owner: userId}, 'imgUrl');
      res.status(200).send(posts)
    } catch (e) {
      console.log(e);
    }
  });

  // Fave
  app.post('/api/posts/fave/:id', requireAuth, async (req, res) => {
    try {
      const fave = await Faves.findOne({ _owner: req.user.id , _faves: {$in: {_id: req.params.id}}});
      if(!fave) {
        await Faves.findOneAndUpdate(
          {_owner: req.user.id},
          { $push: { _faves: req.params.id } },
          { upsert: true }
        );
        await Post.findOneAndUpdate({_id: req.params.id}, {$inc: {faveCount: 1}}, {new: true });
        return res.status(200).send({ success: 'Post faved!' });
      }
      
      await Faves.findOneAndUpdate(
        {_owner: req.user.id},
        { $pull: { _faves: req.params.id } },
        { upsert: true }
      )
      await Post.findOneAndUpdate({_id: req.params.id}, {$inc: {faveCount: -1}}, {new: true });

      res.status(200).send({ success: 'Post unfaved!' });      
    } catch (e) {
      res.status(400).send(e);
    }
  });
};
