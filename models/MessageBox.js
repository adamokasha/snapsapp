const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const MessageBoxSchema = new Schema({
  _displayName: String,
  _owner: { type: Schema.Types.ObjectId, ref: "User" },
  _unread: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  _all: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  _sent: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

mongoose.model("MessageBox", MessageBoxSchema);
