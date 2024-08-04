const mongoose = require("mongoose");

const authSchema = {
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "suspended",
    required: true,
  },
  role: {
    type: String,
    default: "user",
    required: true,
  },
};

module.exports = mongoose.model("authSchema", authSchema);
