const async_handler = require("express-async-handler");
const User = require("../models/usersModel");
const Project = require("../models/projectsModel");

const verify_project_access = (req_permission) => { 
    
    return async_handler(async(req, res, next) => {

        const req_user = await User.findById(req.user.id).populate("user_role");

        if(!req_user) {
            res.status(404);
            throw new Error("User Not Found");
        }

        const user_permissions = req_user.user_role.permissions;

        if(req_permission.includes("UPDATE") && user_permissions.includes("UPDATE-ALL-PROJECTS")) {
            return next();
        }

        if(req_permission.includes("DELETE") && user_permissions.includes("DELETE-ALL-PROJECTS")) {
            return next();
        }

        if(req_permission.includes("VIEW") && user_permissions.includes("VIEW-ALL-PROJECTS")) {
            return next();
        }

        const allowed = user_permissions.includes(req_permission);

        if(!allowed) {
            res.status(403);
            throw new Error("Access Denied");
        }

        // Get Project
        const req_project = await Project.findById(req.params.project_id);

        if(!req_project) {
            res.status(404);
            throw new Error("Project Not Found");
        }

        if(
            req_project.org_id.toString() !==
            req_user.org_id.toString()
        ) {
            res.status(403);
            throw new Error("Cross Organization Access Denied");
        }

        // Check assignment-based access
        const assigned_user_ids = req_project.assigned_employees.map(
            (emp_id) => emp_id.toString()
        );

        const is_assigned = assigned_user_ids.includes(
            req.user.id.toString()
        );

        if(!is_assigned) {
            res.status(403);
            throw new Error(
                "You can only access projects assigned to you"
            );
        }

        next();

    });

};

module.exports = verify_project_access;