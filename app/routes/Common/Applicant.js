const express = require("express");
const moment = require("moment");
const router = express.Router();
const Applicant = require("../../models/Applicant");
const EmployersAuth = require("../../models/EmployersAuth");
const JobListing = require("../../models/JobListing");
const JobSeeker = require("../../models/JobSeekerAuth");
const Offers = require("../../models/ActionsModal");
// const AssessModal = require("../../models/AssessModal");



/*
************************************************************************
 job seeker apply on jobs                                                                   
 _______________________________________________________________________ 
 if job seekr applied befor he can not aplly again                                                       
 _______________________________________________________________________
 url = http://localhost:8000/api/v1/job/applicant/apply   
 body:{                                                                 
   jobId,
   applicantId,
   employerId,
   jobTitle                                               
 }                                                                      
************************************************************************
*/

router.post("/applicant/apply", async (req, res) => {
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    // const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    const { jobId, applicantId, employerId, jobTitle } = req.body;
    try {
        const isApplicantAvailble = await Applicant.findOne({ applicantId, jobId }).exec()
        if (isApplicantAvailble) {
            await res.status(200).json({
                message: "You have already applied on this job!",
                success: true
            });
        } else {
            const applicant = new Applicant({ jobId, applicationStatus: "applied", applicantId, employerId, jobTitle, expiredAt: ater4days });
            const updateApplicantCount = await JobListing.findByIdAndUpdate({ _id: jobId }, { $inc: { numberOfApplicants: 1 } })
            const saveData = await applicant.save();
            console.log(saveData, updateApplicantCount)
            if (saveData && updateApplicantCount) {
                await res.status(200).json({
                    message: "Successfully Applied!",
                    success: true
                });
            };
        };
    } catch (error) {
        console.log(error)
        res.status(200).json({
            message: error?.message,
            success: true
        });
    };
});














/*
************************************************************************
 Fetching all applications history that job seeker aplied on differant  
 job                                                                     
 _______________________________________________________________________ 
 if any application will be rejected by employer side it will be removed
 after 3 days        
 
 ""
 _______________________________________________________________________
 url = http://localhost:8000/api/v1/job/applicant/get_my_applications   
 body:{                                                                 
   skip,                                                                
   applicantId,                                                          
   applicationStatus                                                    
 }                                                                      
************************************************************************
*/
router.post("/applicant/get-appled-applicatons", async (req, res) => {
    const { applicantId, skip = 0, applicationStatus } = req.body;
    console.log(applicantId, skip, applicationStatus);
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    const after3days = moment(date).endOf(date.add(1, 'day')).toDate();
    try {
        const applicant = await Applicant.find({
            applicantId,
            applicationStatus,
            //         rejectedAt: {
            //             $gte:  today 
            //    }
        }).skip(skip).limit(20).exec();
        // console.log(applicant.filter(x => x.rejectedAt < after3days), "ll")
        const filterId = applicant.map(x => x.jobId);
        console.log(filterId, "---")
        const jobseeker = await JobListing.find({ '_id': { $in: filterId } }).exec();
        await res.status(200).json({
            success: true,
            applicants: jobseeker
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error?.message,
            success: true
        });
    };
});









// // API for getting all applicants to show  employer's  spasific job
// router.post("/applicant/get_job_applicantion", async (req, res) => {
//     const { skip, jobId } = req.body;
//     try {
//         const applicant = await Applicant.find({ jobId }).skip(skip).limit(20).select(["applicantId"]).exec();
//         const filterId = applicant.map(x => x.applicantId);
//         const jobseeker = await JobSeeker.find({ '_id': { $in: filterId } }).exec();
//         await res.status(200).json({
//             success: true,
//             applicants: jobseeker
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error?.message,
//             success: true
//         });
//     };
// });











/*
************************************************************************
 Fetching all applications applications to show on employer panle 
  " Application " page                                                                      
 _______________________________________________________________________ 
 if employers want to see data acording to job title they will need to
 select jobTitle. if employer don't select its mean then want to see 
 all application                                                            
 _______________________________________________________________________
 url = http://localhost:8000/api/v1/job/applicant/get-emp-application 
 body:{                                                                 
   jobTitle,  /==>> it dont select all application will be showing 
   employerId,
   applicationStatus                                                    
 }                                                                      
************************************************************************
*/
router.post("/applicant/get-emp-applications", async (req, res) => {
    // applicationStatus == >>>>> "aplied" || "assess" ||  "rejected"(n)
    const { skip = 0, jobTitle, employerId, applicationStatus } = req.body;
    // console.log(req.body, "body")
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    console.log(today)
    console.log(ater4days)
    // const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    const expiredAt = { $gte: today }
    const findWithJob = { jobTitle, employerId, applicationStatus, expiredAt: expiredAt }
    const findBywithoutJob = { employerId, applicationStatus, expiredAt: expiredAt }
    try {
        const applicant = await Applicant.find(jobTitle ? findWithJob : findBywithoutJob).skip(skip).limit(20).select(["applicantId", "jobTitle"]).exec();
        console.log(applicant, "Applican..................t")
        const filterId = await applicant.map(x => x.applicantId);
        const jobseeker = await JobSeeker.find({ '_id': { $in: filterId } }).exec();
        await res.status(200).json({
            success: true,
            applicants_len: jobseeker.length,
            applicants: jobseeker,
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: true
        });
    };
});




