
const mongoose = require("mongoose");

const StundentSchema = new mongoose.Schema({
    Stundentname: {
    type: String,
    required: true
  },
    Password: {
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
 

},{ timestamps: true,versionKey: false});

module.exports = mongoose.model("Student", StundentSchema);
