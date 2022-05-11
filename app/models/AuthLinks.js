var mongoose = require("mongoose");
const authLinks = mongoose.Schema({
    authLink: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model("authLinks", authLinks);
