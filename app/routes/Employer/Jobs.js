const express = require("express");
const { promisify } = require("util");
const router = express.Router();
const bcrypt = require("bcrypt");
const JobListing = require("../../models/JobListing");
const JobSeeker = require("../../models/JobSeekerAuth");
const jwt = require("jsonwebtoken");
const EmployersAuth = require("../../models/EmployersAuth");

/*
API for employer signup
*********************************
*********************************
*********************************
url: http://localhost:5000/api/v1/employer/jobs/create
body:{
  projectTitle,
   jobTitle,
    description,
     skillLevel,
      requiredeExperience,
       numberOfWorkers,
        salary,
         employerId
}*/
// router.get("/emp/get", async (req, res) => {
//   let a = await EmployersAuth.find().exec()
//   console.log(a.map(x => x._id), "a");
//   await res.send(a.map(x => x._id))
// })


// const jobNames = ["Welding", "Excavation", "Crane Operator", "Fire Protection", "Hacking", "Hoarding", "Piping", "Tiling", "Waterproofing", "Planting", "Cabling", "Carpentry", "Glass", "Scaffolding", "Ceiling", "Lighting", "Driver", "RC casting"]
// const emp_ids = ["624f28eae866498111329481", "624f2bc2266137522265f238", "624f33d9348c7aa91c3d768c", "624f33dd348c7aa91c3d7690", "624f33df348c7aa91c3d7694", "624f33e1348c7aa91c3d7698", "624f33e2348c7aa91c3d769c", "624f33e4348c7aa91c3d76a0", "624f33e6348c7aa91c3d76a4", "624f33e7348c7aa91c3d76a8", "624f33e9348c7aa91c3d76ac", "624f33eb348c7aa91c3d76b0", "624f33ec348c7aa91c3d76b4", "624f3452348c7aa91c3d76b8", "624f3453348c7aa91c3d76bc", "624f3455348c7aa91c3d76c0", "624f3456348c7aa91c3d76c4", "624f3458348c7aa91c3d76c8", "624f345a348c7aa91c3d76cc", "624f345b348c7aa91c3d76d0", "624f345e348c7aa91c3d76d4", "624f345f348c7aa91c3d76d8", "624f3461348c7aa91c3d76dc", "624f3463348c7aa91c3d76e0", "624f3465348c7aa91c3d76e4", "624f3467348c7aa91c3d76e8", "624f3468348c7aa91c3d76ec", "624f346a348c7aa91c3d76f0", "624f346c348c7aa91c3d76f4", "624f34db348c7aa91c3d76f8", "624f34de348c7aa91c3d76fc", "624f34df348c7aa91c3d7700", "624f34e1348c7aa91c3d7704", "624f34e3348c7aa91c3d7708", "624f34e4348c7aa91c3d770c", "624f34e5348c7aa91c3d7710", "624f34e7348c7aa91c3d7714", "624f34e8348c7aa91c3d7718", "624f34ea348c7aa91c3d771c", "624f34ec348c7aa91c3d7720", "624f34ee348c7aa91c3d7724", "624f34ef348c7aa91c3d7728", "624f34f3348c7aa91c3d772c", "624f34f4348c7aa91c3d7730", "624f3507348c7aa91c3d7734", "624f3509348c7aa91c3d7738", "624f350b348c7aa91c3d773c", "624f350c348c7aa91c3d7740", "624f350e348c7aa91c3d7744", "624f350f348c7aa91c3d7748", "624f3511348c7aa91c3d774c", "624f3512348c7aa91c3d7750", "624f3514348c7aa91c3d7754", "624f3515348c7aa91c3d7758", "624f3517348c7aa91c3d775c", "624f3518348c7aa91c3d7760", "624f351a348c7aa91c3d7764", "624f351c348c7aa91c3d7768", "624f351d348c7aa91c3d776c", "624f351f348c7aa91c3d7770", "624f3521348c7aa91c3d7774", "624f3523348c7aa91c3d7778", "624f3526348c7aa91c3d777c", "624f3527348c7aa91c3d7780", "624f3529348c7aa91c3d7784", "624f352a348c7aa91c3d7788", "624f352c348c7aa91c3d778c", "624f352e348c7aa91c3d7790"]


