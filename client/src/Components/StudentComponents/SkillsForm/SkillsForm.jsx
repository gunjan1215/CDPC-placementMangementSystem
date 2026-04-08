import React, { useState, useEffect } from "react";
import { TextField, Grid, Button } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const blueBorder = {
  borderBottom: "2px solid #2196F3",
};

function SkillsForm({ onNext, onBack, initialData }) {
  const { auth } = useAuth();
  
  // Initialize state with initialData (passed from Stepper) or empty defaults
  const [technicalskills, setTechnicalskills] = useState(initialData?.technicalskills || "");
  const [projects, setProjects] = useState(initialData?.projects || "");
  const [githublink, setGithublink] = useState(initialData?.githublink || "");
  const [linkedinlink, setLinkedinlink] = useState(initialData?.linkedinlink || "");
  const [languagesknown, setLanguagesknown] = useState(initialData?.languagesknown || "");
  
  // Files and their temporary preview URLs
  const [profilephoto, setProfilephoto] = useState(initialData?.profilephoto || null);
  const [profilephotoPreview, setProfilephotoPreview] = useState(initialData?.profilephotoPreview || null);
  const [resume, setResume] = useState(initialData?.resume || null);
  const [resumePreview, setResumePreview] = useState(initialData?.resumePreview || null);

  const [technicalskillsError, setTechnicalskillsError] = useState("");
  const [projectsError, setProjectsError] = useState("");
  const [githublinkError, setGithublinkError] = useState("");
  const [linkedinlinkError, setLinkedinlinkError] = useState("");
  const [languagesknownError, setLanguagesknownError] = useState("");
  const [profilephotoError, setProfilephotoError] = useState("");
  const [resumeError, setResumeError] = useState("");

  const validateTechnicalSkills = (value) => {
    if (!value) setTechnicalskillsError("Technical Skills is required");
    else setTechnicalskillsError("");
  };

  const validateProjects = (value) => {
    if (!value) setProjectsError("Projects is required");
    else if (value.length > 100) setProjectsError("Must be 100 characters or less");
    else setProjectsError("");
  };

  const validateGitHubLink = (value) => {
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
    if (!value) setGithublinkError("GitHub Link is required");
    else if (!urlPattern.test(value)) setGithublinkError("Invalid URL");
    else setGithublinkError("");
  };

  const validateLinkedInLink = (value) => {
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
    if (!value) setLinkedinlinkError("LinkedIn Link is required");
    else if (!urlPattern.test(value)) setLinkedinlinkError("Invalid URL");
    else setLinkedinlinkError("");
  };

  const validateLanguagesKnown = (value) => {
    if (!value) setLanguagesknownError("Languages Known is required");
    else setLanguagesknownError("");
  };

  // Handle File Selections with Preview URLs
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "photo") {
        setProfilephoto(file);
        setProfilephotoPreview(url);
      } else {
        setResume(file);
        setResumePreview(url);
      }
    }
  };

  const skillsData = {
    email: auth.email,
    technicalskills,
    projects,
    githublink,
    linkedinlink,
    languagesknown,
    profilephoto,
    profilephotoPreview, // Saved to Stepper state for "Back" persistence
    resume,
    resumePreview // Saved to Stepper state for "Back" persistence
  };

  async function onSkillsSubmit(event) {
    event.preventDefault();

    validateTechnicalSkills(technicalskills);
    validateProjects(projects);
    validateGitHubLink(githublink);
    validateLinkedInLink(linkedinlink);
    validateLanguagesKnown(languagesknown);

    if (!technicalskills || !projects || !githublink || !linkedinlink || !languagesknown) {
      toast.error("Please fill all required fields");
      return;
    }

    // Pass data back to parent Stepper
    onNext(skillsData, 'skills');

    // API Submission
    try {
      const formData = new FormData();
      formData.append("email", auth.email);
      formData.append("technicalskills", technicalskills);
      formData.append("projects", projects);
      formData.append("githublink", githublink);
      formData.append("linkedinlink", linkedinlink);
      formData.append("languagesknown", languagesknown);
      if (profilephoto) formData.append("profilephoto", profilephoto);
      if (resume) formData.append("resume", resume);

      await axios.post("http://localhost:5000/studentdetails/skillsdetails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  return (
    <form style={{ marginLeft: "80px", marginRight: "80px", marginTop: "50px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Technical Skills"
            fullWidth
            value={technicalskills}
            onChange={(e) => { setTechnicalskills(e.target.value); validateTechnicalSkills(e.target.value); }}
            InputProps={{ style: blueBorder }}
            error={!!technicalskillsError}
            helperText={technicalskillsError}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Projects"
            fullWidth
            value={projects}
            onChange={(e) => { setProjects(e.target.value); validateProjects(e.target.value); }}
            InputProps={{ style: blueBorder }}
            error={!!projectsError}
            helperText={projectsError}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="GitHub Link"
            fullWidth
            value={githublink}
            onChange={(e) => { setGithublink(e.target.value); validateGitHubLink(e.target.value); }}
            InputProps={{ style: blueBorder }}
            error={!!githublinkError}
            helperText={githublinkError}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="LinkedIn Link"
            fullWidth
            value={linkedinlink}
            onChange={(e) => { setLinkedinlink(e.target.value); validateLinkedInLink(e.target.value); }}
            InputProps={{ style: blueBorder }}
            error={!!linkedinlinkError}
            helperText={linkedinlinkError}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Languages Known"
            fullWidth
            value={languagesknown}
            onChange={(e) => { setLanguagesknown(e.target.value); validateLanguagesKnown(e.target.value); }}
            InputProps={{ style: blueBorder }}
            error={!!languagesknownError}
            helperText={languagesknownError}
          />
        </Grid>

        {/* Profile Photo Section with View feature */}
        <Grid item xs={12}>
          <FormLabel style={{ display: 'block', marginBottom: '8px' }}>Profile Photo</FormLabel>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "photo")} />
          {profilephotoPreview && (
            <div style={{ marginTop: "10px" }}>
              <img src={profilephotoPreview} alt="Preview" style={{ width: "100px", borderRadius: "8px", border: "1px solid #ddd" }} />
              <p style={{ fontSize: "12px", color: "gray" }}>Currently selected: {profilephoto?.name || "Stored Photo"}</p>
            </div>
          )}
        </Grid>

        {/* Resume Section with View feature */}
        <Grid item xs={12}>
          <FormLabel style={{ display: 'block', marginBottom: '8px' }}>Resume (PDF)</FormLabel>
          <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, "resume")} />
          {resumePreview && (
            <div style={{ marginTop: "10px" }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => window.open(resumePreview, "_blank")}
              >
                View Selected Resume
              </Button>
              <p style={{ fontSize: "12px", color: "gray" }}>Currently selected: {resume?.name || "Stored Resume"}</p>
            </div>
          )}
        </Grid>
      </Grid>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", marginBottom: "30px" }}>
        <Button variant="outlined" style={{ paddingLeft: "40px", paddingRight: "40px" }} onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" style={{ paddingLeft: "40px", paddingRight: "40px" }} onClick={onSkillsSubmit}>
          Next
        </Button>
      </div>
    </form>
  );
}

// Helper to keep label alignment
const FormLabel = ({ children, style }) => <label style={{ fontWeight: 'bold', fontSize: '14px', ...style }}>{children}</label>;

export default SkillsForm;