const async_handler = require("express-async-handler");
const User = require("../models/usersModel");

const verify_permission = (req_permission) => { return async_handler(async(req, res, next) => {
        const req_user = await User.findById(req.user.id).populate("user_role");
        if(!req_user) {
            res.status(404);
            throw new Error("User Not Found");
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

