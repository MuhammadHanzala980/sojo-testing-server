const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const employerAuth = require("./app/routes/Employer/EmployerAuth");
const profile = require("./app/routes/Employer/Profile");
const jobs = require("./app/routes/Employer/Jobs");
// const applicant = require("./app/routes/Employer/Applicant");
const JobSeekerAuth = require("./app/routes/JobSeeker/JobSeekerAuth");
const JobsListing = require("./app/routes/JobSeeker/JobsListing");
const applicant = require("./app/routes/Common/Applicant");
const jobSeekerProfile = require("./app/routes/JobSeeker/Profile");
const checkout = require("./app/routes/checkout");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const moment = require("moment");
const date = moment().format("Do MMMM YYYY");
require("dotenv").config();
// const stripe = require("stripe");
const path = require('path');

mongoose.connect(process.env.DB_CONNECTION, async (err, suc) => {
  databaseConnect = (await err) == null ? suc : err;
});

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger("dev"));

app.use(express.static(path.join(__dirname, './views')));

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.set("port", process.env.PORT || 8000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "5000kb" }));

app.get("/", (red, res) => res.sendFile(__dirname + "/index.html"));

app.use(express.static("uploads"));
app.use("/api/v1/employer", employerAuth);
app.use("/api/v1/employer", profile);
app.use("/api/v1/employer", jobs);
// ==================================
app.use("/api/v1/job-seeker", JobSeekerAuth);
app.use("/api/v1/job-seeker", JobsListing);
app.use("/api/v1/job-seeker", jobSeekerProfile);
// ==================================
app.use("/api/v1/job", applicant);
// ==================================
app.use("/api/v1/checkout", checkout)

function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}

app.use('/test', handler)





app.listen(app.get("port"), () =>
  console.log(
    `\n********************************************\n         __________________________  \n\n \t    |  SERVER STARTED | \n         __________________________  \n            \n  \t      ${date} \n\n********************************************`
  )
);

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const employerAuth = require("./app/routes/Employer/EmployerAuth");
// // const category = require("./app/routes/category");
// // const subcategory = require("./app/routes/Subcategory");
// // const adminAccount = require("./app/routes/adminAuth");
// // const product = require("./app/routes/Products/StockVideo");
// // const webTemplate = require("./app/routes/Products/WebTemplate");
// // const videoTamplate = require("./app/routes/Products/VideoTamplate");
// // const grahicTamplate = require("./app/routes/Products/GraphicTemplate");
// // const graphics = require("./app/routes/Products/Graphics");
// // const PresentationTemplates = require("./app/routes/Products/PresentationTemplates");
// // const Photos = require("./app/routes/Products/Photos");
// // const fonts = require("./app/routes/Products/Font");
// // const AddOns = require("./app/routes/Products/Add-ons");
// // const CMSTemplates = require("./app/routes/Products/CMSTemplates");
// // const WordPress = require("./app/routes/Products/WordPress");
// // const Jobs = require("./app/routes/Jobs");
// // const JoinUs = require("./app/routes/JoinUs");
// // const Blogs = require("./app/routes/Blogs");
// // const DownloadProdcut = require("./app/routes/downloadProdcut");
// // const AllProduct = require("./app/routes/Products/AllProduct");

// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// const app = express();
// const moment = require("moment");
// const date = moment().format("Do MMMM YYYY");
// require("dotenv").config();

// mongoose.connect(
//   process.env.DB_CONNECTION,
//   async (err, suc) => {
//     databaseConnect = (await err) == null ? suc : err;
//   }
// );

// app.use(cookieParser());
// app.use(cors({ origin: true, credentials: true }));
// app.set("port", process.env.PORT || 8000);
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: "5000kb" }));

// app.get("/", (red, res) => res.sendFile(__dirname + "/index.html"));

// app.use(express.static("uploads"));
// app.use("/employer", employerAuth);
// // app.use("/category", category);
// // app.use("/subcategory", subcategory);
// // app.use("/product", product);
// // app.use("/product", webTemplate);
// // app.use("/product", videoTamplate);
// // app.use("/product", grahicTamplate);
// // app.use("/product", graphics);
// // app.use("/product", PresentationTemplates);
// // app.use("/product", AllProduct);
// // app.use("/product", Photos);
// // app.use("/product", fonts);
// // app.use("/product", AddOns);
// // app.use("/product", CMSTemplates);
// // app.use("/product", WordPress);
// // app.use("/product", DownloadProdcut);
// // app.use("/admin", adminAccount);
// // app.use("/job", Jobs);
// // app.use("/join", JoinUs);
// // app.use("/blogs", Blogs);

// app.listen(app.get("port"), () =>
//   console.log(
//     `\n********************************************\n         __________________________  \n\n \t    |  SERVER STARTED | \n         __________________________  \n            \n  \t     ${date} \n\n********************************************`
//   )
// );