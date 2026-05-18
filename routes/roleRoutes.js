const express = require("express");
const role_router = express.Router();
const validate_token = require("../middleware/validateTokenHandler");
const verify_permission = require("../middleware/permissionVerifier");


const {
    create_role,
    update_role,
    update_contributor_permissions,
    view_roles,
    delete_role,
    force_delete_role
} = require("../controller/roleController");

role_router.post("/", validate_token, verify_permission("CREATE-ROLES"), create_role);

role_router.get("/", validate_token, verify_permission("VIEW-ROLES"), view_roles);

role_router.put("/:role_id", validate_token, verify_permission("UPDATE-ROLES"), update_role);

role_router.put("/update-contributor-permissions", validate_token, verify_permission("UPDATE-ROLES"), update_contributor_permissions);

role_router.delete("/:role_id", validate_token, verify_permission("DELETE-ROLES"), delete_role);

role_router.delete("/force-delete/:role_id", validate_token, verify_permission("DELETE-ROLES"), force_delete_role);

module.exports = role_router;