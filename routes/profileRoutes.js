const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');
const User = mongoose.model('User');

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
};
