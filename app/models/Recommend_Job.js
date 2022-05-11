var mongoose = require("mongoose");



const Job = mongoose.Schema({
    recommendedId: { type: String, required: true },
    jobId: { type: String, required: true },
    recommenderId: { type: String, required: true },
    employerId: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.model("recommendedJobSeekers", Job);
