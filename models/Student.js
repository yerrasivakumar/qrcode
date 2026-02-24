
const mongoose = require("mongoose");

const StundentSchema = new mongoose.Schema({
    Stundentname: {
    type: String,
    required: true
  },
  Department: {
    type: String,
    required: true
  },
 

},{ timestamps: true,versionKey: false});

module.exports = mongoose.model("Student", StundentSchema);
