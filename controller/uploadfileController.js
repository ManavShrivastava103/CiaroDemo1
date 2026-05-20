const async_handler = require("express-async-handler");
const Project = require("../models/projectsModel");
const Projfile = require("../models/projfilesModel");
const cloudinary = require("../config/cloudinaryConnect");

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
    const req_project_file = await Projfile.findById(req.params.project_file_id);
    if (!req_project_file) {
        res.status(404);
        throw new Error("Project File Not Found");
    }
    // const uploaded_file = await Projfile.findById(req.params.project_file_id);
    res.status(200).json(req_project_file);
});


// Function for fetching single file to project
// GET -> /projects/proj_files/:project_id
// access : PRIVATE -> For users with permission UPDATE-PROJECTS
const get_all_project_files = async_handler(async(req, res) => {
    const req_project = await Project.findById(req.params.project_id);
    if (!req_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }
    const uploaded_files = await Projfile.find({in_project : req.params.project_id}).select("-in_project");
    res.status(200).json(uploaded_files);
});

// Function for deleting single file
// DELETE -> /projects/proj_files/:project_file_id
// access : PRIVATE -> For users with permission UPDATE-PROJECTS
const delete_file = async_handler(async(req, res) => {
    const uploaded_file = await Projfile.findById(req.params.project_file_id);
    if (!uploaded_file) {
        res.status(404);
        throw new Error("File Not Found");
    }
    await cloudinary.uploader.destroy(
        uploaded_file.public_id,
        {
            resource_type:
            uploaded_file.file_type ==="application/pdf" ? "raw": "image"
        }
    );
    const deleted_file = await Projfile.findByIdAndDelete(req.params.project_file_id);
    res.status(200).json({
        success: true,
        message: "File Deleted Successfully",
        data: uploaded_file
    });
});


// Function for deleting multiple project files
// DELETE -> /projects/proj_files/
// access : PRIVATE -> For users with permission UPDATE-PROJECTS
const delete_many_files = async_handler(async(req, res) => {
    const { file_ids } = req.body;

    if (!file_ids || !Array.isArray(file_ids) || file_ids.length === 0) {
        res.status(400);
        throw new Error("file_ids array is required");
    }

    const files = await Projfile.find({_id: {$in: file_ids}});

    if (files.length !== file_ids.length) {
        res.status(404);
        throw new Error("Some files not found");
    }


    // UNOPTIMIZED WAY
    // for (const file of files){
    //     await cloudinary.uploader.destroy(
    //         file.public_id,
    //         {
    //             resource_type:
    //             file.file_type ==="application/pdf" ? "raw": "image"
    //         }
    //     );
    // }


    // OPTIMIZED WAY
    const image_public_ids = [];
    const raw_public_ids = [];
    
    for (const file of files) {
    
        if (file.file_type ==="application/pdf") {
            raw_public_ids.push(file.public_id);
    
        } else {
            image_public_ids.push(file.public_id);
        }
    }
    // delete images
    if (image_public_ids.length > 0) {
        await cloudinary.api.delete_resources(raw_public_ids,{resource_type: "images"});
    }
    
    // delete pdfs/raw
    if (raw_public_ids.length > 0) {
        await cloudinary.api.delete_resources(raw_public_ids,{resource_type: "raw"});
    }
    await Projfile.deleteMany({_id: {$in: file_ids}});

    res.status(200).json({
        success: true,
        message: "Files Deleted Successfully",
        deleted_count: files.length,
        data: files
    });

});


const project_file_deletor = async_handler(async(project_id)=>{
    
    const files = await Projfile.find({in_project: project_id});

    if (files.length === 0) {
        res.status(404);
        throw new Error("No files in project found");
    }

    // OPTIMIZED WAY
    const image_public_ids = [];
    const raw_public_ids = [];
    
    for (const file of files) {
    
        if (file.file_type ==="application/pdf") {
            raw_public_ids.push(file.public_id);
    
        } else {
            image_public_ids.push(file.public_id);
        }
    }
    // delete images
    if (image_public_ids.length > 0) {
        await cloudinary.api.delete_resources(raw_public_ids,{resource_type: "images"});
    }
    // delete pdfs/raw
    if (raw_public_ids.length > 0) {
        await cloudinary.api.delete_resources(raw_public_ids,{resource_type: "raw"});
    }

    await Projfile.deleteMany({in_project: project_id});

    res.status(200).json({
        success: true,
        message: "Files Deleted Successfully",
        deleted_count: files.length,
        data: files
    });

})

// Function for deleting multiple project files
// DELETE -> /projects/proj_files/bulk/:project_id
// access : PRIVATE -> For users with permission UPDATE-PROJECTS
const delete_all_project_files = async_handler(async(req, res) => {

    const req_project = await Project.findById(req.params.project_id);

    if (!req_project) {
        res.status(404);
        throw new Error("Project Not Found");
    }

    await project_file_deletor(req.params.project_id);
});

module.exports = { upload_single_file, bulk_upload_files, get_all_project_files, delete_file, get_a_file, delete_many_files,project_file_deletor,delete_all_project_files };




// const projfile_schema = new Schema({
//     public_id : {type:String, required:true},
//     url : {type:String, required:true},
//     file_name : {type:String},
//     file_type : {type:String},
//     uploaded_by : {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}, 
//     in_project : {type:mongoose.Schema.Types.ObjectId, ref:"Project", required:true}
// })