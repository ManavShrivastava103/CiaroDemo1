const async_handler = require("express-async-handler");
const Project = require("../models/projectsModel");
const Projfile = require("../models/projfilesModel");

// Function for uploading single file to project
// POST -> /projects/proj_files/:project_id
// access : PRIVATE -> For users with permission UPDATE-PROJECTS
const upload_single_file = async_handler(async(req, res) => {
    const req_project = await Project.findById(req.params.project_id);
    if (!req_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    const uploaded_file = await Projfile.create({
        public_id: req.file.filename,
        url: req.file.path,
        file_name: req.file.originalname,
        file_type: req.file.mimetype,
        uploaded_by: req.user.user_id,
        in_project: req.params.project_id
    });

    res.status(200).json({message: "File Uploaded Successfully", data : uploaded_file});
});


// Function for uploading single file to project
// POST -> /projects/proj_files/bulk/:project_id
// access : PRIVATE -> For users with permission UPDATE-PROJECTS
const bulk_upload_files = async_handler(async(req, res) => {
    const req_project = await Project.findById(req.params.project_id);
    if (!req_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    const bulk_files = [];
    for (const a_file of req.files) {
        const uploaded_file = await Projfile.create({
            public_id: a_file.filename,
            url: a_file.path,
            file_name: a_file.originalname,
            file_type: a_file.mimetype,
            uploaded_by: req.user.user_id,
            in_project: req.params.project_id
        });
        bulk_files.push(uploaded_file);
    }
    res.status(200).json({message: "Files Uploaded Successfully", data: bulk_files });
});


// Function for fetching single file to project
// GET -> /projects/proj_files/:project_file_id
// access : PRIVATE -> For users with permission UPDATE-PROJECTS
const get_a_file = async_handler(async(req, res) => {
    const req_project = await Project.findById(req.params.project_id);
    if (!req_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    const uploaded_file = await Projfile.findById(req.params.project_file_id);
    res.status(200).json(uploaded_file);
});


// Function for fetching single file to project
// GET -> /projects/proj_files/:project_ids
// access : PRIVATE -> For users with permission UPDATE-PROJECTS
const get_all_project_files = async_handler(async(req, res) => {
    const req_project = await Project.findById(req.params.project_id);
    if (!req_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    const uploaded_files = await Projfile.find({$match: {in_project : req.params.project_id}});
    res.status(200).json(uploaded_file);
});


module.exports = { upload_single_file, bulk_upload_files };




// const projfile_schema = new Schema({
//     public_id : {type:String, required:true},
//     url : {type:String, required:true},
//     file_name : {type:String},
//     file_type : {type:String},
//     uploaded_by : {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}, 
//     in_project : {type:mongoose.Schema.Types.ObjectId, ref:"Project", required:true}
// })