const mongoose  = require("mongoose");

const user_schema = new mongoose.Schema({
    name : {type:String, required:[true, "Name is Required"]},
    //username : {type:String, required:[true, "Username is required"], unique:true},
    email : {type:String, required:[true, "Email is Required"], unique:true}, 
    password : {type:String},
    org_id : {type:mongoose.Schema.Types.ObjectId, ref:"Organization", required:true},
    user_role : {type:mongoose.Schema.Types.ObjectId, ref:"Role", required:true}
}, {
    timestamps : true
});

module.exports = mongoose.model("User", user_schema);

// username and password attributes can be removed since we have to login via otp on email.