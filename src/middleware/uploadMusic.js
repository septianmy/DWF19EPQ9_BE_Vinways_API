const multer = require("multer");

exports.uploadMusic = (file1, file2) => {
    const storage = multer.diskStorage({
        destination: function (req,file,cb) {
            cb(null, "uploads");
        },
        filename: function (req,file,cb){
            cb(null, Date.now() + "-" + file.originalname);
        },
    });

    const fileFilter = function (req,file,cb) {
        if(file.fieldname === file1) {
            if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)){
                req.fileValidationError = {
                    message: "Only image files are allowed!",
                };
                return cb(new Error("Only image files are allowed!"), false);
            }
        }

        if(file.fieldname === file2) {
            if(!file.originalname.match(/\.(mp3|MP3)$/)){
                req.fileValidationError = {
                    message: "Only Music files are allowed!",
                };
                return cb(new Error("Only Music files are allowed!"), false);
            }
        }
        cb(null, true);
    };

    const maxSize = 10 * 1000 * 1000;
    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize,
        },
    }).fields([
        {
            name:file1,
            maxCount: 1,
        },
        {
            name:file2,
            maxCount: 1,
        },
    ]);

    return (req,res,next) => {
        upload(req,res,function(err){
            if(req.fileValidationError)
                return res.status(400).send(req.fileValidationError);
            if(!req.files && !err)
                return res.status(400).send({
                    message: "Please select files to upload",
                });
            
            if(err){
                if(err.code === "LIMIT_FILE_SIZE"){
                    return res.status(400).send({
                        message: "Max file sized 100MB"
                    });
                }
                return res.status(400).send(err);
            }
            return next();
        });
    };
};