// router.post("/applicant/detail", async (req, res) => {
//     const { applicantId } = req.body;
//     try {
//         const seeker = await JobSeeker.findOne({ _id: applicantId }).exec();
//         await res.status(200).json({
//             success: true,
//             applicant: seeker,
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error?.message,
//             success: true
//         });
//     };
// });














/*
************************************************************************
 After submiting quiz this api will store result of job seeker `s quiz                                                                     
 _______________________________________________________________________ 
 if job didnt attend quiz his applicant will be showing in assess tab 
 on employer side 
 _______________________________________________________________________
 url = http://localhost:8000/api/v1/job/applicant/set-skill-score   
 body:{                                                                 
  applicantId,
  skill,
  score                                                    
 }                                                                      
************************************************************************
*/
router.post("/applicant/set-skill-score", async (req, res) => {
    const { applicantId, skill = "RN DEV", score } = req.body;
    try {
        await JobSeeker.updateOne({ _id: applicantId, "skills.skill": skill },
            { $set: { "skills.$.quiz": score, "skills.$.replied": true } });
        await res.status(200).json({
            message: "Score updated successfully!",
            success: true
        });
    } catch (err) {
        await res.status(500).json({
            message: err.message,
            success: false
        });
    };
});






// this api is using for show offer of job seeker 
// router.post("/applicant/get-offer", async (req, res) => {
//     const { applicantId, employerId } = req.body;
//     try {
//         const offerDetail = await new Offers.findOne({ applicantId, employerId });
//         await res.status(200).json({
//             success: true,
//             offerDetail: offerDetail
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error?.message,
//             success: true
//         });
//     };
// });








/*
************************************************************************
IF employers click on "aske a questions" button this api will be called                                                                       
_______________________________________________________________________ 
 After running this api job-seker applicatiion will hide in to "applide" 
 tab and show on "assess" tab
 _______________________________________________________________________
 url = http://localhost:8000/api/v1/job/applicant/aske-question   
 body:{                                                                 
  applicantId,
  jobTitle,
  employerId                                                    
 }                                                                      
************************************************************************
*/

router.post("/applicant/aske-question", async (req, res) => {
    const { applicantId, jobTitle, employerId, companyName, contry } = req.body;
    console.log(req.body, "Body")
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    console.log(ater4days);
    try {
        const checkAssess = await Applicant.findOne({ applicantId, jobTitle, employerId });
        if (checkAssess) {
            await Applicant.updateOne({ applicantId, jobTitle, employerId }, { applicationStatus: "assess", expiredAt: ater4days });
        } else {
            await new Applicant({ applicantId, jobTitle, employerId, applicationStatus: "assess", expiredAt: ater4days }).save();
        }
        await new Offers({ employerId, type: "assess", applicantId, jobTitle, companyName, contry, expiredAt: ater4days }).save();
        await res.status(200).json({
            message: "application moved to assess",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: true,
        });
    };
});








/*
************************************************************************
IF employers click on "aske a questions" button this api will be called                                                                       
_______________________________________________________________________ 
 After running this api job-seker applicatiion will hide in to "applide" 
 tab and show on "assess" tab
 _______________________________________________________________________
 url = http://localhost:8000/api/v1/job/applicant/get-offers   
 body:{                                                                 
  applicantId,
  skip,                                                    
 }                                                                      
************************************************************************
*/
// router.post("/applicant/get-offers", async (req, res) => {
//     const { applicantId, skip } = req.body;
//     try {
//         const offer = await Offers.find({ applicantId }).skip(skip).limit(20).exec();
//         await res.status(200).json({
//             success: true,
//             offers: offer
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error?.message,
//             success: true
//         });
//     };
// });



router.post("/applicant/reject-aplied", async (req, res) => {
    const { applicantId, jobTitle, employerId, } = req.body;
    // const date = moment().startOf('day');
    // // console.log(moment().format())
    // const today = date.toDate();
    // date.add(3, 'days');
    // // const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    // const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    // console.log(today > ater4days)
    // console.log(today)
    // console.log(ater4days)
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    console.log(ater4days);

    try {
        await Applicant.updateOne({ applicantId, jobTitle, employerId }, {
            applicationStatus: "rejected",
            rejectedAt: ater4days
        });
        await res.status(200).json({
            message: "application rejected!",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: true
        });
    };
});



