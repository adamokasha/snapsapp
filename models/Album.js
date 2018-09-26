const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlbumSchema = new Schema({
  name: String,
  createdAt: Number,
  coverImage: String,
  _owner: {type: Schema.Types.ObjectId, ref: 'User'},
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts'}]
});

mongoose.model('Album', AlbumSchema);
