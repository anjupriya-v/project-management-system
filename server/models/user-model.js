var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  profileImage: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  activeDays: [
    {
      _id: false,
      timeStamp: String,
      progressDone: String,
    },
  ],
});
module.exports = mongoose.model("users", userSchema);
