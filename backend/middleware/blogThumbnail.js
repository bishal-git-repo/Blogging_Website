//internal modules
const uploader = require("../utils/fileUploader")

function blogThumbnailUpload(req, res, next){
    const upload = uploader(
        "blogThumbnail",
        ["image/jpg","image/png","image/jpeg"],
        1000000,
        "only .jpg, jpeg or .png format allowed!"
    );

    //call the middleware function
    upload.any()(req, res, (err)=>{
        if (err) {
            res.status(500).json({
                error: err.message || "there is file uploading error",
            });
        } else {
            next();
        }
    });
};

module.exports = blogThumbnailUpload;