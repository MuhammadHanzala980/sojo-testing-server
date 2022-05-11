const mongoose = require("mongoose");
const match =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const jobSeekers = mongoose.Schema({
    profilPicture: { type: String, required: false },
    name: { type: String, required: true },
    dateOfBirth: {
        day: { type: String, required: true },
        month: { type: String, required: true },
        year: { type: String, required: true },
    },
    nationality: { type: String, required: true },
    workExperience: {
        type: [
            {
                role: { type: String, required: true },
                companyName: { type: String, required: true },
                startDate: {
                    month: { type: String, required: true },
                    year: { type: String, required: true },
                },
                endDate: {
                    month: { type: String, required: true },
                    year: { type: String, required: true },
                }
            }
        ], required: true
    },
    totalExperience: { type: String, required: true },
    privateInfo: {
        type: {
            contact: { type: String, required: true },
            FIN_or_WP: { type: String, required: true },
            expectedSalary: { type: String, required: true },
            certificateOrLicense: {
                type: [
                    {
                        skillName: { type: String, required: true },
                        startDate: { type: String, required: true },
                        endDate: { type: String, required: true },
                    }
                ], required: false
            },
        },
        required: false
    },


    skills: {
        type: [
            {
                skill: { type: String, required: true },
                quiz: { type: Number, default: 0 },
                replied: { type: Boolean, default: false }
            }
        ],
        required: true
    },
    employerId: { type: String, required: false, default: "not found" },
    jobId: { type: String, required: false, default: "not found" },
    isHired: { type: Boolean, required: false, default: false },
    languageRating: { type: Number, required: false, default: 0 },
    characterRating: { type: Number, required: false, default: 0 },
    healthRating: { type: Number, required: false, default: 0 },
    verified: { type: Boolean, required: false, default: false },
    searchNewJobCount: { type: Number, required: false, default: 0 },
    jobTitle: { type: String, required: false }

}, { timestamps: true, });
module.exports = mongoose.model("JobSeeker", jobSeekers);
