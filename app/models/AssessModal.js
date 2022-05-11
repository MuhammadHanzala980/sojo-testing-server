var mongoose = require("mongoose");


const Job = mongoose.Schema({
    employerId: { type: String, required: true },
    applicantId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    contry: { type: String, required: true },
    replied: { type: Boolean, default:false },
    expiredAt: { type: Date, required: true }

}, { timestamps: true });


module.exports = mongoose.model("assess", Job);
