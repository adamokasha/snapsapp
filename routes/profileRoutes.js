const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');
const User = mongoose.model('User');

module.exports = app => {
  app.post('/api/profile/update', requireAuth, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate({_id: req.user.id}, {profile: req.body.profile});
      res.status(200).send(user);
    } catch(e) {
      console.log(e);
    }
  });

  app.get('/api/profile/get/:user', async (req, res) => {
    try {
      const user = await User.findOne({displayName: req.params.user})
      res.status(200).send(user);
    } catch (e) {
      console.log(e);
    }
  })
}