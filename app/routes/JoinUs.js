const express = require("express");
const router = express.Router();
const JoinUs = require("../models/JoinUsModal");
const path = require("path");
const multer = require("multer");
const baseUrl = `http://api.ifbotix.com/`;
const createDir = require("../dir");
var fileSystem = require('fs');


// MULTER 
/********************************************************/
const storage = saveTo => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, saveTo);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = saveTo => multer({ storage: storage(saveTo) });

router.post("/upload-cv", async (req, res) => {
    console.log(req.body);
    await createDir("uploads/cv/").then(async dir => {
        await upload(dir).single("cv")(req, null, (err) => {
            if (!err) {
                const file = req.file;
                if (file) {
                    const path = `${baseUrl}${dir}/${file.filename}`.replace("uploads/", "");
                    res.status(200).json(path);
                } else {
                    res.status(500).json({
                        message: "SOMETHING WENT TO WRONG!",
                        success: false
                    });
                };
            };
        });
    });
});

/********************************************************/
router.get("/cv/download", async (req, res) => {
    // console.log(Object.values(req))
    const { dir, file_name, applicant_name } = req.query;
    // const link = url;
    var filePath = path.join(__dirname, "..", "..", "/uploads/cv", dir, "/", file_name);
    var stat = fileSystem.statSync(filePath);
    fileSystem.readFile(filePath, (a, b) => {
        console.log(path.extname(file_name));
        res.writeHead(200, {
            'Content-Type': 'pdf',
            'Content-Length': stat.size,
            'Content-Disposition': `attachment; filename=${applicant_name}${path.extname(file_name)}`
        });
        res.write(b, 'binary');
        res.end('<b>hello</b>');
    });
});


module.exports = router;




