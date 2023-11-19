import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Register from './components/Register';
import Login from './components/Login';
import Products from './components/Products';
import ipConfig from './ipConfig.json';

import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
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
            {/* Add more routes as needed */}
          </Switch>
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
