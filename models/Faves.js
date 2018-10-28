const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const FavesSchema = new Schema({
  _displayName: String,
  _owner: { type: Schema.Types.ObjectId, ref: "User" },
  _faves: [{ type: Schema.Types.ObjectId, ref: "Post" }]
});

mongoose.model("Faves", FavesSchema);
