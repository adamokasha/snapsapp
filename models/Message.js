const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const MessageSchema = new Schema({
  _from: { type: Schema.Types.ObjectId, ref: 'User' },
  _to: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: Number,
  title: String,
  body: String,
  lastReplied: Number,
  replies: [
    {
      _owner: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: Number,
      body: { type: String, maxlength: 200 }
    }
  ]
});

mongoose.model('Message', MessageSchema);
