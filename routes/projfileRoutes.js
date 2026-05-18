const express = require("express");
const proj_file_router = express.Router();

const { upload_single_file } = require("../controller/uploadfileController");
const validate_token = require("../middleware/validateTokenHandler");
const verify_project_access = require("../middleware/projectAccessVerifier");
const upload = require("../middleware/fileUploadHandler");

proj_file_router.post("/:project_id", upload.single("file"), upload_single_file);

module.exports = proj_file_router ;