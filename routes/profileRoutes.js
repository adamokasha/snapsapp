const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');
const User = mongoose.model('User');

module.exports = app => {
  // Update Profile
  app.post('/api/profile/update', requireAuth, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate({_id: req.user.id}, {profile: req.body.profile});
      res.status(200).send(user);
    } catch(e) {
      console.log(e);
    }
  });

  // Get a user's profile
  app.get('/api/profile/get/:user', async (req, res) => {
    try {
      const user = await User.findOne({displayName: req.params.user})
      res.status(200).send(user);
    } catch (e) {
      console.log(e);
    }
  });

  // Search for profile(s)
  app.post('/api/profile/search', async (req, res) => {
    try {
      const {searchTerms} = req.body;
      const regexArr = searchTerms.map(term => {
        return new RegExp(term, "g");
      });
      const users = await User.find({displayNameLowerC: {$in: regexArr}});
      res.status(200).send(users)
    } catch(e) {
      console.log(e);
    }
  })
}