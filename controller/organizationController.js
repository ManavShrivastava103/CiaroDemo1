const Organisation = require("../models/organizationsModel");
const generate_unique_id = require("../services/idGenerator");
const create_system_roles = require("../services/defaultRoleCreator");
const asyncHandler = require('express-async-handler');

const register_organization = asyncHandler(async (req, res) => {

    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Organisation name is required"
        });
    }
    const organization_code = await generate_unique_id("ORGANIZATION");

    const new_organization = await Organisation.create({
        name: name,
        code: organization_code
    });

    await create_system_roles(new_organization._id);
    return res.status(201).json({
        success: true,
        message: "Organization registered successfully",
        data: new_organization
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
    const org = await Organisation.findById(req.org_id);
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
    const org = await Organisation.findById(req.org_id);

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