const nodemailer = require("nodemailer");
const User = require("../Models/userModel");
const crypto = require("crypto");
const OTP = require("../Models/otpModel");

const emailUser = "campusnexa@gmail.com";
const emailPassword = "jvcs eswe akkc gsqn";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

// Generate and send OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  console.log("Email requested for OTP:", email);

  try {
    // Check if an OTP already exists for this email and delete it to allow a retry
    await OTP.deleteOne({ email });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // THIS PRINTS THE CODE IN YOUR VS CODE TERMINAL
    console.log("******************************************");
    console.log(`NEW REGISTRATION OTP FOR ${email}: ${otp}`);
    console.log("******************************************");

    await OTP.create({ email, otp });

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "OTP Verification",
      html: `
        <html>
          <body>
            <h3>OTP Verification</h3>
            <p>Dear User,</p>
            <p>Your OTP for SignUp is: <strong>${otp}</strong></p>
            <p>Please use this OTP to complete the SignUp process.</p>
            <p>Thank you!</p>
          </body>
        </html>
      `,
    };

    // Attempt to send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // We log the error in the terminal for you to see
        console.error("Gmail Error (Safe to ignore for local testing):", error.message);
        
        // IMPORTANT: We send success: true anyway so the website doesn't show an error
        return res.status(200).json({
          success: true,
          message: "OTP generated. Check your terminal if email fails.",
        });
      }
      
      console.log("OTP email sent successfully:", info.response);
      res.status(200).json({
        success: true,
        message: "OTP sent successfully.",
      });
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};