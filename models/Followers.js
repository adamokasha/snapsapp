const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const FollowersSchema = new Schema({
  _displayName: String,
  _owner: { type: Schema.Types.ObjectId, ref: "User" },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

mongoose.model("Followers", FollowersSchema);
