const express = require("express");
const router = express.Router();
const Education = require("../Models/educationModel"); 
const Skills = require("../Models/skillsModel");
const Personal = require("../Models/studentDetailsModel");

// --- 1. PERSONAL DETAILS ROUTES ---

// Admin: Get All
router.get("/get-personal-details", async (req, res) => {
  try {
    const data = await Personal.find();
    res.status(200).json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Student: Get by Email
router.get("/get-personal-details/:email", async (req, res) => {
  try {
    const data = await Personal.findOne({ email: req.params.email });
    data ? res.json(data) : res.status(404).json({ error: "Not found" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});


// --- 2. EDUCATION DETAILS ROUTES ---

// Admin: Get All
router.get("/get-education-details", async (req, res) => {
  try {
    const data = await Education.find();
    res.status(200).json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Student: Get by Email
router.get("/get-education-details/:email", async (req, res) => {
  try {
    const data = await Education.findOne({ email: req.params.email });
    data ? res.json(data) : res.status(404).json({ error: "Not found" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});


// --- 3. SKILLS DETAILS ROUTES ---

// Admin: Get All
router.get("/get-skills-details", async (req, res) => {
  try {
    const data = await Skills.find();
    res.status(200).json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Student: Get by Email
router.get("/get-skills-details/:email", async (req, res) => {
  try {
    const data = await Skills.findOne({ email: req.params.email });
    data ? res.json(data) : res.status(404).json({ error: "Not found" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;