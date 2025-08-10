const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email : {
        type: String,
        required:true,
    },
    mobileNo:{
        type: String,
        required:true,  
        minlength: 10,
        maxlength: 10
    },
    city:{
        type: String,
        required:true,
    },
    message:{
        type: String,
        required:true,
    },
     send_at: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model("User", userSchema);
module.exports = User;
