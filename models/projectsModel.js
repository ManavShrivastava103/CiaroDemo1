const mongoose = require("mongoose");

const project_schema = new mongoose.Schema({
    project_id : {type:String, required:true, unique:true},
    title : {type:String, required:[true, "Project title is required"]},
    description : {type:String},
    status : {
        type:String, 
        enum : ["Completed", "Not Started", "In Progress"],
        default : "Not Started"
    },
    created_by : {type: mongoose.Schema.Types.ObjectId, ref: "User", required : true},
    org_id : {type:mongoose.Schema.Types.ObjectId, ref:"Organization", required : true},
    assigned_emp : {
        type: [{
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        }],
        validate: {
            validator: function(val){ return val.length <= 5 },
            message: "Maximum 5 employees can be assigned"
        }
    }
}, {
    timestamps : true
});

module.exports = mongoose.model("Project", project_schema);