const express = require('express');
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const Organization = require("../models/organizationsModel");
const Role = require("../models/rolesModel")
const {send_otp_email,check_otp} = require("../services/otpServices");


const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,user_role,org_id}=req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message:"User already exists."})
    }

    const role = await Organization.findById( user_role);
    if(role){
        return res.status(404).json({message:"Role not found."})
    }

    const user = await User.create({
        name,
        email,
        user_role,
        org_id
    });

    return res.status(201).json({message:"User registered",data:user});

});


const loginUser = asyncHandler(async(req,res)=>{
    const {email,otp} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message:"User not found."})
    }

    if(user.status !== "Active"){
        return res.status(403).json({message:"user is not active."})
    }

    const org = await Organization.findById(user.org_id);
    if(!org){
        return res.status(404).json({message:"Organization not found."})
    }

    if(org.status !== "Active"){
        return res.status(403).json({message:"Organization is not active."})
    }

    const otp_result = await check_otp(otp,email,"LOGIN");
    if(!otp_result.success){
        return res.status(400).json({message:otp_result.message})
    }

    const token = jwt.sign({user_id:user._id,org_id:user.org_id,role_id:user.role_id}, process.env.JWT_SECRET,
    {expiresIn:"1d"});

    return res.status(200).json({message:"Login Successful.",data:token});

});



const sendOtp = asyncHandler(
    async (req, res) => {
        const { email } = req.body;
        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(404).json({success: false,message: "User not found"});
        }

        const otp_res =await send_otp_email(email,"LOGIN");

        return res.status(200).json({success: true, message:otp_res.message});

    }
);


const getAllUsers = asyncHandler(async(req,res)=>{
    const user = await User.find();
    if(!user){
        return res.status(404).json({message:"Users not found."});
    }
    return res.status(200).json({message:"Successfully get all users.",data:user});
})

const getUserById = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({message:"Users not found."});
    }
    return res.status(200).json({message:"Successfully get all users.",data:user});

})

const updateUser = asyncHandler(async(req,res)=>{
    const {name,status,user_role,email} = req.body;
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    if (user_role) {
        const role = await Role.findById(user_role);
        if (!role) {
            return res.status(404).json({success: false,message: "Role not found"});
        }

        user.user_role = user_role;

        user.org_id = role.org_id;
    }
    if(name){
        user.name = name;
    }
    if(email){
        user.email = email;
    }
    if(status){
        user.status = status;
    }

    await user.save();

    return res.status(200).json({message:"Successfully updated",data:user})

});

const deleteUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({message:"Users not found."});  
    }
    await user.deleteOne();
    return res.status(200).json({message:"Successfully deleted",data:user})

});

const deleteMultipleUsers = asyncHandler(async (req, res) => {

    const {user_ids} = req.body;
    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
        return res.status(400).json({success: false,message:"user_ids array required"});
    }
    const deleted_users =
        await User.deleteMany({
            _id: {
                $in: user_ids
            }
        });

    return res.status(200).json({success: true,message:"Users deleted successfully",deleted_count: deleted_users.deletedCount});

});

module.exports = {registerUser,loginUser,sendOtp,getAllUsers,updateUser,getUserById,deleteMultipleUsers,deleteUser};