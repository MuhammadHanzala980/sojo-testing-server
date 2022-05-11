var mongoose = require("mongoose");



const Job = mongoose.Schema({
    projectTitle: { type: String, required: false },
    jobTitle: { type: String, required: true },
    description: { type: String, required: true },
    skillLevel: { type: String, required: true },
    requiredeExperience: { type: String, required: true },
    numberOfWorkers: { type: Number, required: true },
    salary: { type: String, required: true },
    employerId: { type: String, required: true },
    isValid: { type: Boolean, required: false, default: true },
    hiredWorkers: { type: Number, required: true, default: 0 },
    numberOfApplicants: { type: Number, required: false, default: 0 },
    sitePictures: { type: [String], required: false, }
}, { timestamps: true });


module.exports = mongoose.model("Job", Job);
