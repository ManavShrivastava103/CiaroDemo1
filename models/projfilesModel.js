const mongoose = require ("mongoose");

const projfile_schema = new mongoose.Schema({
    public_id : {type:String, required:true},
    url : {type:String, required:true},
    file_name : {type:String},
    file_type : {type:String},
    uploaded_by : {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}, 
    in_project : {type:mongoose.Schema.Types.ObjectId, ref:"Project", required:true}
}, {
    timestamps : true
}) 

module.exports = mongoose.model("Projfile", projfile_schema) ;