
const express = require("express")
const router = express.Router();
const Employer = require("../models/EmployersAuth")
const Cryptr = require('cryptr');
const stripe = require("stripe")("sk_test_51K46yCFn2LpnmXjwzRpyo6gOhmAG4WIa17bz33uUVJ5vs3d21jovkSYyzbVnBiiPBTaZQZalyNY60MRPIc9j2toW00M19WXXRw");
// const env = require("dotenv")
require("dotenv").config();
const cryptr = new Cryptr(process.env.URL_KEY);


const { Paynow } = require("paynow");
let paynow = new Paynow("INTEGRATION_ID", "INTEGRATION_KEY");

paynow.resultUrl = "http://example.com/gateways/paynow/update";
paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";



let payment = paynow.createPayment("Invoice 35");

router.get("/paynow-payment", (req, res) => {

  // // Add items to the payment list passing in the name of the item and it's price
  payment.add("Bananas", 2.5);
  payment.add("Apples", 3.4);

  // // Send off the payment to Paynow
  paynow.send(payment).then((response) => {

    // Check if request was successful
    if (response.success) {
      // Get the link to redirect the user to, then use it as you see fit
      let link = response.redirectUrl;

      // Save poll url, maybe (recommended)?
      let pollUrl = response.pollUrl;
    }

  });

});



router.post("/stripe-payment", (req, res) => {
  console.log("00000")
  const { amount, email, token, employerId, paymentInfo } = req.body;
  console.log(req.body)
  stripe.customers
    .create({
      email: email,
      source: token.id,
      name: token.card.name,
    }).then((customer) => {
      return stripe.charges.create({
        amount: parseFloat(amount) * 100,
        description: `Payment for USD ${amount}`,
        currency: "USD",
        customer: customer.id,
      });
    })
    .then(async (charge) => {
      const decryptedData = cryptr.decrypt(link.hash);
      await Employer.updateOne({ _id: employerId }, { paymentInfo: decryptedData })
      res.status(200).send(charge)
    })
    .catch((err) => console.log(err));
});



module.exports = router;


// const express = require("express")
// const router = express.Router();

// const stripe = require('stripe')("sk_test_51K46yCFn2LpnmXjwzRpyo6gOhmAG4WIa17bz33uUVJ5vs3d21jovkSYyzbVnBiiPBTaZQZalyNY60MRPIc9j2toW00M19WXXRw"); // Add your Secret Key Here

// // console.log(process.env, "----",process.env.JWT_SECRET)


// router.post("/payment", (req, res) => {
//   console.log(req.body)
//   try {
//     // stripe.customers
//     //   .create({
//     //     name: "Maaz Ahmed",
//     //     email: "xyz@gmail.com",
//     //     source: req.body.token
//     //   })
//     //   .then(customer => {
//     //     console.log(customer)
//     //     stripe.charges.create({
//     //       amount: req.body.amount * 100,
//     //       currency: "usd",
//     //       customer: customer.id
//     //     })
//     //   }).then((ret) => {
//     //     // console.log(ret)
//     //     res.render("completed.html")
//     //   })
//     //   .catch(err => console.log(err));
//   } catch (err) {
//     console.log(err)
//     res.send(err);
//   }
// });


// module.exports = router;