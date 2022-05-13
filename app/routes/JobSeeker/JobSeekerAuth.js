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

const accountSid = "AC_process.env.TWILIO_ACCOUNT_SID";
const authToken = "process.env.TWILIO_AUTH_TOKEN";


const client = require('twilio')(accountSid, authToken);


console.log(process.env.JWT_SECRET)

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







// router.post("/auth/check", async (req, res) => {

//     console.log(saveJobSeeker, "-==-==-")
// })



router.post("/auth/signup", async (req, res) => {
    const { profilPicture, name, dateOfBirth, totalExperience = Math.ceil(Math.random(10) * 1) + " Years", nationality, FIN_or_WP, privateInfo, expectedSalary, workExperience, skills } = req.body
    console.log(req.body);
    const findContact = await JobSeeker.findOne({ "privateInfo.contact": privateInfo.contact }).exec();
    console.log(findContact, privateInfo.contact)
    if (findContact) {
        res.status(500).json({
            message: "This contact is not available !",
            success: false,
        })
    } else {
        const jobSeeker = new JobSeeker({ name, dateOfBirth, totalExperience, nationality, FIN_or_WP, privateInfo, expectedSalary, workExperience, skills, profilPicture });
        const saveJobSeeker = await jobSeeker.save();
        if (saveJobSeeker) {
            const user = await JobSeeker.findOne({ _id: saveJobSeeker._id }).exec();
            createUserToken(user, 200, req, res);
        };
    };
});






/*

API for checking if the user is logged in or not
url: http://localhost:5000/api/v1/employer/auth/heck-user
*********************************
*********************************
*********************************
body:{
  token,
}
*/
router.post("/auth/check-user", async (req, res, next) => {
    const { token } = req.body;
    let currentUser;
    if (token) {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        await console.log(decoded);
        const userData = await JobSeeker.findOne({ _id: decoded.user._id });
        currentUser = await userData;
    } else {
        currentUser = null;
    }
    res.status(200).json({
        message: "User successfuly authanticated!",
        success: true,
        authToken: token,
        user: currentUser
    });
});

/*


















Api for logging in the user
url: http://localhost:5000/api/v1/employer/auth/signin
*********************************
*********************************
*********************************
 body:{ companyEmail,
   password }
*/
router.post("/auth/signin", async (req, res) => {
    const { contact } = req.body;
    console.log(contact)
    const user = await JobSeeker.findOne({ "privateInfo.contact": contact }).exec();
    if (user) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "2m", });
        const link = await new AuthLinks({ authLink: token });
        const linkSaved = await link.save();
        if (linkSaved) {

            res.status(200).json({
                message: "Auth Success",
                authLink: `http://localhost:3000/auth/job-seeker/${linkSaved._id}`,
                success: true,
                user
            });
            // client.messages
            //     .create({
            //         from: 'whatsapp:+923172679586',
            //         body: `http://localhost:3000/auth/job-seeker/${linkSaved._id}`,
            //         to: 'whatsapp:+923092793477'
            //     }).then(message => {
            //         res.status(200).json({
            //             message: "Auth Success",
            //             // authLink: `http://localhost:3000/auth/job-seeker/${linkSaved._id}`,
            //             success: true,
            //             user
            //         });
            //     });
        } else {
            res.status(500).json({
                message: "Somthing went to wrong!",
                success: true
            });
        }
    } else {
        res.status(500).json({
            message: "Invalid contact, please enter a valid contact number!",
            success: false
        });
    }


});








/*
Api for getting the auth link
url: http://localhost:5000/api/v1/employer/auth/signin-verification
*********************************
*********************************
*********************************
body:{
  authLink
}
*/

router.post("/auth/signin-verification", async (req, res) => {
    const { authLink } = req.body;
    console.log(authLink);
    if (authLink) {
        const linkData = await AuthLinks.findOne({
            _id: authLink.replace("http://localhost:3000/", ""),
        });
        try {
            const decodedLink = await promisify(jwt.verify)(
                linkData.authLink,
                process.env.JWT_SECRET
            );
            const user = await JobSeeker.findOne({ _id: decodedLink._id }).exec();
            createUserToken(user, 200, req, res);
        } catch (err) {
            res.status(500).json({
                message: "Link Expired",
                success: false,
            });
        }
    } else {
        res.status(500).json({
            message: "Invalid Link",
            success: false,
        });
    }
});






router.post("/auth/update", async (req, res) => {
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
router.post("/profile/upload-site-picture", async (req, res) => {
    const { userId } = req.query
    await createDir("uploads/job-seeker/profiles/").then(async dir => {
        await upload(dir).single("site-picture")(req, null, async (err) => {
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
