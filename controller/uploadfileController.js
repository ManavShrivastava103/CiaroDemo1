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

module.exports = { upload_single_file };




// const projfile_schema = new Schema({
//     public_id : {type:String, required:true},
//     url : {type:String, required:true},
//     file_name : {type:String},
//     file_type : {type:String},
//     uploaded_by : {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}, 
//     in_project : {type:mongoose.Schema.Types.ObjectId, ref:"Project", required:true}
// })