// console.log(jobNames.length)
// console.log(emp_ids.length)


router.post("/job/create", async (req, res) => {
  // const xx = Math.round(Math.random(1) * 17);
  // const yy = Math.round(Math.random(1) * 67);
  // const zz = Math.round(Math.random(100000) * 100000);
  // console.log(xx)
  // console.log(yy)
  // const { projectTitle, jobTitle = jobNames[xx], description, skillLevel, requiredeExperience, numberOfWorkers, salary = zz, employerId = emp_ids[yy] } = req.body
  const { projectTitle, jobTitle, description, skillLevel, requiredeExperience, numberOfWorkers, salary, employerId } = req.body
  try {
    const jobListing = new JobListing({ projectTitle, jobTitle, description, skillLevel, requiredeExperience, numberOfWorkers, salary, employerId })
    const saveData = await jobListing.save()
    if (saveData) {
      await res.status(200).json({
        message: "Job " + jobTitle + " successfully created !",
        success: true
      });
    };
  } catch (error) {
    res.status(200).json({
      message: error?.message,
      success: true
    });
  };
});




router.get("/job/get/:id", async (req, res) => {
  const employerId = req.params.id;
  try {
    const jobListing = await JobListing.find({ employerId }).exec()
    if (jobListing.length) {
      await res.status(200).json({
        message: "Job List ",
        success: true,
        jobs: jobListing
      });
    };
  } catch (error) {
    res.status(200).json({
      message: error?.message,
      success: true
    });
  };
});



router.put("/job/update", async (req, res) => {
  const { projectTitle, jobTitle, description, skillLevel, requiredeExperience, numberOfWorkers, salary, jobId } = req.body;
  try {
    const updateData = await JobListing.updateOne(
      { jobId }, { projectTitle, jobTitle, description, skillLevel, requiredeExperience, numberOfWorkers, salary });
    if (updateData) {
      await res.status(200).json({
        message: "Job successfully created !",
        success: true
      });
    };
  } catch (error) {
    res.status(500).json({
      message: error?.message,
      success: true
    });
  };
});





router.post("/job/search-job-seekers", async (req, res) => {
  const { jobTitle = null, totalExperience = null, salary = null, skip = 0 } = req.body;
  console.log(jobTitle)
  try {
    const jobsSeekers = await JobSeeker.find({
      $or: [
        { "skills.skill": jobTitle },
        // { skills: { $elemMatch: { skill: 'RN DEV' } } },
        // {"awards.award":"Turing Award"},
        { totalExperience: totalExperience },
        {
          "privateInfo.expectedSalary": {
            $gt: salary
          }
        }]
    }).skip(skip).limit(10).exec();
    const totalJobSeeker = await JobSeeker.estimatedDocumentCount()
    await res.status(200).json({
      success: true,
      totalJobSeeker,
      jobsSeekers
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message,
      success: false
    });
  };
});





router.post("/job/job-seeker-detail", async (req, res) => {
  const { jobSeekerId } = req.body;
  try {
    const seeker = await JobSeeker.findOne({ _id: jobSeekerId }).exec();
    await res.status(200).json({
      success: true,
      applicant: seeker,
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message,
      success: true
    });
  };
});












// API for getting all applicants to show  employer's  spasific job
router.post("/job/get-applicantion", async (req, res) => {
  const { skip, jobId } = req.body;
  try {
    const applicant = await Applicant.find({ jobId }).skip(skip).limit(20).select(["applicantId"]).exec();
    const filterId = applicant.map(x => x.applicantId);
    const jobseeker = await JobSeeker.find({ '_id': { $in: filterId } }).exec();
    await res.status(200).json({
      success: true,
      applicants: jobseeker
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message,
      success: true
    });
  };
});



module.exports = router;

