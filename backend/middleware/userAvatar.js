//internal modules
const uploader = require("../utils/fileUploader")

function userAvatarUpload(req, res, next){
    const upload = uploader(
        "userAvatar",
        ["image/jpg","image/png","image/jpeg"],
        200000,
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

module.exports = userAvatarUpload;