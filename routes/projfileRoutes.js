const express = require("express");
const proj_file_router = express.Router();

const { upload_single_file, bulk_upload_files, get_all_project_files, delete_file, get_a_file, delete_many_files,project_file_deletor,delete_all_project_files } = require("../controller/uploadfileController");
const validate_token = require("../middleware/validateTokenHandler");
const verify_project_access = require("../middleware/projectAccessVerifier");
const upload = require("../middleware/fileUploadHandler");
// const verify_project_access = require("../middleware/projectAccessVerifier")

proj_file_router.post("/:project_id",verify_project_access("UPDATE-PROJECTS"), upload.single("file"), upload_single_file);
proj_file_router.post("/bulk/:project_id",verify_project_access("UPDATE-PROJECTS"), upload.array("files",10), bulk_upload_files);
proj_file_router.get("/:project_file_id",verify_project_access("VIEW-PROJECTS"), get_a_file);
proj_file_router.get("/bulk/:project_id",verify_project_access("VIEW-PROJECTS"), get_all_project_files);
proj_file_router.delete("/:project_file_id",verify_project_access("UPDATE-PROJECTS"), delete_file);
proj_file_router.delete("/",verify_project_access("UPDATE-PROJECTS"), delete_many_files);
proj_file_router.delete("/bulk/:project_id",verify_project_access("UPDATE-PROJECTS"), delete_all_project_files);



module.exports = proj_file_router ;