const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  _owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  title: String,
  createdAt: Number,
  imgUrl: {type:String, required: true},
  description: String,
  faved: [{type: Schema.Types.ObjectId, ref: 'User'}],
  isFave: {type: Boolean, default: false},
  comments: Array,
  tags: Array
});

mongoose.model('Post', PostSchema);