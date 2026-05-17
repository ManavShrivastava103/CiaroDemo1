const async_handler = require("express-async-handler");
const Role = require("../models/rolesModel");
const User = require("../models/usersModel");
const {system_roles} = require("../platformConstants");

// 1
// Create Role
// POST -> /api/role/
// Private Access - PERMISSION REQUIRED : CREATE-ROLES
const create_role = async_handler(async(req, res) => {
    const {role_name, permissions} = req.body;
    if(!role_name) {
        res.status(400);
        throw new Error("Role Name is Required");
    }
    if(Object.keys(system_roles).includes(role_name)) {
        res.status(400);
        throw new Error("System Role Names Cannot Be Used");
    }
    const new_role = await Role.create({
        org_id : req.user.org_id,
        role_name,
        permissions,
        is_system_role : false
    });
    res.status(201).json(new_role);
});


// 2
// Update Role
// PUT -> /api/role/:role_id
// Private Access - PERMISSION REQUIRED : UPDATE-ROLES
const update_role = async_handler(async(req, res) => {
    const {role_name, permissions} = req.body;
    const req_role = await Role.findById(req.params.role_id);
    if(!req_role) {
        res.status(404);
        throw new Error("Role Not Found");
    }
    if(req_role.org_id.toString() !== req.user.org_id.toString()) {
        res.status(403);
        throw new Error("Cross Organization Access Denied");
    }
    if(req_role.is_system_role) {
        res.status(403);
        throw new Error("System Roles Cannot Be Updated");
    }
    if(role_name && Object.keys(system_roles).includes(role_name)) {
        res.status(400);
        throw new Error("System Role Names Cannot Be Used");
    }
    const updated_role = await Role.findByIdAndUpdate( req.params.role_id,
        {role_name, permissions},
        {new : true, runValidators : true}
    );
    if(!updated_role) {
        res.status(500);
        throw new Error("Server Error Could Not Update!");
    }
    res.status(200).json(updated_role);
});


// 3
// Update Contributor Permissions
// PUT -> /api/role/update-contributor-permissions
// Private Access - PERMISSION REQUIRED : UPDATE-ROLES
const update_contributor_permissions = async_handler(async(req, res) => {
    const { permissions } = req.body;
    const contributor_role = await Role.findOne({ org_id : req.user.org_id, role_name : "Contributor"});
    if(!contributor_role) {
        res.status(404);
        throw new Error("Contributor Role Not Found");
    }
    const updated_contributor_role = await Role.findByIdAndUpdate(
        contributor_role._id,
        { permissions },
        { new : true, runValidators : true}
    );
    if(!updated_contributor_role) {
        res.status(500);
        throw new Error("Server Error! Could Not Update.");
    }
    res.status(200).json(updated_contributor_role);
});


// 4
// View Roles
// GET -> /api/role/
// Private Access - PERMISSION REQUIRED : VIEW-ROLES
const view_roles = async_handler(async(req, res) => {
    const roles = await Role.find({ org_id : req.user.org_id});
    res.status(200).json(roles);
});


// 5
// Delete Role
// DELETE -> /api/role/:role_id
// Private Access - PERMISSION REQUIRED : DELETE-ROLES
const delete_role = async_handler(async(req, res) => {
    const req_role = await Role.findById(req.params.role_id);
    if(!req_role) {
        res.status(404);
        throw new Error("Role Not Found");
    }
    if(req_role.org_id.toString() !== req.user.org_id.toString()) {
        res.status(403);
        throw new Error("Cross Organization Access Denied");
    }
    if(req_role.is_system_role) {
        res.status(403);
        throw new Error("System Roles Cannot Be Deleted");
    }
    const assigned_users = await User.find({user_role : req_role._id});
    if(assigned_users.length > 0) {
        res.status(400);
        throw new Error("Role is Assigned to Users. Use Force Delete Instead");
    }
    await Role.findByIdAndDelete(req_role._id);
    res.status(200).json({message : "Role Deleted Successfully"});
});


// 6
// Force Delete Role
// DELETE -> /api/role/force-delete/:role_id
// Private Access - PERMISSION REQUIRED : DELETE-ROLES
const force_delete_role = async_handler(async(req, res) => {
    const req_role = await Role.findById(req.params.role_id);
    if(!req_role) {
        res.status(404);
        throw new Error("Role Not Found");
    }
    if(req_role.org_id.toString() !== req.user.org_id.toString()) {
        res.status(403);
        throw new Error("Cross Organization Access Denied");
    }
    if(req_role.is_system_role) {
        res.status(403);
        throw new Error("System Roles Cannot Be Deleted");
    }
    const viewer_role = await Role.findOne({org_id : req.user.org_id, role_name : "Viewer"});
    if(!viewer_role) {
        res.status(404);
        throw new Error("Viewer Role Not Found");
    }
    await User.updateMany({ user_role : req_role._id },{ user_role : viewer_role._id});
    await Role.findByIdAndDelete(req_role._id);
    res.status(200).json({message : "Role Force Deleted Successfully"});
});



module.exports = {
    create_role,
    update_role,
    update_contributor_permissions,
    view_roles,
    delete_role,
    force_delete_role
};