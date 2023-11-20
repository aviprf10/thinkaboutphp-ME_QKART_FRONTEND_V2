// src/components/Login.js

import { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { Link , useHistory} from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from './Footer';
import Header from './Header';
import { config } from '../App';
 
const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateInput = () => {
    const { username, password } = formData;

    if (!username) {
      enqueueSnackbar('Username is a required field', { variant: 'warning' });
      return false;
    }

    if (!password) {
      enqueueSnackbar('Password is a required field', { variant: 'warning' });
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);
      var formObj={
        "username":formData.username,
        "password":formData.password
      }
      const response = await axios.post(
        `${config.endpoint}/auth/login`,
        formObj
      );

      if (response.status === 201) {
        persistLogin(response.data);
        enqueueSnackbar('Logged in successfully', { variant: 'success' });
        history.push('/');
        // Handle successful login, e.g., set user authentication status
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      } else {
        enqueueSnackbar(
          'Something went wrong. Check that the backend is running, reachable, and returns valid JSON.',
          { variant: 'error' }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const persistLogin = (userData) => {
    // Store user information in localStorage
    localStorage.setItem('token',userData.token);
    localStorage.setItem('username',userData.username);
    localStorage.setItem('balance',userData.balance);
  };

  return (
    <div>
      <Header hasHiddenAuthButtons />
      <div className="content">
      <Stack spacing={2}  className="form">
      <h2 className="title">Login</h2>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          name="username"
          placeholder="Enter Username"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          name="password"
          type="password"
          placeholder="Enter Password"
          fullWidth
          onChange={handleInputChange}
        />
        {/* <Stack spacing={2} className="form">
            <Button
              className="button"
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login to QKART'
              )}
            </Button>
          </Stack> */}
          {loading ? (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          ) : (
            <Button
            className="button"
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            >
              Login To Qkart
            </Button>
          )}
          <p className="secondary-action">
            Don't have an account?{' '}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
        </div>
      <Footer />
    </div>
  );
};

export default Login;
