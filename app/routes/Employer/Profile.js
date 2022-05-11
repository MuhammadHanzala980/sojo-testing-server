const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Employer = require("../../models/EmployersAuth");
const multer = require("multer");
const baseUrl = `http://localhost:8000/`;
const createDir = require("../../dir");





/*
API for employer signup
*********************************
*********************************
*********************************
url: http://localhost:5000/api/v1/employer/jobs/create
body:{
  companyEmail,
   password,
    mobileNumber,
     companyName
}
*/
router.post("/profile/update-password", async (req, res) => {
    const { password, userId } = req.body;
    if (password) {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (!err) {
                await Employer.updateOne({ _id: userId }, { password: hash })
                await res.status(500).json({
                    success: false,
                    message: "Your password has been updated"
                });
            };
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Something went to wrong!"
        });
    };
});





router.post("/profile/update-profile", async (req, res) => {
    const { userId, address, salary, dateOfPayment, workHours, overtimeRate, allowance, deduction } = req.body;
    const data = { address, salary, dateOfPayment, workHours, overtimeRate, allowance, deduction }
    const updateProfile = await Employer.updateOne({ _id: userId }, data);
    console.log(updateProfile, "updateProfile")
    await res.status(200).json({
        message: "Profile success fully updated!",
        success: true
    })
});



// MULTER UPLOAD PICS
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
router.post("/profile/upload-site-picture", async (req, res) => {
    const { userId } = req.query;
    await createDir("uploads/site-pictures/").then(async dir => {
        await upload(dir).single("site-picture")(req, null, async (err) => {
            if (!err) {
                const file = req.file;
                if (file) {
                    const url = `${baseUrl}${dir}/${file.filename}`.replace("uploads/", "");
                    const updateProfile = await Employer.updateOne({ _id: userId }, { $push: { sitePictures: url } });
                    res.status(200).json({
                        url,
                        message: "Picture uploaded!",
                        success: true,
                        updateProfile
                    });
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





// GETTING SITE PITCUTERS
router.get("/job/site_pictures/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const site_pictures = await Employer.findOne({ _id: id }).select("sitePictures")
        await res.status(200).json({
            success: true,
            jobs: site_pictures
        });
    } catch (error) {
        res.status(200).json({
            message: error?.message,
            success: true
        });
    };
});




module.exports = router
