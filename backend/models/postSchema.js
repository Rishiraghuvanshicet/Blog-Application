const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  imageUrl: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  comments: [
    {
      text: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);

