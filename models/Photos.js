const mongoose = require('mongoose');
const { Schema } = mongoose;

const PhotoSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  link: String,
  likes: Array,
  comments: Array,
  tags: Array
});

mongoose.model('Photo', PhotoSchema);