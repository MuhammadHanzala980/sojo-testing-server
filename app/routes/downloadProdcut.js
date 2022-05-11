const express = require("express");
const router = express.Router();
const LinkModal = require("../models/Products/ProductLink");
const { checkToken } = require("../token_verification");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.URL_KEY);
var fileSystem = require('fs'),
    path = require('path');


/********************************************************/
router.get("/download", async (req, res) => {
    const query = req.query;
    const link = await LinkModal.findOne({ id: query.product_id }).exec();
    if (link !== null) {
        const decryptedData = cryptr.decrypt(link.hash);
        var filePath = path.join(__dirname, "..", "..", "/uploads/", decryptedData.replace("https://api.ifbotix.com/", ""));
        var stat = fileSystem.statSync(filePath);
        fileSystem.readFile(filePath, (a, b) => {
            res.writeHead(200, {
                'Content-Type': 'pdf',
                'Content-Length': stat.size,
                'Content-Disposition': `attachment; filename=${query.product_name}.zip`
            });
            res.write(b, 'binary');
            res.end('<b>hello</b>');
        });
    } else {
        res.status(500).json({
            message: "SOMETHING WENT TO WRONG!",
            success: false
        });
    }
});

module.exports = router



















// const express = require("express");
// const router = express.Router();
// const LinkModal = require("../models/Products/ProductLink");
// const Cryptr = require('cryptr');
// const cryptr = new Cryptr(process.env.URL_KEY);
// var fileSystem = require('fs'),
//     path = require('path');


// /********************************************************/
// router.get("/download", async (req, res) => {
//     const query = req.query;
//     const link = await LinkModal.findOne({ id: query.product_id }).exec();
//     // https://api.ifbotix.com/product/wordpress/zips/2045f4662ebb78c1f4b4-55e5-0410-8e2ffd2416b641a9/wordpress-zip-1631183524053.zip
//     const decryptedData = cryptr.decrypt(link.hash);
//     // var filePath = path.join(__dirname, "..", "..", "/Uploads/cv/resume.pdf");
//     var filePath = path.join(__dirname, "..", "..", "/Uploads/", decryptedData.replace("https://api.ifbotix.com/", ""));
//     var stat = fileSystem.statSync(filePath);
//     fileSystem.readFile(filePath, (a, b) => {
//         res.writeHead(200, {
//             'Content-Type': 'pdf',
//             'Content-Length': stat.size,
//             'Content-Disposition': 'attachment; filename=applicant-cv.zip'
//         });
//         res.write(b, 'binary');
//         res.end('<b>hello</b>');
//     });
// });

// module.exports = router




