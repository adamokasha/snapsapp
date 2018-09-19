const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  title: String,
  imgUrl: String,
  likes: Array,
  comments: Array,
  tags: Array
});

mongoose.model('Post', PostSchema);