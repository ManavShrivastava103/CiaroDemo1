const express = require('express');
const router = express.Router();

const {registerUser,loginUser,sendOtp,updateUser,getAllUsers,getUserById,deleteMultipleUsers,deleteUser} = require("../controller/userController");
const validateToken = require('../middleware/validateTokenHandler');

router.get("/",validateToken,getAllUsers);

router.get("/:id",validateToken,getUserById);

router.post("/register",registerUser);

router.post("/login",loginUser);

router.post("/send-otp",sendOtp)

router.patch("/:id",validateToken,updateUser);

router.delete("/:id",validateToken,deleteUser);

router.delete("/",validateToken,deleteMultipleUsers);

module.exports = router;
