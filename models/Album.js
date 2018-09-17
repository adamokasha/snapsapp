const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlbumSchema = new Schema({
  _user: String,
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo'}]
});

mongoose.model('Album', AlbumSchema);
