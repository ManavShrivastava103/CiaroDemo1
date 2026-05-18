const express = require('express');
const { register_organization, getOrganization, getAllOrganizations, updateOrganizationById, updateOrganizationStatus } = require('../controller/organizationController');
const router = express.Router();
const validate_token =  require("../middleware/validateTokenHandler");
const verify_permission = require("../middleware/permissionVerifier");

router.post("/register",register_organization);

router.get("/",getAllOrganizations);

router.put("/:id",validate_token,verify_permission("UPDATE-ORG"),updateOrganizationById);

router.patch("/status/:id",validate_token,updateOrganizationStatus);


module.exports = router;