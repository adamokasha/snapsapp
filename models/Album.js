const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlbumSchema = new Schema({
  _owner: {type: Schema.Types.ObjectId, ref: 'User'},
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo'}]
});

mongoose.model('Album', AlbumSchema);
