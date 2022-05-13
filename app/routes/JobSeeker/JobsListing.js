const express = require("express");
const { promisify } = require("util");
const router = express.Router();
const bcrypt = require("bcrypt");
const JobListing = require("../../models/JobListing");
const Employers = require("../../models/EmployersAuth");
const Recommend_Job = require("../../models/Recommend_Job");
const jwt = require("jsonwebtoken");


router.post("/job/get", async (req, res) => {
    const { skip } = req.body;
    try {
        const jobListing = await JobListing.find().skip(skip).limit(10).exec();
        console.log(jobListing)
        await res.status(200).json({
            message: "Job List ",
            success: true,
            jobs: jobListing
        });
    } catch (error) {
        res.status(200).json({
            message: error?.message,
            success: true
        });
    };
});


// API FOR GETTING JOB DETAIL ___
router.get("/job/get/:id", async (req, res) => {
    const { id } = req.params;
    try {
        let findJobDetail = await JobListing.findOne({ _id: id }).exec();
        console.log(findJobDetail)
        const employerDetails = await Employers.findOne({ _id: findJobDetail?.employerId }).select(["sitePictures", "reviews"]).exec();
        findJobDetail.sitePictures = await employerDetails?.sitePictures;
        findJobDetail.reviews = await employerDetails?.reviews;

        await res.status(200).json({
            success: true,
            jobDetail: findJobDetail
        });
    } catch (error) {
        console.log(error)
        res.status(200).json({
            message: error?.message,
            success: false
        });
    };
});



router.post("/job/search-job", async (req, res) => {
    const { keyword, skip = 0 } = req.body;
    try {
        const searches = await JobListing.find({
            isValid: true,
            $or: [{ jobTitle: { $regex: keyword, $options: 'i' } }]
        }).skip(skip).limit(10).exec();
        await res.status(200).json({
            message: searches,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: false
        });
    };
});


router.post("/job/recommend", async (req, res) => {
    const { jobId, recommendedId, recommenderId, employerId, } = req.body;
    try {
        const findRecommend = await Recommend_Job.findOne({ employerId, jobId }).select("recommendedId").exec()
        if (findRecommend) {
            res.status(200).json({
                message: "You can not ecommend again",
                success: true
            });
        } else {
            await new Recommend_Job({ jobId, recommendedId, recommenderId, employerId }).save();
            res.status(200).json({
                message: "Successfully recommended!",
                success: true
            });
        }
    } catch (error) {
        res.status(200).json({
            message: error?.message,
            success: true
        });
    };
})







module.exports = router;