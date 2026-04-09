import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

export default function TeacherAddForm() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required("First name is required")
      .matches(/^[^\s\d]+$/, "Spaces and numbers are not allowed in first name")
      .matches(/^[A-Za-z]+$/, "First name should only contain letters"),
    lastName: yup
      .string()
      .required("Last name is required")
      .matches(/^[A-Za-z\s]+$/, "Last name should only contain letters")
      .matches(/^\D*$/, "Numbers are not allowed in last name"),
    gender: yup.string().required("Gender is required"),
    mobno: yup
      .string()
      .required("Mobile Number is required")
      .matches(
        /^[1-9]\d{9}$/,
        "Mobile number must be exactly 10 digits and not start with zero"
      )
      .test(
        "no-repeated-digits",
        "Repeated digits are not allowed",
        (value) => {
          const repeatingPattern = /(.)\1{9}/;
          return !repeatingPattern.test(value);
        }
      )
      .matches(/^\S*$/, "Spaces are not allowed in the mobile number"),
    email: yup
      .string()
      .required("Email address is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit(data) {
    data.role = "teacher";
    console.log("Submitting Data:", data);
    try {
      const response = await axios.post(
        "http://localhost:5000/teacher/register/register",
        data
      );

      if (response.data && response.data.success === false) {
        toast.error(response.data.message);
      } else if (response.data && response.data.success === true) {
        toast.success(response.data.message);
        navigate("/teacher-management");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again later.");
    }
  }

  return (
    <div>
      <div className="add-teacher-page" style={{ paddingTop: "120px" }}>
        <Container
          component="main"
          sx={{
            backgroundColor: "white",
            margin: "0 auto",
            width: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "10px",
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingLeft: "30px",
              paddingRight: "30px",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add Teacher
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ marginTop: "25px" }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        autoComplete="given-name"
                        fullWidth
                        id="firstName"
                        label="First Name"
                        onBlur={() => trigger("firstName")}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("firstName");
                        }}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        autoComplete="family-name"
                        onBlur={() => trigger("lastName")}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("lastName");
                        }}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Controller
                      name="gender"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="gender-label"
                          id="gender"
                          label="Gender"
                          onChange={(e) => {
                            field.onChange(e);
                            trigger("gender");
                          }}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.gender && (
                      <Typography variant="caption" color="error" sx={{ mt: "3px", ml: "14px" }}>
                        {errors.gender.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="mobno"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="mobno"
                        label="Mobile Number"
                        onBlur={() => trigger("mobno")}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("mobno");
                        }}
                        error={!!errors.mobno}
                        helperText={errors.mobno?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        onBlur={() => trigger("email")}
                        onChange={(e) => {
                          field.onChange(e);
                          setEmail(e.target.value);
                          trigger("email");
                        }}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        onBlur={() => trigger("password")}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("password");
                        }}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </form>
          </Box>
        </Container>
      </div>
    </div>
  );
}