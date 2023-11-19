import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import React,{useState} from "react";
import "./Header.css";

const Header = ({
  children,
  hasHiddenAuthButtons,
}) => {
  const history = useHistory();
  const userLoggedIn = localStorage.getItem("token") ? true : false;
  const userName = localStorage.getItem("username");
  const [forDeskTop, setForDeskTop] = useState(true);

  const backToExplore = () => {
    history.push("/", { from: "Header" });
  };
  return (
    <Box>
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {/*for desktop*/}
        <Box>{children}</Box>

        {hasHiddenAuthButtons && !userLoggedIn ? (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={backToExplore}
          >
            Back to explore
          </Button>
        ) : (
          <ProductHeader isLoggedIn={userLoggedIn} username={userName} />
        )}
      </Box>
      <Box>{/*for mobile*/}
        {/*{children}*/}
      </Box>
    </Box>
  );
};

const ProductHeader = (props) => {
  const history = useHistory();

  const onLogOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const onRegister = () => {
    history.push("/register", { from: "Header" });
  };

  const onLogin = () => {
    // history.push("/login", { from: "Header" });
    history.push({
      pathname: `/login`,
      state: props.username,
    });
  };

  if (props.isLoggedIn === true) {
    return (
      <Stack direction="row" alignItems="center" gap={1}>
        <Box>
          <Avatar alt={props.username} src="avatar.png" />
        </Box>
        <Box className="username-text">{props.username}</Box>
        <Button className="button" onClick={onLogOut}>
          logout
        </Button>
      </Stack>
    );
  } else {
    return (
      <Box>
        <Button className="button" onClick={onLogin}>
          Login
        </Button>
        <Button className="button" variant="contained" onClick={onRegister}>
          Register
        </Button>
      </Box>
    );
  }
};

export default Header;
