const express = require('express');
const { register_organization, getOrganization, getAllOrganizations, updateOrganizationById, updateOrganizationStatus } = require('../controller/organizationController');
const router = express.Router();

router.post("/register",register_organization);

router.get("/",getAllOrganizations);

router.put("/:id",updateOrganizationById);

router.patch("/status",updateOrganizationStatus);


module.exports = router;