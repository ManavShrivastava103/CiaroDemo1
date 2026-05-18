const express = require('express');
const router = express.Router();
const validate_token =  require("../middleware/validateTokenHandler");
const projectDashboard = require('../controller/dashboardController');
const verify_permission = require("../middleware/permissionVerifier");



router.get("/",validate_token,verify_permission("VIEW-PROJECT-ANALYTICS"),projectDashboard);

module.exports=router;
