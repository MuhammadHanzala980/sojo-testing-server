var mongoose = require("mongoose");


const employee_Id = mongoose.Schema({
    employee_Id: { type: String, required: true },
    employeeName: { type: String, required: true },
    employerId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    hiring: { type: Number, default: 0 },
    WP_Application: { type: Number, default: false },
    medicalInsurance: { type: Number, default: false },
    securityBond: { type: Number, default: false },
    healthCheck_up: { type: Number, default: false },
    flightTicketPurchase: { type: Number, default: false },
}, {
    timestamps: true
});


module.exports = mongoose.model("employee", employee_Id);
