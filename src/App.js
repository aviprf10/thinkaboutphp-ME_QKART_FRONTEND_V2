import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Register from './components/Register';
import Login from './components/Login';
import Products from './components/Products';
import Checkout from './components/Checkout';
import Thanks from './components/Thanks';
import ipConfig from './ipConfig.json';

import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

export const config = {
  endpoint: `https://qkart-frontend-kkj4.onrender.com/api/v1`,
};

const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route path="/" exact component={Products} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/thanks" component={Thanks} />
            {/* Add more routes as needed */}
          </Switch>
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
