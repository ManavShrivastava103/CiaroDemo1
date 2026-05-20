const async_handler = require("express-async-handler");
const Project = require("../models/projectsModel");
const User = require("../models/usersModel");
const generate_unique_id = require("../services/idGenerator");

const {project_file_deletor} = require("./uploadfileController");

// 1
// Create Project Controller
// POST -> /api/project/
// Private Access - PERMISSION REQUIRED : CREATE-PROJECTS
const create_project = async_handler(async(req, res) => {
    const { title, description, status, assigned_emp } = req.body;
    const req_user = await User.findById(req.user.user_id);
    if(!req_user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    if(!title) {
        res.status(400);
        throw new Error("Missing Required Field");
    }
    if(assigned_emp && assigned_emp.length > 5){
        res.status(400);
        throw new Error("Only 5 Employees can be Assigned to a Project");
    }
    // checking if all employee belong to organisation only.
    if(assigned_emp) {    
        const org_employees = await User.find({ _id : { $in : assigned_emp }, org_id : req_user.org_id});
        if(org_employees.length !== assigned_emp.length) {
            res.status(400);
            throw new Error("All Assigned Employees Must Belong To Your Organization");
        }
    }
    // generating and ID for project
    const new_project_id = await generate_unique_id("PROJECT");
    const new_project = await Project.create({
        project_id : new_project_id, title, description, status, assigned_emp,
        created_by : req.user.user_id,
        org_id : req_user.org_id,
    });
    res.status(201).json(new_project);
});
 

// 2
// View Single Project
// GET -> /api/project/:project_id
// Private Access - PERMISSION REQUIRED : VIEW-PROJECT or VIEW-ALL-PROJECTS
const view_project = async_handler(async(req, res) => {
    const req_project = await Project.findById(req.params.project_id).populate("created_by").populate("assigned_emp");
    if(!req_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    // const req_user = await User.findById(req.user.user_id);
    // if( req_project.org_id.toString() !== req_user.org_id.toString()) {
    //     res.status(403);
    //     throw new Error("Cross Organization Access Denied");
    // }
    res.status(200).json(req_project);
});


// 3
// View All Projects of Organization
// GET -> /api/project/
// Private Access - PERMISSION REQUIRED : VIEW-ALL-PROJECTS
const view_all_projects = async_handler(async(req, res) => {
    const all_projects = await Project.find({ org_id : req.user.org_id })
    res.status(200).json(all_projects);
});


// 4
// View Assigned Projects
// GET -> /api/project/assigned
// Private Access - PERMISSION REQUIRED : VIEW-PROJECTS
const view_assigned_projects = async_handler(async(req, res) => {
    const assigned_projects = await Project.find({ assigned_emp : req.user.user_id}).populate("created_by").populate("assigned_emp");
    res.status(200).json(assigned_projects);
});


// 5
// Update Project
// PUT -> /api/project/:project_id
// Private Access - PERMISSION REQUIRED : UPDATE-PROJECTS
const update_project = async_handler(async(req, res) => {
    const updated_project = await Project.findByIdAndUpdate(
        req.params.project_id,
        {
            title : req.body.title,
            description : req.body.description,
            status : req.body.status
        },
        {
            new : true,
            runValidators : true
        }
    );
    if(!updated_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    res.status(200).json(updated_project);
});


// 6
// Edit Project Status
// PUT -> /api/project/update-status/:project_id
// Private Access - PERMISSION REQUIRED : UPDATE-PROJECTS
const edit_project_status = async_handler(async(req, res) => {
    const updated_status = await Project.findByIdAndUpdate( req.params.project_id, { status : req.body.status },
        {
            new : true,
            runValidators : true
        }
    );
    if(!updated_status) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    res.status(200).json(updated_status);
});


// Update Assigned Employees
// PUT -> /api/project/update-employees/:project_id
// Private Access - PERMISSION REQUIRED : UPDATE-PROJECTS
const update_assigned_employees = async_handler(async(req, res) => {
    const {assigned_emp} = req.body;
    if(!assigned_emp) {
        res.status(400);
        throw new Error("Assigned Employee List Required");
    }
    //const req_user = await User.findById(req.user.user_id);
    // Allow Empty Array and Check if All Belong to Organisation
    if(assigned_emp && assigned_emp.length > 0) {
        const org_employees = await User.find({ _id : { $in : assigned_emp }, org_id : req.user.org_id});
        if(org_employees.length !== assigned_emp.length) {
            res.status(400);
            throw new Error("All Employees Must Belong To Your Organization");
        }
    }
    const updated_project = await Project.findByIdAndUpdate( req.params.project_id, { assigned_emp : assigned_emp},
        {
            new : true, runValidators : true
        }
    );
    if(!updated_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    res.status(200).json(updated_project);
});


// 8
// Delete Single Project
// DELETE -> /api/project/:project_id
// Private Access - PERMISSION REQUIRED : DELETE-PROJECTS
const delete_project = async_handler(async(req, res) => {
    const req_project = await Project.findById(req.params.project_id);

    if (!req_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }

    await project_file_deletor(req.params.project_id);
    const deleted_project = await Project.findByIdAndDelete(req.params.project_id);

    res.status(200).json({message : "Project Deleted Successfully"});
});


// 9
// Delete Multiple Projects
// DELETE -> /api/project/delete-multiple
// Private Access - PERMISSION REQUIRED : DELETE-PROJECTS
const delete_multiple_projects = async_handler(async(req, res) => {
    const {project_ids} = req.body;
    //const req_user = await User.findById(req.user.user_id);
    const org_projects = await Project.find({ _id : {$in : project_ids}, org_id : req.user.org_id });
    if(org_projects.length !== project_ids.length) {
        res.status(403);
        throw new Error(
            "Some Projects Do Not Belong To Your Organization"
        );
    }
    for( const project of org_projects){
        await project_file_deletor(project._id);
    }
    await Project.deleteMany({_id : {$in : project_ids}});
    res.status(200).json({message : "Projects Deleted Successfully"});
});


module.exports = {
    create_project,
    update_project,
    delete_project,
    delete_multiple_projects,
    view_project,
    view_all_projects,
    edit_project_status,
    update_assigned_employees,
    view_assigned_projects
};