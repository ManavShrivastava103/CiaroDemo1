const multer = require("multer");
const cloudinary = require("../config/cloudinaryConnect");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { file_upload_size, file_upload_allowed_types} = require("../platformConstants");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async(req,file) => {
        return {
            folder: "ciaro-demo-project-files",
            resource_type: "auto",
            public_id: `${Date.now()}-${file.originalname}`,
            allowed_formats: file_upload_allowed_types
        };
    }
});

const upload = multer({
    storage,
    limits : {
        fileSize : file_upload_size
    }
});

module.exports = upload;