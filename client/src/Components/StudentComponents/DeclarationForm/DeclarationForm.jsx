import React, { useState } from "react";
import { Button, Checkbox, FormControlLabel, Box, Typography } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { toast } from "react-toastify";

function DeclarationForm({ onBack, onNext, formData }) {
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const { auth } = useAuth();

  // This function handles the actual final submission to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!declarationChecked) {
      toast.error("Please check the declaration box before submitting.");
      return;
    }

    try {
      // 1. Call the final save logic in Stepper.jsx
      // This will trigger the navigation and the "Success" toast
      onNext(); 
      
      // 2. Optional: If you still want the PDF to download on submit, 
      // you can call generatePdf() here as well.
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong during submission.");
    }
  };

  const generatePdf = () => {
    axios
      .get(`http://localhost:5000/generate-userdata-pdf/generate-userdata-pdf/${auth.email}`, {
        responseType: "blob",
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "profile.pdf";
        a.click();
      });
  };

  return (
    <Box sx={{ marginLeft: "80px", marginRight: "80px", marginTop: "50px", textAlign: 'center' }}>
      
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        I hereby declare that the information provided in this form is true and accurate
        to the best of my knowledge.
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={declarationChecked}
            onChange={(e) => setDeclarationChecked(e.target.checked)}
            color="primary"
          />
        }
        label="I acknowledge and agree to the declaration above."
      />

      <Box sx={{ mt: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        {/* Force this to be the SUBMIT button */}
        <Button
          variant="contained"
          color="primary"
          disabled={!declarationChecked}
          style={{ paddingLeft: "60px", paddingRight: "60px", fontWeight: "bold" }}
          onClick={handleSubmit}
        >
          SUBMIT
        </Button>

        <Button
          variant="outlined"
          style={{ paddingLeft: "40px", paddingRight: "40px" }}
          onClick={onBack}
        >
          Back
        </Button>
        
        {/* Optional: Keep PDF download as a secondary option if needed */}
        <Button 
          variant="text" 
          size="small" 
          onClick={generatePdf} 
          disabled={!declarationChecked}
          sx={{ mt: 2, color: 'gray' }}
        >
          Download Preview PDF
        </Button>
      </Box>
    </Box>
  );
}

export default DeclarationForm;