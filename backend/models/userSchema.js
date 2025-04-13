const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name : { type:String , },  
  userName: { type: String, },
  email: { type: String, required: true },
  password: { type: String, required: true },
  posts:[{ type: mongoose.Schema.Types.ObjectId, ref:'Post'}],
});

const User = mongoose.model('Users', userSchema);
module.exports = User;
