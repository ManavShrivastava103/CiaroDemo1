const mongoose  = require("mongoose");
const {system_roles, system_permissions, viewer_permissions, contributer_permissions} = require("../platformConstants");

const role_schema = new mongoose.Schema({
    org_id : {type:mongoose.Schema.Types.ObjectId, ref:"Organization", required:[true, "Organisation Reference Required"]},
    role_name : {type:String, required:[true, "Role name is Required"]},
    permissions : {type:[{ type:String, enum : system_permissions,}], default : viewer_permissions},
    is_system_role : {type:Boolean, default:false}
}, {
    timestamps : true
});

role_schema.index(
    {org_id : 1, role_name : 1},
    {unique : true}
)

module.exports = mongoose.model("Role", role_schema);

