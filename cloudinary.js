

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dsbyuiqi4",
    api_key: "898137539542693",
    api_secret: "RO_6Bq9p0DKiE-MBHvN4u-ZnFEc",
});

module.exports = { cloudinary };
