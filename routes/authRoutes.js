const passport = require('passport');
const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');
const User = mongoose.model('User');
const Faves = mongoose.model('Faves');
const Follows = mongoose.model('Follows');
const Followers = mongoose.model('Followers');
const MessageBox = mongoose.model('MessageBox');
const Message = mongoose.model('Message');


module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      if (!req.user.displayName) {
        return res.redirect('/register_user');
      }
      res.redirect('/');
    }
  );

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook'),
    (req, res) => {
      if (!req.user.displayName) {
        return res.redirect('/register_user');
      }
      res.redirect('/');
    }
  );

  app.post('/auth/register', requireAuth, async (req, res) => {
    try {
      if(req.user.registered === true) {
        return res.status(400).send({
          error: 'You have already registered.'
        });
      }
      const existingUser = await User.findOne({
        displayName_lower: req.body.displayName
      });

      if (existingUser) {
        return res.status(400).send({
          error: 'Display name already in use. Please choose another.'
        });
      }

      await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          displayName: req.body.displayName,
          displayName_lower: req.body.displayName,
          registered: true
        }
      );

      // Create and save new faves, follows, followers, messageBox doc for every newly reg'd user
      await new Faves({
        _owner: req.user.id
      }).save();
      await new Follows({
        _owner: req.user.id
      }).save();
      await new Followers({
        _owner: req.user.id
      }).save()
      await new MessageBox({
        _owner: req.user.id,
      }).save();

      res.redirect('/');
    } catch (e) {
      res.send({ error: 'Something went wrong. Please try again' });
    }
  });

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
