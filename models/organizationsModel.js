const mongoose  = require("mongoose");

const organization_schema = new mongoose.Schema({
    name : {type:String, required:[true, "Organisation Name is Required"]},
    code : {type:String, required:[true, "Organisation Code is Required"], unique:true}, 
    status : {
        type:String, 
        enum : ["Active", "Inactive", "Suspended"],
        default : "Active"
    }
}, {
    timestamps : true
});

module.exports = mongoose.model("Organization", organization_schema);

