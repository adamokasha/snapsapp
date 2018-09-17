const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  facebookId: String,
  profilePhoto: String,
  displayName: String,
  displayNameLowerC: String,
  albums: [{ type: Schema.Types.ObjectId, ref: 'Album'}],
  favs: [{ type: Schema.Types.ObjectId, ref: 'Photo'}]
});

mongoose.model('User', userSchema);