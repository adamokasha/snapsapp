const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  title: String,
  createdAt: Number,
  imgUrl: {type:String, required: true},
  description: String,
  faved: [{type: Schema.Types.ObjectId, ref: 'User'}],
  isFave: Boolean,
  comments: Array,
  tags: Array
});

mongoose.model('Post', PostSchema);