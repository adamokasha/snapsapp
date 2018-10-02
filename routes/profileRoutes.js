const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');
const User = mongoose.model('User');
const Follows = mongoose.model('Follows');
const Followers = mongoose.model('Followers');

module.exports = app => {
  // Update Profile
  app.post('/api/profile/update', requireAuth, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { profile: req.body.profile }
      );
      res.status(200).send(user);
    } catch (e) {
      console.log(e);
    }
  });

  // Get a user's profile
  app.get('/api/profile/get/:user', async (req, res) => {
    try {
      const user = await User.findOne({ displayName: req.params.user });
      res.status(200).send(user);
    } catch (e) {
      console.log(e);
    }
  });

  // Search for profile(s)
  app.post('/api/profile/search/:page', async (req, res) => {
    try {
      const { searchTerms } = req.body;
      const {page} = req.params;
      const regexArr = searchTerms.map(term => {
        return new RegExp(term, 'g');
      });
      const users = await User.find({ displayName_lower: { $in: regexArr } })
        .limit(20)
        .skip(20 * page)
        .exec();
      res.status(200).send(users);
    } catch (e) {
      console.log(e);
    }
  });

  // Get a user's followers
  app.get('/api/profile/followers/:id/:page', async (req, res) => {
    try {
      const {id, page} = req.params;
      const followers = await Followers.find({_owner: id})
      .limit(25)
      .skip(25 * page)
      .populate({
        path: 'followers',
        select: 'displayName profilePhoto'
      })
      .exec();

      res.status(200).send(followers)
    } catch (e) {
      console.log(e);
    }
  })

  // Get a user's follows
  app.get('/api/profile/follows/:id/:page', async (req, res) => {
    try {
      const {id, page} = req.params;
      const follows = await Follows.find({_owner: id})
      .limit(25)
      .skip(25 * page)
      .populate({
        path: 'follows',
        select: 'displayName profilePhoto'
      })
      .exec();

      res.status(200).send(follows)
    } catch (e) {
      console.log(e);
    }
  })

  // Follow a user
  app.post('/api/profile/follows/add/:id', requireAuth, async (req, res) => {
    try {
      const clientId = req.user.id;
      const {id} = req.params;
      if(clientId === id) {
        return res.status(400).send({error: "Can't add self."})
      }
      const follows = await Follows.findOneAndUpdate({_owner: clientId}, {follows: id, upsert: true});

      res.status(200).send(follows);
    } catch (e) {console.log(e)}
  });

  // Unfollow a user
  app.delete('api/profile/follows/unf/:id', requireAuth, async (req, res) => {
    try {
      const clientId = req.user.id;
      const {id} = req.params;
      if(clientId === id) {
        return res.status(400).send({error: "Can't unfollow self."})
      }
      const follows = await Follows.findOneAndRemove({_owner: clientId}, {follows: id});

      res.status(200).send(follows);
    } catch (e) {console.log(e)}
  })
};
