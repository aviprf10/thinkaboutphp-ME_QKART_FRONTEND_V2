import { Button, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { config } from "../App";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
   
    if (!validateInput(formData)) {
      return; // Stop further execution if validation fails
    }

    try {
      setLoading(true); // Set loading to true before API call
      var formObj={
        "username":formData.username,
        "password":formData.password
      }
      // Make your Axios POST request here
      const response = await axios.post(`${config.endpoint}/auth/register`, formObj);
      // console.log('response', response);
      if (response.status === 201) {
        // Registration successful
        enqueueSnackbar('Registered successfully', { variant: 'success' });
        history.push('/login');
        // Optionally, you can redirect the user to another page
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Registration error with specific message
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      } else {
        // Other errors
        enqueueSnackbar(
          'Something went wrong. Check that the backend is running, reachable, and returns valid JSON.',
          { variant: 'error' }
        );
      }
    } finally {
      setLoading(false); // Set loading to false after the API call is complete
    }
  };

  const validateInput = (data) => {
    const { username, password, confirmPassword } = data;
  
    if (!username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
  
    if (username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: "warning" });
      return false;
    }
  
    if (!password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
  
    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "warning" });
      return false;
    }
  
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }
  
    return true; // Validation passed
  };
  

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField 
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be at least 6 characters length"
            fullWidth
            placeholder="Enter a password with a minimum of 6 characters"
            onChange={handleInputChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={handleInputChange}
          />
          {/* <Stack spacing={2} className="form"> */}
            {/* Existing input fields */}
            {/* <Button
              className="button"
              variant="contained"
              onClick={handleRegister}
              disabled={loading} // Disable the button when loading
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" /> // Show loader if loading
              ) : (
                "Register Now"
              )}
            </Button> */}
            {/* Existing code... */}
          {/* </Stack> */}
          {loading ? (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          ) : (
            <Button
            className="button"
            variant="contained"
            onClick={handleRegister}
            disabled={loading} // Disable the button when loading
            >
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
