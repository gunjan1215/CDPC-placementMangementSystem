const express = require("express");
const router = express.Router();
const Education = require("../Models/educationModel"); 
const Skills = require("../Models/skillsModel");
const Personal = require("../Models/studentDetailsModel");

// Get Personal Details by Email
router.get("/get-personal-details/:email", async (req, res) => {
  try {
    const { email } = req.params;
    // Find the specific record matching this email
    const personalDetails = await Personal.findOne({ email: email });
    
    if (personalDetails) {
      res.status(200).json(personalDetails);
    } else {
      res.status(404).json({ error: "Personal details not found for this email" });
    }
  } catch (error) {
    console.error("Error in /get-personal-details route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Education details by Email
router.get("/get-education-details/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const educationDetails = await Education.findOne({ email: email });
    
    if (educationDetails) {
      res.status(200).json(educationDetails);
    } else {
      res.status(404).json({ error: "Education details not found for this email" });
    }
  } catch (error) {
    console.error("Error in /get-education-details route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Skills details by Email
router.get("/get-skills-details/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const skillsDetails = await Skills.findOne({ email: email });
    
    if (skillsDetails) {
      res.status(200).json(skillsDetails);
    } else {
      res.status(404).json({ error: "Skills details not found for this email" });
    }
  } catch (error) {
    console.error("Error in /get-skills-details route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;