router.post("/offer/reject-offer", async (req, res) => {
    const { applicantId, jobTitle, employerId, offerId } = req.body;
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    console.log(ater4days)
    try {
        await Offers.updateMany({
            _id: offerId,
            // applicantId, jobTitle, employerId
        }, {
            rejectedAt: ater4days,
            rejected: true
        });
        await res.status(200).json({
            message: "application rejected!",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: true
        });
    };
});




router.post("/offer/make-offer", async (req, res) => {
    console.log(req.body)
    const { applicantId, jobTitle, employerId, basicSalary, jobId, workHours, allowance, overTimeRate, dateOfpayment, Deduction } = req.body;
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    console.log(ater4days);
    try {
        const isAppleiedBefor = await Applicant.findOne({ applicantId, jobTitle, employerId });
        console.log(isAppleiedBefor, "=====")
        if (isAppleiedBefor !== null) {
            await Applicant.updateOne({ applicantId, jobTitle, employerId }, { applicationStatus: "offered", expiredAt: ater4days });
        } else {
            await new Applicant({ applicantId, jobTitle, employerId, jobId, applicationStatus: "offered", expiredAt: ater4days }).save();
        }
        await new Offers({ employerId, type: "offer", applicantId, jobTitle, basicSalary, workHours, allowance, overTimeRate, dateOfpayment, Deduction, expiredAt: ater4days }).save()
        await res.status(200).json({
            message: "offer send!",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: true
        });
    };
});


/*
*******************************************************
 Fetching all offer for listing on job seeker app (web)  
*******************************************************
*/
router.post("/offer/get-jobsk-offers", async (req, res) => {
    const { applicantId, skip = 0 } = req.body;
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    console.log(today)
    console.log(ater4days)
    try {
        const offer = await Offers.find({
            applicantId,
            // $or: [
            //     { applicationStatus: "applied" },
            //     { applicationStatus: "assess" },
            // ],
            $and: [
                { rejected: 0 },
                { expiredAt: { $gte: today } },
            ]
        }).skip(skip)
            .limit(20)
            .exec();
        console.log(offer)
        await res.status(200).json({
            success: true,
            offers: offer
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: true
        });
    };
});









/*
*******************************************************
 Fetching all offer for listing on employee dashboard  
*******************************************************
*/
router.post("/offer/get-emp-offers", async (req, res) => {
    const { employerId, skip } = req.body;
    const date = moment().startOf(1, 'day');
    const today = date.toDate();
    date.add(3, 'days');
    const ater4days = moment(date).endOf(date.add(1, 'day')).toDate();
    try {
        // { '_id': { $in: filterId } }
        const offers = await Offers.find({
            employerId,
            $or: [
                // { expiredAt: { $gte: today } },
                { rejectedAt: { $gte: today } }
            ]
        }).select("applicantId").skip(skip).limit(20).exec();
        const offeredIds = offers.map(x => x.applicantId)
        const offeredApplicant = await JobSeeker.find({ _id: { $in: offeredIds } });



        await res.status(200).json({
            success: true,
            offered: offeredApplicant
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: true
        });
    };
});










// API : accecting application and hire a worker 
router.post("/applicant/accept-offer", async (req, res) => {
    const { applicantId, employerId, jobId } = req.body;
    try {
        const hiredWorker = await JobListing.findOne({ _id: jobId }).select(["hiredWorkers", "numberOfWorkers"]).exec();
        const isWorking = await JobSeeker.findOne({ _id: applicantId }).select("isHired").exec();
        if (isWorking?.isHired) {
            await res.status(500).json({
                message: "Now this peson is not available for you!",
                success: false,
            });
        } else {
            if (hiredWorker?.hiredWorkers == hiredWorker?.numberOfWorkers) {
                await res.status(500).json({
                    message: "You can not hire a more person!",
                    success: false,
                });
            } else {
                const hiered = await JobSeeker.updateOne({ _id: applicantId }, { employerId, jobId, isHired: true });
                const updateHiredtCount = await JobListing.findByIdAndUpdate({ _id: jobId, }, { $inc: { hiredWorkers: 1 } });
                await Applicant.updateOne({ applicantId }, { applicationStatus: "accepted" });
                if (hiredWorker?.hiredWorkers == hiredWorker?.numberOfWorkers - 1) {
                    await JobListing.updateOne({ jobId }, { isValid: false });
                }
                if (hiered && updateHiredtCount) {
                    await res.status(200).json({
                        message: "You have hired this person!",
                        success: true,
                    });
                };
            };
        };
    } catch (error) {
        res.status(500).json({
            message: error?.message,
            success: true
        });
    };
});



module.exports = router;

