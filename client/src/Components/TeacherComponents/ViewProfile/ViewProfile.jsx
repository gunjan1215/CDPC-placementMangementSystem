import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  FormControl, 
  InputLabel, 
  Input, 
  Typography, 
  Box, 
  Divider, 
  Paper,
  Avatar,
  Button
} from '@mui/material';
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext"; 
import { Link } from 'react-router-dom';

function ViewProfile() {
  const { auth } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStudentData = async () => {
      try {
        const email = auth.email;
        const userId = auth._id;

        // 1. Fetch Basic Personal Info
        const userRes = await axios.get(`http://localhost:5000/get-user-byid/get-user-byid/get-user-byid/${userId}`);
        
        // 2. Fetch Education Details
        const eduRes = await axios.get(`http://localhost:5000/get-education-details/get-education-details/get-education-details/${email}`);
        
        // 3. Fetch Skills & Links
        const skillsRes = await axios.get(`http://localhost:5000/get-skills-details/get-skills-details/get-skills-details/${email}`);

        // Merge all data into one state object
        setProfileData({
          ...userRes.data,
          ...eduRes.data,
          ...skillsRes.data,
          // Mapping specific names if they differ in your DB
          fullName: `${userRes.data.firstname} ${userRes.data.lastname}`,
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    if (auth && (auth.email || auth._id)) {
      fetchAllStudentData();
    }
  }, [auth]);

  if (loading) return <Typography sx={{ p: 5 }}>Loading Profile...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: "1000px", margin: "auto" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: '15px' }}>
        
        {/* Header Section with Profile Photo */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 4 }}>
          <Grid item>
            <Avatar 
              src={`http://localhost:5000/uploads/${profileData.profilephoto}`} 
              sx={{ width: 120, height: 120, border: '3px solid #1976D2' }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{profileData.fullName}</Typography>
            <Typography variant="h6" color="textSecondary">{profileData.departmentName || "Student"}</Typography>
            <Button 
              component={Link} 
              to="/student/update-profile" 
              variant="contained" 
              size="small" 
              sx={{ mt: 1 }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          {/* PERSONAL INFORMATION */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>Personal Information</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="standard">
              <InputLabel shrink>Email Address</InputLabel>
              <Input value={profileData.email || ""} readOnly />
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="standard">
              <InputLabel shrink>Phone Number</InputLabel>
              <Input value={profileData.phoneno || ""} readOnly />
            </FormControl>
          </Grid>

          {/* ACADEMIC RECORDS */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" sx={{ mt: 3 }} gutterBottom>Academic Records</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="standard">
              <InputLabel shrink>10th Percentage</InputLabel>
              <Input value={`${profileData.tenthpercentage || "0"}%`} readOnly />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="standard">
              <InputLabel shrink>12th Percentage</InputLabel>
              <Input value={`${profileData.twelthpercentage || "0"}%`} readOnly />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="standard">
              <InputLabel shrink>Current CGPA</InputLabel>
              <Input value={profileData.mcaaggregateCGPA || profileData.ugCGPA || "N/A"} readOnly />
            </FormControl>
          </Grid>

          {/* SKILLS & LINKS */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" sx={{ mt: 3 }} gutterBottom>Skills & Links</Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <InputLabel shrink>Technical Skills</InputLabel>
              <Input value={profileData.technicalskills || "Not specified"} readOnly multiline />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" display="block" color="textSecondary">GitHub Profile</Typography>
            {profileData.githublink ? (
              <a href={profileData.githublink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2', textDecoration: 'none' }}>
                {profileData.githublink}
              </a>
            ) : "Not Provided"}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" display="block" color="textSecondary">LinkedIn Profile</Typography>
            {profileData.linkedinlink ? (
              <a href={profileData.linkedinlink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2', textDecoration: 'none' }}>
                {profileData.linkedinlink}
              </a>
            ) : "Not Provided"}
          </Grid>

          {/* RESUME VIEW */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            {profileData.resume && (
              <Button 
                variant="outlined" 
                onClick={() => window.open(`http://localhost:5000/uploads/${profileData.resume}`, "_blank")}
              >
                📄 View Resume (PDF)
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default ViewProfile;