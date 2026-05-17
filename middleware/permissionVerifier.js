const async_handler = require("express-async-handler");
const User = require("../models/usersModel");

const verify_permission = (req_permission) => {return async_handler(async(req, res, next) => {
        const req_user = await User.findById(req.user.user_id).populate("user_role");
        if(!req_user) {
            res.status(404);
            throw new Error("User Not Found");
        }
        if(req_user.org_id.toString() !== req.user.org_id.toString()) {
            res.status(403);
            throw new Error("Cross Organization Access Denied");
        }
        const user_permissions = req_user.user_role.permissions;
        const allowed = user_permissions.includes(req_permission);
        if(!allowed) {
            res.status(403);
            throw new Error("Access Denied");
        }
        next();
    });

};

module.exports = verify_permission;