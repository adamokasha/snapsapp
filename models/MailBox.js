const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const MailBoxSchema = new Schema({
  _owner:  {type: Schema.Types.ObjectId, ref: 'User' },
  _unread: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  _messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

mongoose.model('MailBox', MailBoxSchema)