const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  bill:Number,
});
const User = mongoose.model('User', userSchema);// user.js

module.exports = User;
