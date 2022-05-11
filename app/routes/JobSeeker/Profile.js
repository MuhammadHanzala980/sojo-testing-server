const express = require("express");
const { promisify } = require("util");
const router = express.Router();
const bcrypt = require("bcrypt");
const Employer = require("../../models/EmployersAuth");
const JobSeeker = require("../../models/JobSeekerAuth");
const AuthLinks = require("../../models/AuthLinks");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const baseUrl = `http://localhost:8000/`;
const createDir = require("../../dir");






const createUserToken = async (user, code, req, res) => {
    const token = signToken({ _id: user._id });
    await res.status(code).json({
        message: "Account successfuly created!",
        success: true,
        authToken: token,
        user: user
    });
};
const signToken = async user => await jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });




router.post("/profile/update", async (req, res) => {
    const { _id, profilPicture, name, dateOfBirth, nationality, workExperience, privateInfo, skills, languageRating, characterRating, healthRating, } = req.body;
    try {
        const updated = await JobSeeker.updateOne({ _id }, { profilPicture, name, dateOfBirth, nationality, workExperience, privateInfo, skills, languageRating, characterRating, healthRating });
        if (updated.modifiedCount) {
            res.status(200).json({
                message: "Profile successfuly updated!",
                success: true,
            });
        } else {
            res.status(500).json({
                message: "Oops, Update faild!",
                success: true,
            });
        };
    } catch (err) {
        res.status(500).json({
            message: err?.message,
            success: true,
        });
    };
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
router.post("/auth/upload-profile-picture", async (req, res) => {
    await createDir("uploads/job-seeker/profiles/").then(async dir => {
        await upload(dir).single("job-seeker-profile")(req, null, async (err) => {
            if (!err) {
                const file = req.file;

                if (file) {
                    const profilePicture = `${baseUrl}${dir}/${file.filename}`.replace("uploads/", "");
                    res.status(200).json({
                        profilePicture,
                        message: "Picture uploaded!",
                        success: true,
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


module.exports = router;
