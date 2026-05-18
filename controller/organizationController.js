const Organisation = require("../models/organizationsModel");
const generate_unique_id = require("../services/idGenerator");
const create_system_roles = require("../services/defaultRoleCreator");
const asyncHandler = require('express-async-handler');
const Role = require('../models/rolesModel');
const User = require('../models/usersModel');
const {send_registration_success_email} = require('../services/otpServices');

const register_organization = asyncHandler(async (req, res) => {

    const { organization, admin } = req.body;

    if (!organization?.name) {
        return res.status(400).json({
            success: false,
            message: "Organization name is required"
        });
    }
    if (!admin?.email) {
        return res.status(400).json({
            success: false,
            message: "Admin email is required"
        });
    }
    const organization_code = await generate_unique_id("ORGANIZATION");

    const new_organization = await Organisation.create({
        name: organization.name,
        code: organization_code,
        status: "Active"
    });
    await create_system_roles(new_organization._id);

    const admin_role = await Role.findOne({
        org_id: new_organization._id,
        role_name: "Admin"
    });

    const admin_user = await User.create({
        name: admin.name || "Org Admin",
        email: admin.email,
        org_id: new_organization._id,
        user_role: admin_role._id,
        status: "Active"
    });

    await send_registration_success_email(admin.email);

    return res.status(201).json({
        success: true,
        message: "Organization + Admin created successfully",
        data: {
            organization: new_organization,
            admin_user
        }
    });
    
});




const getAllOrganizations = asyncHandler(async (req, res) => {

    const organizations = await Organisation.find();

    return res.status(200).json({
        success: true,
        count: organizations.length,
        data: organizations
    });

});

const updateOrganizationById =asyncHandler(async(req,res)=>{
    const org = await Organisation.findById(req.user.org_id);
    if(!org){
        return res.status(404).json({message:"Organization not found."})
    }

    const {name,status}=req.body;
    if(name){
        org.name = name;
    }

    if(status){
        org.status = status;
    }

    await org.save();

    return res.status(200).json({
        success: true,
        message: "Organisation updated successfully",
        data: org
    })
    
});


const updateOrganizationStatus = asyncHandler(async (req, res) => {

    const {status} = req.body;

    const allowed_status = ["Active","Inactive","Suspended"];

    if (!allowed_status.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }
    const org = await Organisation.findById(req.user.org_id);

    if (!org) {
        return res.status(404).json({
            success: false,
            message: "Organisation not found"
        });
    }
    org.status = status;

    await org.save();

    return res.status(200).json({
        success: true,
        message: "Organisation status updated successfully",
        data: org
    });

});
module.exports = {
                register_organization,
                getAllOrganizations,
                updateOrganizationById,
                updateOrganizationStatus,
            };