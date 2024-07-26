const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  Name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  accessToken: { type: String },
  refreshToken: { type: String },
  verifytoken: {
    type: String,
  },
});

const AuthModel = mongoose.model("users", ModelSchema);

module.exports = AuthModel;
