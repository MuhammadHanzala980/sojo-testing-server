const express = require("express");
const { promisify } = require("util");
const router = express.Router();
const bcrypt = require("bcrypt");
const Employer = require("../../models/EmployersAuth");
const AuthLinks = require("../../models/AuthLinks");
const jwt = require("jsonwebtoken");
const sendMail = require("../../sendMail");
const { emailUi, updatePasswordUi } = require("../../emailTepmlate");
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
/*
API for employer signup
*********************************
url: http://localhost:5000/api/v1/employer/auth/signup;

body:{
 "requiredWorkerType": "welder",
  "requiredNumberOfWorker": 10,
  "requiredeExperienceOfWorker": "2 years",
  "requiredSkillLevel": "expert",
  "salary":"20000",
  "companyEmail": "maazahmed2k16@gmail.com",
  "companyName": "DEVCOM",
  "mobileNumber": "w2292",
  "password": "123456789",
  "address": "In BE, we usually write: John Smith, 23 Acacia Avenue, Harrogate, Yorkshire, POSTCODE. We might add 'UK' if the letter is coming from abroad.",
  "sitePictures": ["http://www.pn-projectmanagement.com/uploads/2/7/8/8/27887585/editor/img-1296-002.jpg?1569383633","https://www.letsbuild.com/wp-content/uploads/2019/04/construction-site-2858310_1920-1.jpg" ],
}
*/
router.post("/auth/check", async (req, res) => {
  setTimeout(() => {
    console.log("-----", new Date().getSeconds())
    new Date().getSeconds()
  }, 5000)

  res.send({
    res: "succ"
  })
})

router.post("/auth/del", async (req, res) => {
  await Employer.deleteOne({ companyEmail: req.body.companyEmail });
  res.send("")

})

router.post("/auth/signup", async (req, res) => {
  const {
    requiredWorkerType,
    requiredNumberOfWorker,
    requiredeExperienceOfWorker,
    requiredSkillLevel,
    salary,
    companyEmail,
    companyName,
    mobileNumber,
    password,
    address,
    sitePictures } = req.body;

  Employer.findOne({ companyEmail }).exec().then(async user => {
    const findByMobileNumber = await Employer.findOne({ mobileNumber }).exec();
    if (user) {
      return res.status(500).json({
        success: false,
        message: "Email address is not available!",
      });
    } else if (findByMobileNumber) {
      return res.status(500).json({
        success: false,
        message: "Phone number is not available! ",
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err?.message);
          res.status(500).json({
            message: err?.message,
            success: false,
          });
        } else {
          const user = new Employer({ requiredWorkerType, requiredNumberOfWorker, requiredeExperienceOfWorker, requiredSkillLevel, salary, companyEmail, companyName, mobileNumber, password: hash, address, sitePictures });
          user.save().then((success) => {
            console.log(success)
            const token = jwt.sign({ user: user._id, }, process.env.JWT_SECRET, {
              expiresIn: "60s"
            });
            sendMail({ email: companyEmail, emailUi, redirect: `verify-email/${token}`, text: " We're thrilled to have you here! Get ready to dive into your new account" })
              .then(() => {
                res.status(201).json({
                  message: "You company account has been created successfully!",
                  success: true
                });
              });

          }).catch((err) => {
            res.status(500).json({
              success: false,
              error: err,
            });
          });
        };
      });
    };
  }).catch((err) => {
    res.status(500).json({
      error: err,
      success: false,
      message: err?.message,
    });
  });
});



/*
Api for logging in the user
url: http://localhost:5000/api/v1/employer/auth/signin
*********************************
 body:{ 
   companyEmail,
   password 
  }
*/
router.post("/auth/signin", (req, res) => {
  const { companyEmail, password } = req.body;
  Employer.find({ companyEmail }).exec().then((user) => {
    console.log(user);
    if (user < 1) {
      res.send({
        message: "Invalid email or password !",
      });
    } bcrypt.compare(password, user[0].password, async (err, result) => {
      if (err) {
        await res.send({
          message: "Auth field",
        });
      } else if (result) {
        const token = jwt.sign({ _id: user[0]._id }, process.env.JWT_SECRET, {
          expiresIn: "10m",
        });
        const saveLink = new AuthLinks({
          authLink: token,
        });
        saveLink
          .save().then(async () => {
            sendMail({
              email: companyEmail, emailUi, redirect: `verify-email/${token}`,
              text: "We're thrilled to have you here! Get ready to dive into your new account"
                + `http://localhost:3000/${saveLink._id}`
            }).then(() => {
              res.status(201).json({
                message: "You company account has been logged in successfully!",
                success: true,
                link: `http://localhost:3000/${saveLink._id}`
              });
            });

          }).catch(async (err) => {
            await res.status(200).json({
              message: "Invalid email or password ! 1",
              success: false,
            });
          });
      } else {
        await res.status(200).json({
          message: "Invalid email or password !",
          success: false,
        });
      }
    });
  }).catch((err) => {
    res.status(500).json({
      error: err,
    });
  });
});






const signToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createUserToken = async (user, code, req, res) => {
  const token = signToken({ _id: user._id, type: process.env.ADMIN_TYPE });
  user.password = undefined;
  user.account_type = undefined;
  await res.status(code).json({
    status: "success",
    token,
    employer: user,
  });
};

/*

API for checking if the user is logged in or not
url: http://localhost:5000/api/v1/employer/auth/heck-user
*********************************
body:{
  token,
}
*/
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
router.post("/auth/check-user", async (req, res, next) => {
  const { token, } = req.body;
  let currentUser;
  if (token) {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    await console.log(decoded);
    const userData = await SupperAdmin.findOne({ _id: decoded.user._id });
    userData.password = undefined;
    userData.account_type = undefined;
    currentUser = await userData;
  } else {
    currentUser = null;
  }
  res.status(200).send({ currentUser });
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
  if (authLink) {
    const linkData = await AuthLinks.findOne({
      _id: authLink.replace("http://localhost:3000/", ""),
    });
    try {
      const decodedLink = await promisify(jwt.verify)(
        linkData.authLink,
        process.env.JWT_SECRET
      );
      const user = await Employer.findOne({ _id: decodedLink._id }).exec();
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

module.exports = router;
