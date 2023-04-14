import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/Login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "green" }}>
      <AppBar position="static">
        <Toolbar sx={{ bgcolor: "green" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <p>{user?.email}</p>
          <p>（{user?.uid}）</p>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
