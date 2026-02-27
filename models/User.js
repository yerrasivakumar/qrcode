const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
   Department: {
    type: String,
    required: true
  },
  PhoneNumber: {
    type: String,
    required: true
  },
    Email: {
    type: String,
    
  },
  role: {
    type: String,
    enum: ["stundent", "admin"],
    default: "stundent"
  }
},{ timestamps: true ,versionKey: false});

module.exports = mongoose.model("Admin", UserSchema);