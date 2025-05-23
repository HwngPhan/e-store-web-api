const nodemailer = require("nodemailer");
// function sendVerificationEmail(req, res) {
//   const { email, transactionId } = req.body;

//   if (!email || !transactionId) {
//     return res
//       .status(400)
//       .json({ error: "Email and transaction ID are required." });
//   }

//   // Send verification email
//   sendEmail(email, transactionId, res);
// }

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "phanphuochung.07022004@gmail.com",
    pass: "Hung722004",
  },
});

const mailOptions = {
  from: "phanphuochung.07022004@gmail.com",
  to: email,
  subject: "Transaction Verification",
  text: `Your transaction with ID ${transactionId} is being processed.`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return res.status(500).json({ error: "Failed to send email." });
  }
  res.status(200).json({ message: "Verification email sent.", info });
});

module.exports = sendVerificationEmail;
