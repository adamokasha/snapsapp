const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  _owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  title_lower: { type: String, lowercase: true },
  createdAt: Number,
  imgUrl: { type: String, required: true },
  description: String,
  faved: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isFave: { type: Boolean, default: false },
  faveCount: { type: Number, default: 0 },
  comments: [
    {
      _owner: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: Number,
      body: { type: String, maxlength: 200 }
    }
  ],
  tags: [{ type: String, lowercase: true }]
});

mongoose.model('Post', PostSchema);
