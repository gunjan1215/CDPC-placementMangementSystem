const express = require("express");
const User = require("../Models/userModel");

const router = express.Router();

// ✅ Dashboard Data API (students + teachers count)
router.get("/", async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const teacherCount = await User.countDocuments({ role: "teacher" });

    res.json({
      students: studentCount,
      teachers: teacherCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Existing route (keep it if needed)
router.get("/placed-students", async (req, res) => {
  try {
    const placedStudents = await User.find({ status: "Placed" });
    res.json(placedStudents);
  } catch (error) {
    console.error("Error fetching placed students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;