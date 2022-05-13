const nodemailer = require("nodemailer");



const sendMail = async ({ email, redirect, emailUi, text, code }) => {
    console.log(email, redirect)
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = await nodemailer.createTransport({
                // port: 465,
                // secure: true,
                // host: 'mail.ifbotix.com',
                service: "gmail",
                auth: {
                    user: 'muhammadhanzala180@gmail.com',
                    pass: 'hanzala980pubg'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            let info = await transporter.sendMail({
                from: '"Sojobor" <muhammadhanzala180@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Email Verification", // Subject line
                // text: "Hello world?", // plain text body
                html: emailUi(redirect, text, code), // html body
            });
            if (info) {
                resolve(info)
            };
        } catch (err) {
            reject(err)
        };
    });
};


module.exports = sendMail





// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



// const transporter = nodemailer.createTransport({
//     port: 465,
//     host: 'mail.brandmaker.pk',
//     auth: {
//         user: 'test@brandmaker.pk',
//         pass: 'Abcd@123456!!!'
//     }
// })
// const mailOption = {
//     from: 'test@brandmaker.pk',
//     to: payload.email,
//     subject: 'Temporary link to Reset Password',
//     html: '<p>Click this link to</p>' + '<a href="https://api.ratesmiley.com/forgotPassword/resetpassword/?id=' + payload.id + '&token=' + token + '" method="POST >Reset password</a>' + '<p>for SMS-Senseflow user ' + payload.username + '</p>',
// };








