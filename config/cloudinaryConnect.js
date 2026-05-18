const cloudinary = require("cloudinary").v2 ;
const colors = require("colors");

cloudinary.config ({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

cloudinary.api.ping().then(()=> {
    console.log(colors.green("Connection to Cloudinary Successful!!!"));
}).catch((error) => {
    console.log(colors.red("Connection to Cloudinary Failed!!!"));
    console.log(colors.yellow(error.message));
});

module.exports = cloudinary ;