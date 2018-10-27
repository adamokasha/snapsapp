const passport = require("passport");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");
const User = mongoose.model("User");
const Faves = mongoose.model("Faves");
const Follows = mongoose.model("Follows");
const Followers = mongoose.model("Followers");
const MessageBox = mongoose.model("MessageBox");

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      if (!req.user.displayName) {
        return res.redirect("/register_user");
      }
      res.redirect("/");
    }
  );

  app.get("/auth/facebook", passport.authenticate("facebook"));

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
      if (!req.user.displayName) {
        return res.redirect("/register_user");
      }
      res.redirect("/");
    }
  );

  app.post("/auth/register", requireAuth, async (req, res) => {
    try {
      if (req.user.registered === true) {
        throw new Error("You have already registered.");
      }
      const existingUser = await User.findOne({
        displayName_lower: req.body.displayName.toLowerCase()
      });

      if (existingUser) {
        throw new Error("Display name already in use! Try another.");
      }

      const user = await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          displayName: req.body.displayName,
          displayName_lower: req.body.displayName,
          registered: true,
          joined: Date.now()
        },
        { new: true }
      );

      await Promise.all([
        new Faves({
          _owner: req.user.id
        }).save(),
        new Follows({
          _owner: req.user.id
        }).save(),
        new Followers({
          _owner: req.user.id
        }).save(),
        new MessageBox({
          _owner: req.user.id
        }).save()
      ]);

      res.status(200).send(user);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  });

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
