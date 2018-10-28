const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Follows = new Schema({
  _displayName: String,
  _owner: { type: Schema.Types.ObjectId, ref: "User" },
  follows: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

mongoose.model("Follows", Follows);
