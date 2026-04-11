const express = require("express");
const router = express.Router();
const { teacherRegController, teacherLoginController, getAllTeachers } = require('../Controllers/teacherController');
const AuthMiddleware = require("../Middleware/AuthMiddleware");

// REGISTER || Teacher
router.post("/register", async (req, res) => {
    try {
        await teacherRegController(req, res);
    } catch (error) {
        console.error("Error in /register route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// LOGIN || Teacher
router.post("/login", AuthMiddleware, async (req, res) => {
    try {
        await teacherLoginController(req, res);
    } catch (error) {
        console.error("Error in /login route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ GET ALL TEACHERS (UPDATED)
router.get("/", (req, res) => {
    getAllTeachers(req, res);
});

module.exports = router;