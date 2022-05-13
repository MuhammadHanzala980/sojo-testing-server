var mongoose = require("mongoose");


const applicant = mongoose.Schema({
    jobId: { type: String, required: false },
    applicationStatus: { type: String, required: true },
    applicantId: { type: String, required: true },
    employerId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    recommendedBy: { type: String, required: false },
    isRecommended: { type: Boolean, required: false },
    rejectedAt: { type: Date, required: false },
    expiredAt: { type: Date, required: true },
    autoApplied: { type: Boolean, required: false, default: false }
}, {
    timestamps: true
});


module.exports = mongoose.model("applicant", applicant);
