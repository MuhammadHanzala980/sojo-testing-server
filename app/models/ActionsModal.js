var mongoose = require("mongoose");



const Job = mongoose.Schema({
    employerId: { type: String, required: true },
    applicantId: { type: String, required: true },
    basicSalary: { type: String, required: false },
    jobTitle: { type: String, required: true },
    workHours: { type: String, required: false },
    allowance: { type: String, required: false },
    overTimeRate: { type: String, required: false },
    dateOfpayment: { type: String, required: false },
    Deduction: { type: String, required: false },
    accepted: { type: Boolean, default: false },
    rejected: { type: Number, default: 0 },
    rejectedAt: { type: Date, required: false },
    expiredAt: { type: Date, required: false },
    companyName: { type: String, required: false },
    contry: { type: String, required: false },
    replied: { type: Boolean, default: false },
    type: { type: String, required:true },
}, { timestamps: true });

// employerId: { type: String, required: true },
// applicantId: { type: String, required: true },
// jobTitle: { type: String, required: true },
// companyName: { type: String, required: true },
// contry: { type: String, required: true },
// replied: { type: Boolean, default:false },
// expiredAt: { type: Date, required: true }

module.exports = mongoose.model("offer", Job);
