const express = require('express');
const router = express.Router();

const {registerUser,loginUser,sendOtp,updateUser,getAllUsers,getUserById,deleteMultipleUsers,deleteUser} = require("../controller/userController");
const validate_token = require('../middleware/validateTokenHandler');
const verify_permission = require("../middleware/permissionVerifier");

router.get("/",validate_token, verify_permission("VIEW-USERS"), getAllUsers);

router.get("/:id",validate_token, verify_permission("VIEW-USERS"), getUserById);

router.post("/register",validate_token, verify_permission("CREATE-USERS"), registerUser);

router.post("/login",loginUser);

router.post("/send-otp",sendOtp)

router.patch("/:id",validateToken, verify_permission("UPDATE-USERS"), updateUser);

router.delete("/:id",validateToken, verify_permission("DELETE-USERS"), deleteUser);

router.delete("/",validateToken,  verify_permission("DELETE-USERS"), deleteMultipleUsers);

module.exports = router;
