const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",  
    required: true
  },
  company: String,
  website: String,
  // other fields...
});

module.exports = mongoose.model("Profile", ProfileSchema);
