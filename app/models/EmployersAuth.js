var mongoose = require("mongoose");
const match =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const employers = mongoose.Schema({
  requiredWorkerType: { type: String, required: true },
  requiredNumberOfWorker: { type: String, required: true },
  requiredeExperienceOfWorker: { type: String, required: true },
  requiredSkillLevel: { type: String, required: true },
  companyEmail: { type: String, required: true, unique: true, match },
  companyName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, require: false },
  sitePictures: { type: [String], require: false },
  salary: { type: String, required: true },
  dateOfPayment: { type: String, required: false },
  workHours: { type: String, required: false },
  overtimeRate: { type: String, required: false },
  allowance: { type: String, required: false },
  deduction: { type: String, required: false },
  paymentInfo: { type: String, required: false },


}, { timestamps: true });
module.exports = mongoose.model("employer", employers);
