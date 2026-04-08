import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

// Material UI Imports
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container,
  Select, MenuItem, FormControl, InputLabel, InputAdornment, IconButton
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "./SignUpForm.css";
import { validationSchema } from "../../Helpers/ValidationSchema";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, control, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get("http://localhost:5000/departments/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }
    fetchDepartments();
  }, []);

  const handleVerifyEmail = async () => {
    try {
      await axios.post("http://localhost:5000/verify-email/verify-email", { email });
      toast.info("Check your VS Code Terminal for the OTP!");
    } catch (error) {
      toast.error("Error connecting to server.");
    }
  };

  async function onSubmit(data, e) {
    e.preventDefault();
    data.role = "student";
    try {
      const response = await axios.post("http://localhost:5000/student/register/register", data);
      if (response.data?.success) {
        toast.success("Registration Successful!");
        navigate("/signin");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
    }
  }

  return (
    <div className="signup-page" style={{ paddingTop: "120px" }}>
      <Container component="main" sx={{ backgroundColor: "white", width: "600px", borderRadius: "10px", p: 3 }}>
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}><LockOutlinedIcon /></Avatar>
          <Typography component="h1" variant="h5">Sign Up</Typography>
          
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "25px", width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller name="firstName" control={control} defaultValue="" render={({ field }) => (
                  <TextField {...field} fullWidth label="First Name" error={!!errors.firstName} helperText={errors.firstName?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="lastName" control={control} defaultValue="" render={({ field }) => (
                  <TextField {...field} fullWidth label="Last Name" error={!!errors.lastName} helperText={errors.lastName?.message} />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="uniregno" control={control} defaultValue="" render={({ field }) => (
                  <TextField {...field} fullWidth label="Uni. Reg. Number (4 Digits)" error={!!errors.uniregno} helperText={errors.uniregno?.message} />
                )} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Controller name="gender" control={control} defaultValue="" render={({ field }) => (
                    <Select {...field} label="Gender">
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  )} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Controller name="mobno" control={control} defaultValue="" render={({ field }) => (
                  <TextField {...field} fullWidth label="Mobile Number" error={!!errors.mobno} helperText={errors.mobno?.message} />
                )} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.department}>
                  <InputLabel>Department</InputLabel>
                  <Controller name="department" control={control} defaultValue="" render={({ field }) => (
                    <Select {...field} label="Department">
                      {departments.map((dept) => (
                        <MenuItem key={dept._id} value={dept.name}>{dept.name}</MenuItem>
                      ))}
                    </Select>
                  )} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.batch}>
                  <InputLabel>Batch</InputLabel>
                  <Controller name="batch" control={control} defaultValue="" render={({ field }) => (
                    <Select {...field} label="Batch">
                      <MenuItem value="A">Div A</MenuItem>
                      <MenuItem value="B">Div B</MenuItem>
                      <MenuItem value="C">Div C</MenuItem>
                      <MenuItem value="D">Div D</MenuItem>
                      <MenuItem value="E">Div E</MenuItem>
                      <MenuItem value="F">Div F</MenuItem>
                    </Select>
                  )} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Controller name="graduationyear" control={control} defaultValue="" render={({ field }) => (
                  <TextField {...field} fullWidth label="Graduation Year (2025-2030)" error={!!errors.graduationyear} helperText={errors.graduationyear?.message} />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="email" control={control} defaultValue="" render={({ field }) => (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField {...field} fullWidth label="Email" onChange={(e) => { field.onChange(e); setEmail(e.target.value); }} error={!!errors.email} helperText={errors.email?.message} />
                    <Button variant="contained" onClick={handleVerifyEmail} sx={{ height: "55px" }}>Verify</Button>
                  </Box>
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="otpemail" control={control} defaultValue="" render={({ field }) => (
                  <TextField {...field} fullWidth label="Enter 6-Digit OTP" error={!!errors.otpemail} helperText={errors.otpemail?.message} />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="password" control={control} defaultValue="" render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )} />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
          </form>
          <NavLink to="/signin" style={{ textDecoration: "none", color: "blue" }}>Already have an account? Sign in</NavLink>
        </Box>
      </Container>
    </div>
  );
}