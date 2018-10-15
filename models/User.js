const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  facebookId: String,
  profilePhoto: String,
  displayName: { type: String, minlength: 4, maxlength: 12 },
  displayName_lower: { type: String, lowercase: true },
  joined: Number,
  profile: {
    name: String,
    website: String,
    facebook: String,
    gplus: String,
    twitter: String,
    about: String
  },
  albums: [{ type: Schema.Types.ObjectId, ref: "Album" }],
  faves: [{ type: Schema.Types.ObjectId, ref: "Faves" }],
  registered: { type: Boolean, default: false }
});

mongoose.model("User", userSchema);
