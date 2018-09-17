const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback',
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(profile);
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await new User({
          googleId: profile.id,
          profilePhoto: profile.photos[0].value
        }).save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookAppId,
      clientSecret: keys.facebookAppSecret,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'picture', 'email'],
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(profile);
        const existingUser = await User.findOne({ facebookId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await new User({
          facebookId: profile.id,
          profilePhoto: profile.photos[0].value
        }).save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
