import React, { useState, useEffect } from "react";
import { Step, StepLabel, Stepper, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from "../../../Context/AuthContext"; // Ensure path is correct

import PersonalInfoForm from "../PersonalInfoForm/PersonalInfoForm";
import EducationForm from "../EducationForm/EducationForm";
import SkillsForm from "../SkillsForm/SkillsForm";
import DeclarationForm from "../DeclarationForm/DeclarationForm";

const steps = ["Personal Info", "Education", "Skills", "Declaration"];

function ProfileUpdateStepper() {
  const { auth } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState({
    personalInfo: null,
    education: null,
    skills: null
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const history = useNavigate();

  // 1. FETCH EXISTING DATA ON LOAD
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        setInitialLoading(true);
        // Fetch from the GET routes we found in your server.js
        const [persRes, eduRes, skillRes] = await Promise.all([
          axios.get(`http://localhost:5000/get-personal-details/${auth.email}`),
          axios.get(`http://localhost:5000/get-education-details/${auth.email}`),
          axios.get(`http://localhost:5000/get-skills-details/${auth.email}`)
        ]);

        setFormState({
          personalInfo: persRes.data || null,
          education: eduRes.data || null,
          skills: skillRes.data || null
        });
      } catch (error) {
        console.error("Error fetching existing profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (auth?.email) fetchExistingData();
  }, [auth?.email]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleStepSubmit = async (data, key) => {
    // Merge data into local state
    const updatedFormState = { ...formState, [key]: data };
    setFormState(updatedFormState);

    try {
      // 2. SAVE DATA TO BACKEND
      if (activeStep === 0) {
        await axios.post("http://localhost:5000/studentdetails/personaldetails", data);
        toast.info("Personal details saved!");
      } 
      else if (activeStep === 1) {
        await axios.post("http://localhost:5000/studentdetails/educationdetails", data);
        toast.info("Education details saved!");
      }

      if (activeStep === steps.length - 1) {
        toast.success("Profile Updated Successfully!!!");
        history("/studenthome");
      } else {
        handleNext();
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save. Check backend connection.");
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading your profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', marginTop: "70px", paddingBottom: "50px" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel 
              onClick={() => index < activeStep && setActiveStep(index)} 
              sx={{ cursor: index < activeStep ? 'pointer' : 'default' }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ padding: "20px" }}>
        {activeStep === 0 && (
          <PersonalInfoForm 
            onNext={(data) => handleStepSubmit(data, 'personalInfo')} 
            initialData={formState.personalInfo} 
          />
        )}
        {activeStep === 1 && (
          <EducationForm 
            onNext={(data) => handleStepSubmit(data, 'education')} 
            onBack={handleBack} 
            initialData={formState.education} 
          />
        )}
        {activeStep === 2 && (
          <SkillsForm 
            onNext={(data) => handleStepSubmit(data, 'skills')} 
            onBack={handleBack} 
            initialData={formState.skills} 
          />
        )}
        {activeStep === 3 && (
          <DeclarationForm 
            formData={formState} 
            onBack={handleBack} 
            onNext={() => handleStepSubmit(null, null)} 
          />
        )}
      </Box>
    </Box>
  );
}

export default ProfileUpdateStepper;