const express = require("express");
const compression = require("compression");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config();

require("./models/User");
require("./models/Faves");
require("./models/Album");
require("./models/Post");
require("./models/Followers");
require("./models/Follows");
require("./models/MessageBox");
require("./models/Message");
require("./services/passport");

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.mongoURI,
  { useNewUrlParser: true }
);

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 15,
    keys: [process.env.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/uploadRoutes")(app);
require("./routes/postRoutes")(app);
require("./routes/albumRoutes")(app);
require("./routes/profileRoutes")(app);
require("./routes/messageRoutes")(app);

if (["production", "ci"].includes(process.env.NODE_ENV)) {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
