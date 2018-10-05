const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const MessageBoxSchema = new Schema({
  _owner:  {type: Schema.Types.ObjectId, ref: 'User' },
  _unread: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  _all: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

mongoose.model('MessageBox', MessageBoxSchema)