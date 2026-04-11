const { hashPassword, comparePassword } = require('../Helpers/registerHelper');
const User = require('../Models/userModel');
const JWT = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const emailUser = "campusnexa@gmail.com";
const emailPassword = "jvcs eswe akkc gsqn";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

// ✅ GET ALL TEACHERS (IMPORTANT FIX)
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }); // 🔥 filter teachers only

    console.log("Teachers fetched:", teachers); // debug

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Teacher Register Controller
const teacherRegController = async (req, res) => {
  try {
    const formData = req.body;

    const existingUser = await User.findOne({ email: formData.email });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered ,Please Login",
      });
    }

    const hashedPassword = await hashPassword(formData.password);

    const newTeacher = new User({
      firstname: formData.firstName,
      lastname: formData.lastName,
      gender: formData.gender,
      departmentId: formData.department,
      batch: formData.batch,
      mobno: formData.mobno,
      email: formData.email,
      password: hashedPassword,
      role: formData.role || "teacher", // 🔥 ensure role
    });

    await newTeacher.save();

    const mailOptions = {
      from: emailUser,
      to: formData.email,
      subject: 'Teacher Registration Confirmation',
      text: `You have been successfully registered as a teacher.\nYour email: ${formData.email}\nYour password: ${formData.password}`,
    };

    res.status(200).send({
      success: true,
      message: "Teacher Registered Successfully",
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email not sent: " + error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in signup",
      error: error,
    });
  }
};

//Teacher Login Controller
const teacherLoginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await User.findOne({ email, role: "teacher" }); // 🔥 FIX

    if (!teacher) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    const isPasswordValid = await comparePassword(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = JWT.sign(
      { _id: teacher._id, role: teacher.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      token,
    });

  } catch (error) {
    console.error('Error during teacher login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  teacherRegController,
  teacherLoginController,
  getAllTeachers // ✅ VERY IMPORTANT
};