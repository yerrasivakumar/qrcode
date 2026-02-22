
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    Stundentname: {
    type: String,
    required: true
  },
  Department: {
    type: String,
    required: true
  },
 

});

module.exports = mongoose.model("Student", BookSchema);
