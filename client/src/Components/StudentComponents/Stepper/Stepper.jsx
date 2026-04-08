import React, { useState, useEffect } from "react";
import { Button, Step, StepLabel, Stepper, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import PersonalInfoForm from "../PersonalInfoForm/PersonalInfoForm";
import EducationForm from "../EducationForm/EducationForm";
import SkillsForm from "../SkillsForm/SkillsForm";
import DeclarationForm from "../DeclarationForm/DeclarationForm";

const steps = [
  "Step 1: Personal Information",
  "Step 2: Education Records",
  "Step 3: Skills",
  "Step 4: Declaration"
];

function ProfileUpdateStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState({});
  const history = useNavigate();

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepSubmit = async (data, key) => {
    // 1. First, merge the data from the current step into formState
    let updatedFormState = { ...formState };
    if (key && data) {
      updatedFormState = {
        ...formState,
        [key]: data,
      };
      setFormState(updatedFormState);
    }

    // 2. Check if we are on the final step (Declaration)
    if (activeStep === steps.length - 1) {
      try {
        // Final API submission can be handled here or inside DeclarationForm
        // Setting success flag for the UI
        localStorage.setItem('profileUpdateSuccess', 'true'); 
        
        toast.success("Profile Updated Successfully!!!");
        history("/studenthome");
      } catch (error) {
        console.error("Final Submission Error:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    } else {
      // Move to next step
      handleNext();
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  const handleStepLabelClick = (stepIndex) => {
    // Only allow clicking back to steps already visited
    if (stepIndex < activeStep) {
      setActiveStep(stepIndex);
    }
  };

  return (
    <Box sx={{ width: '100%', marginTop: "70px", paddingBottom: "50px" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel 
              onClick={() => handleStepLabelClick(index)} 
              sx={{ cursor: index < activeStep ? 'pointer' : 'default' }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ padding: { xs: "10px", md: "20px" } }}>
        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h5">Profile Updated Successfully!</Typography>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="h6"
              sx={{
                marginTop: "40px",
                marginBottom: "20px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#1976D2"
              }}
            >
              {steps[activeStep]}
            </Typography>

            {/* Step 1: Personal Info */}
            {activeStep === 0 && (
              <PersonalInfoForm 
                onNext={(data) => handleStepSubmit(data, 'personalInfo')} 
                initialData={formState.personalInfo} 
              />
            )}
            
            {/* Step 2: Education */}
            {activeStep === 1 && (
              <EducationForm 
                onNext={(data) => handleStepSubmit(data, 'education')} 
                onBack={handleBack} 
                initialData={formState.education} 
              />
            )}
            
            {/* Step 3: Skills */}
            {activeStep === 2 && (
              <SkillsForm 
                onNext={(data) => handleStepSubmit(data, 'skills')} 
                onBack={handleBack} 
                initialData={formState.skills} 
              />
            )}
            
            {/* Step 4: Declaration */}
            {activeStep === 3 && (
              <DeclarationForm 
                formData={formState} 
                onBack={handleBack} 
                onNext={() => handleStepSubmit(null, null)} // Triggers final submission
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ProfileUpdateStepper;