module.exports = (req, res, next) => {
  if (!req.user || (req.user && !req.user.registered)) {
    return res.status(401).send({ error: "You must be registered." });
  }

  next();
};
